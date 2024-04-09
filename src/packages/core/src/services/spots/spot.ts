import type { Spot } from '@your-spot/contracts'
import {
    type WithId,
    type Spot as DbSpot,
    spotCollection,
    client,
    spotLikesCollection,
} from '@your-spot/database'
import { deleteImage } from '@your-spot/storage'

import { IdError } from '../../errors/id-error'
import {
    isNotValid,
    objectIdToString,
    stringToObjectId,
} from '../common'

import { createMongoCoordinate } from './coordinate'
import { createSpot as createSpotFromDbSpot } from './mapper'


export function createSpot(spot: Omit<Spot, 'id' | 'createdAt' | 'updatedAt'>) {
    if (spot.authorId && isNotValid(spot.authorId)) {
        console.log('spot/createSpot Wrong authorId were passed.', spot)
        throw new IdError(spot.authorId, 'AuthorId is not valid.')
    }

    const authorObjectId = spot.authorId
        ? stringToObjectId(spot.authorId)
        : null

    const dbSpot = {
        ...spot,
        coordinate: createMongoCoordinate(spot.coordinate),
        authorId: authorObjectId,
        createdAt: new Date(),
    }

    return spotCollection.insertOne(dbSpot)
}

export async function deleteSpot(spotId: string) {
    if (isNotValid(spotId)) {
        console.log('spot/deleteSpot Wrong id were passed.', spotId)
        throw new IdError(spotId, 'Id is not valid.')
    }

    const objectId = stringToObjectId(spotId)

    const session = client.startSession()
    try {
        await session.withTransaction(async () => {
            await spotCollection.deleteOne({
                _id: objectId,
            })

            await spotLikesCollection.deleteOne({
                spotId: objectId,
            })
        })
    }
    finally {
        await session.endSession()
    }
}

export async function updateSpot(spot: Pick<Spot, 'id' | 'title' | 'description' | 'image'>) {
    if (isNotValid(spot.id)) {
        console.log('spot/updateSpot Wrong id were passed.', spot)
        throw new IdError(spot.id, 'Id is not valid.')
    }

    const objectId = stringToObjectId(spot.id)

    const originalSpot = await spotCollection.findOneAndUpdate({
        _id: objectId,
    }, {
        $set: {
            title: spot.title,
            description: spot.description,
            image: spot.image,
            updatedAt: new Date(),
        },
    }, {
        upsert: false,
        returnDocument: 'before',
    })

    if (!!originalSpot?.image && originalSpot?.image !== spot.image) {
        await deleteImage(originalSpot.image)
    }
}

export async function getSpot(spotId: string) {
    if (isNotValid(spotId)) {
        console.log('spot/getSpot Wrong id were passed.', spotId)
        throw new IdError(spotId, 'Id is not valid.')
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

interface GetSpotsForAuthorArguments {
    authorId: string,
    limit?: number
}

export async function getSpotsForAuthor({ authorId, limit = 10 }: GetSpotsForAuthorArguments) {
    if (isNotValid(authorId)) {
        console.warn('spot/getSpotsForAuthor Wrong id were passed.', authorId)
        return []
    }

    const authorObjectId = stringToObjectId(authorId)

    const dbSpots = await spotCollection
        .find({ authorId: authorObjectId })
        .limit(limit)
        .toArray()

    return dbSpots.map(createSpotFromDbSpot)
}

export async function getSpotAuthorId(spotId: string): Promise<Pick<Spot, 'id' | 'authorId'> | null> {
    if (isNotValid(spotId)) {
        console.warn('spot/getSpotAuthorId Wrong id were passed.', spotId)
        throw new IdError(spotId, 'Id is not valid.')
    }

    const spotObjectId = stringToObjectId(spotId)

    const dbSpots = await spotCollection
        .find({ _id: spotObjectId })
        .project<Pick<WithId<DbSpot>, 'authorId' | '_id'>>({ authorId: 1 })
        .toArray()

    if (!dbSpots.length) {
        return null
    }
    const dbSpot = dbSpots[0]

    return {
        id: objectIdToString(dbSpot._id),
        authorId: dbSpot.authorId
            ? objectIdToString(dbSpot.authorId)
            : null,
    }
}
