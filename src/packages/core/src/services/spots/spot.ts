import type { Spot } from '@your-spot/contracts'
import { spotCollection } from '@your-spot/database'

import {
    isNotValid,
    stringToObjectId,
} from '../common'

import { createMongoCoordinate } from './coordinate'
import { createSpot as createSpotFromDbSpot } from './mapper'


export function createSpot(spot: Omit<Spot, 'id'>) {
    if (spot.authorId && isNotValid(spot.authorId)) {
        console.log('spot/createSpot Wrong authorId were passed.', spot)
        throw new Error('AuthorId is not valid.')
    }

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
    if (isNotValid(spotId)) {
        console.log('spot/deleteSpot Wrong id were passed.', spotId)
        throw new Error('Id is not valid.')
    }

    const objectId = stringToObjectId(spotId)

    await spotCollection.deleteOne({
        _id: objectId,
    })
}

export async function updateSpot(spot: Spot) {
    if (isNotValid(spot.id)) {
        console.log('spot/updateSpot Wrong id were passed.', spot)
        throw new Error('Id is not valid.')
    }

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
    if (isNotValid(spotId)) {
        console.log('spot/getSpot Wrong id were passed.', spotId)
        return null
    }

    const objectId = stringToObjectId(spotId)

    const dbSpot = await spotCollection.findOne({
        _id: objectId,
    })
    if (!dbSpot) {
        return null
    }

    return createSpotFromDbSpot(dbSpot)
}

export async function getSpots(ids: ReadonlyArray<string>) {
    if (ids.some(isNotValid)) {
        console.warn('spot/getSpots Wrong ids were passed.', ids)
        return []
    }

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
    if (isNotValid(authorId)) {
        console.warn('spot/getSpotsForAuthor Wrong id were passed.', authorId)
        return []
    }

    const authorObjectId = stringToObjectId(authorId)

    const dbSpots = await spotCollection.find({ authorId: authorObjectId }).toArray()

    return dbSpots.map(createSpotFromDbSpot)
}

