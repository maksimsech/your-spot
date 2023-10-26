import type {
    Bounds,
    Spot,
} from '@your-spot/contracts'
import {
    WithId,
    Spot as DbSpot,
    spotCollection,
} from '@your-spot/database'

import {
    boundsToCoordinates,
    createContractCoordinate,
    createMongoCoordinate,
} from './coordinate-service'
import {
    stringToObjectId,
    toWithStringId,
} from './objectid-service'


export function createSpot(spot: Omit<Spot, 'id'>) {
    const dbSpot = {
        ...spot,
        coordinate: createMongoCoordinate(spot.coordinate),
    }

    return spotCollection.insertOne(dbSpot)
}

export async function getSpot(spotId: string) {
    let objectId = null
    try {
        objectId = stringToObjectId(spotId)
    }
    catch
    {
        return null
    }

    const dbSpot = await spotCollection.findOne({
        _id: objectId,
    })
    if (!dbSpot) {
        return null
    }

    return createSpotFromDbSpot(dbSpot)
}

export async function getAllSpots() {
    const dbSpots = await spotCollection.find().toArray()

    return dbSpots.map(createSpotFromDbSpot)
}

export async function getSpotsWithinBounds(bounds: Bounds): Promise<Spot[]> {
    const dbSpots = await spotCollection
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
        .toArray()

    return dbSpots.map(createSpotFromDbSpot)
}

function createSpotFromDbSpot(spot: WithId<DbSpot>): Spot {
    return {
        ...toWithStringId(spot),
        coordinate: createContractCoordinate(spot.coordinate),
    }
}

