import type {
    Bounds,
    SpotGroup,
    SpotInfo,
} from '@your-spot/contracts'
import {
    type WithId,
    type Spot as DbSpot,
    type Coordinate as DbCoordinate,
    spotCollection,
} from '@your-spot/database'

import { objectIdToString } from '../common'

import {
    boundsToCoordinates,
    createContractCoordinate,
} from './coordinate'
import { createSpotInfo } from './mapper'
import { getDistanceForGroupByZoom } from './zoom-distance'


type DbSpotInfo = Pick<WithId<DbSpot>, '_id' | 'coordinate'>

export async function getSpotsAndGroupsWithinBounds(bounds: Bounds, zoom: number) {
    const dbSpots = await filterSpotsWithinBounds(bounds)
        .project<DbSpotInfo>({
            coordinate: 1,
        })
        .toArray()


    // TODO:
    // 1. Create graph
    const graph = createSpotGraph(dbSpots)
    // 2. Find length less than specified for zoom
    const distance = getDistanceForGroupByZoom(zoom)
    // 3. Calculate groups
    const spotGroups = getSpotGroups(dbSpots, graph, distance)
    // 4. Get spots w/o groups
    return mapSpotGroups(spotGroups)
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

function createSpotGraph(spots: ReadonlyArray<DbSpotInfo>) {
    const graph: Array<Array<number>> = []
    for (let i = 0; i < spots.length; i++) {
        graph.push([])
    }

    for (let i = 0; i < spots.length - 1; i++) {
        graph[i][i] = 0

        for (let j = i + 1; j < spots.length; j++) {
            const distance = getDistanceBetweenCoordinates(spots[i].coordinate, spots[j].coordinate)

            graph[i][j] = graph[j][i] = distance
        }
    }

    return graph
}

function getDistanceBetweenCoordinates(first: DbCoordinate, second: DbCoordinate) {
    const { lat: lat1, lon: lon1 } = getLatLon(first)
    const { lat: lat2, lon: lon2 } = getLatLon(second)

    // ref: http://www.movable-type.co.uk/scripts/latlong.html
    const R = 6371e3 // metres
    const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2-lat1) * Math.PI / 180
    const Δλ = (lon2-lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
        + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // in metres

    function getLatLon(coordinate: DbCoordinate) {
        const { 0: lon, 1: lat } = coordinate.coordinates

        return {
            lon,
            lat,
        }
    }
}


type DbSpotGroup = { spot: DbSpotInfo, nearSpots: Array<DbSpotInfo> }
function getSpotGroups(
    spots: ReadonlyArray<DbSpotInfo>,
    graph: ReadonlyArray<ReadonlyArray<number>>,
    maximumDistance: number,
) {
    // § 0 1 2 3 4 5
    // 0 0 - - - - -
    // 1 - 0 - - - -
    // 2 - - 0 - - -
    // 3 - - - 0 - -
    // 4 - - - - 0 -
    // 5 - - - - - 0

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

type SpotGroupsResult = {
    spotGroups: Array<SpotGroup>
    spots: Array<SpotInfo>
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
        { spotGroups: [], spots: [] } as SpotGroupsResult,
    )
}
