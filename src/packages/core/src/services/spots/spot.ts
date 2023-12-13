import type { Spot } from '@your-spot/contracts'
import { spotCollection } from '@your-spot/database'

import { stringToObjectId } from '../common'

import { createMongoCoordinate } from './coordinate'
import { createSpot as createSpotFromDbSpot } from './mapper'


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

export async function getSpots(ids: ReadonlyArray<string>) {
    const objectIds = ids.map(stringToObjectId)

    const dbSpots = await spotCollection
        .find({
            _id: {
                $in: objectIds,
            },
        })
        .toArray()

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

