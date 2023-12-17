import {
    distance,
    area,
} from '@turf/turf'

import type {
    Bounds,
    SpotGroup,
    SpotInfo,
} from '@your-spot/contracts'
import {
    type WithId,
    type Spot as DbSpot,
    spotCollection,
    MongoServerError,
} from '@your-spot/database'

import { objectIdToString } from '../common'

import {
    boundsToCoordinates,
    createContractCoordinate,
} from './coordinate'
import { createSpotInfo } from './mapper'
import { getDistanceForGroupByZoom } from './zoom-distance'


type DbSpotInfo = Pick<WithId<DbSpot>, '_id' | 'coordinate'>
type DbSpotGroup = { spot: DbSpotInfo, nearSpots: Array<DbSpotInfo> }
type SpotGroupsResult = {
    spotGroups: readonly SpotGroup[]
    spots: readonly SpotInfo[]
}

const maxArea = 390000000000
const emptyResponse = {
    spotGroups: [],
    spots: [],
}

const logLabel = 'spot-groups/getSpotsAndGroupsWithinBounds'
// TODO: Revisit for optimization, revisit turf for better algorithms, etc.
export async function getSpotsAndGroupsWithinBounds(bounds: Bounds, zoom: number): Promise<SpotGroupsResult> {
    let dbSpots: DbSpotInfo[]

    if (!isAreaWithinAllowed(bounds)) {
        return emptyResponse
    }

    console.time(logLabel)

    try {
        dbSpots = await filterSpotsWithinBounds(bounds)
            .project<DbSpotInfo>({
                coordinate: 1,
            })
            .toArray()
    }
    catch (e) {
        if (e instanceof MongoServerError && e.code === 2 && e.codeName === 'BadValue') {
            console.warn(`${logLabel} Wrong bounds were passed to getSpotsAndGroupsWithinBounds`, bounds)

            return emptyResponse
        } else {
            throw e
        }
    }

    console.timeLog(logLabel, `dbSpots.length: ${dbSpots.length}`)

    const graph = createSpotGraph(dbSpots)
    const distance = getDistanceForGroupByZoom(zoom)
    const spotGroups = getSpotGroups(dbSpots, graph, distance)
    const result = mapSpotGroups(spotGroups)

    console.timeLog(logLabel, `groups: ${result.spotGroups.length} spots: ${result.spots.length}`)
    console.timeEnd(logLabel)

    return result
}

function isAreaWithinAllowed(bounds: Bounds) {
    const boundsArea = area({
        type: 'Polygon',
        coordinates: boundsToCoordinates(bounds),
    })

    return boundsArea < maxArea
}

function filterSpotsWithinBounds(bounds: Bounds) {
    return spotCollection
        .find({
            coordinate: {
                $geoWithin: {
                    $geometry: {
                        type: 'Polygon',
                        coordinates: boundsToCoordinates(bounds),
                    },
                },
            },
        })
}

// TODO: Check for more optimal way of storing
function createSpotGraph(spots: ReadonlyArray<DbSpotInfo>) {
    const graph: Array<Array<number>> = []
    for (let i = 0; i < spots.length; i++) {
        graph.push([])
    }

    for (let i = 0; i < spots.length - 1; i++) {
        graph[i][i] = 0

        for (let j = i + 1; j < spots.length; j++) {
            graph[i][j] = graph[j][i] = distance(spots[i].coordinate, spots[j].coordinate)
        }
    }

    return graph
}

function getSpotGroups(
    spots: ReadonlyArray<DbSpotInfo>,
    graph: ReadonlyArray<ReadonlyArray<number>>,
    maximumDistance: number,
) {
    const spotGroups: Array<DbSpotGroup> = []
    for (let i = 0; i < spots.length; i++) {
        const spotGroup: DbSpotGroup = {
            spot: spots[i],
            nearSpots: [],
        }
        spotGroups.push(spotGroup)

        for (let j = 0; j < spots.length; j++) {
            if (i === j) {
                continue
            }

            const distance = graph[i][j]
            if (distance <= maximumDistance) {
                spotGroup.nearSpots.push(spots[j])
            }
        }
    }

    spotGroups.sort((a, b) => a.nearSpots.length - b.nearSpots.length)

    const forDeletion: Array<DbSpotGroup> = []
    for (let i = 0; i < spotGroups.length - 1; i++) {
        const spotGroup = spotGroups[i]
        if (spotGroup.nearSpots.length === 0) {
            continue
        }

        for (let j = i + 1; j < spotGroups.length; j++) {
            const spotGroupToCompare = spotGroups[j]
            if (spotGroup.nearSpots.includes(spotGroupToCompare.spot)) {
                spotGroupToCompare.nearSpots = []
                forDeletion.push(spotGroupToCompare)
            }
        }
    }

    return spotGroups.filter(sg => !forDeletion.includes(sg))
}

function mapSpotGroups(spotGroups: Array<DbSpotGroup>) {
    return spotGroups.reduce(
        (acc, current) => {
            if (current.nearSpots.length > 0) {
                acc.spotGroups.push({
                    coordinate: createContractCoordinate(current.spot.coordinate),
                    spotIds: [objectIdToString(current.spot._id), ...current.nearSpots.map(s => objectIdToString(s._id))],
                })
            }
            else {
                acc.spots.push(createSpotInfo(current.spot))
            }

            return acc
        },
        // TODO: Create writable mapping from original type
        { spotGroups: [], spots: [] } as { spotGroups: Array<SpotGroup>, spots: Array<SpotInfo> },
    )
}
