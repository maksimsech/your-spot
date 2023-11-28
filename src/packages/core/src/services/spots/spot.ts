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
    objectIdToString,
    stringToObjectId,
    toWithStringId,
} from '../common'

import {
    boundsToCoordinates,
    createContractCoordinate,
    createMongoCoordinate,
} from './coordinate'


export function createSpot(spot: Omit<Spot, 'id'>) {
    const authorObjectId = spot.authorId
        ? stringToObjectId(spot.authorId)
        : null

    const dbSpot = {
        ...spot,
        coordinate: createMongoCoordinate(spot.coordinate),
        authorId: authorObjectId,
    }

    return spotCollection.insertOne(dbSpot)
}

export async function deleteSpot(spotId: string) {
    const objectId = stringToObjectId(spotId)

    await spotCollection.deleteOne({
        _id: objectId,
    })
}

export async function updateSpot(spot: Spot) {
    const objectId = stringToObjectId(spot.id)

    await spotCollection.updateOne({
        _id: objectId,
    }, {
        $set: {
            title: spot.title,
            description: spot.description,
        },
    }, {
        upsert: false,
    })
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

export async function getSpotsForAuthor(authorId: string) {
    let authorObjectId = null
    try {
        authorObjectId = stringToObjectId(authorId)
    }
    catch
    {
        return []
    }

    const dbSpots = await spotCollection.find({ authorId: authorObjectId }).toArray()

    return dbSpots.map(createSpotFromDbSpot)
}

export async function getSpotsWithinBounds(bounds: Bounds): Promise<Spot[]> {
    const dbSpots = await filterSpotsWithinBounds(bounds)
        .toArray()

    return dbSpots.map(createSpotFromDbSpot)
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

function createSpotFromDbSpot(spot: WithId<DbSpot>): Spot {
    const authorId = spot.authorId
        ? objectIdToString(spot.authorId)
        : null

    return {
        ...toWithStringId(spot),
        coordinate: createContractCoordinate(spot.coordinate),
        authorId,
    }
}

