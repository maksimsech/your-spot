import type { SpotLikeInformation } from '@your-spot/contracts'
import {
    type ObjectId,
    spotLikesCollection,
} from '@your-spot/database'

import { IdError } from '../../errors/id-error'
import {
    isNotValid,
    stringToObjectId,
} from '../common'

interface LikeSpotArguments {
    spotId: string
    userId: string
}


export async function likeSpot(params: LikeSpotArguments) {
    const {
        spotId,
        userId,
    } = parseLikeIds(params, likeSpot.name)

    await spotLikesCollection.updateOne(
        {
            spotId,
        },
        {
            $push: {
                userIds: userId,
            },
            $setOnInsert: {
                spotId,
            },
        },
        {
            upsert: true,
        },
    )

    return getLikeInformation(params)
}

interface RemoveSpotLikeArguments {
    spotId: string
    userId: string
}

export async function removeSpotLike(params: RemoveSpotLikeArguments) {
    const {
        spotId,
        userId,
    } = parseLikeIds(params, removeSpotLike.name)

    await spotLikesCollection.findOneAndUpdate(
        {
            spotId: spotId!,
        },
        {
            $pull: {
                userIds: userId!,
            },
        },
    )


    return getLikeInformation(params)
}

interface GetLikeInformationParameters {
    spotId: string
    userId: string | null
}

const defaultLikeInformation: SpotLikeInformation = {
    likedByUser: false,
    likesCount: 0,
}

export async function getLikeInformation({
    spotId: spotIdParam,
    userId: userIdParam,
}: GetLikeInformationParameters) {
    if (isNotValid(spotIdParam)) {
        console.log(`like/${getLikeInformation.name} Wrong spot id were passed.`, spotIdParam)
        throw new IdError(spotIdParam, 'Id is not valid.')
    }

    const spotId = stringToObjectId(spotIdParam)

    if (!userIdParam) {
        return getLikeInformationForSpot(spotId)
    }

    const userId = stringToObjectId(userIdParam)

    const spotLikesArray = await spotLikesCollection
        .aggregate<SpotLikeInformation>([
            {
                $match: {
                    spotId,
                },
            },
            {
                $project: {
                    likedByUser: {
                        $in: [userId, '$userIds'],
                    },
                    likesCount: {
                        $size: '$userIds',
                    },
                },
            },
        ])
        .toArray()

    const spotLikes = spotLikesArray.at(0)

    return spotLikes || defaultLikeInformation
}


async function getLikeInformationForSpot(spotId: ObjectId) {
    const spotLikesArray = await spotLikesCollection
        .aggregate<Omit<SpotLikeInformation, 'likedByUser'>>([
            {
                $match: {
                    spotId,
                },
            },
            {
                $project: {
                    likesCount: {
                        $size: '$userIds',
                    },
                },
            },
        ])
        .toArray()

    const spotLikes = spotLikesArray.at(0)
    if (!spotLikes) {
        return defaultLikeInformation
    }

    return {
        likedByUser: false,
        likesCount: spotLikes.likesCount,
    }

}

interface ParseLikeIdsParameters {
    spotId: string
    userId: string
}

function parseLikeIds({ spotId: spotIdParam, userId: userIdParam }: ParseLikeIdsParameters, methodName: string) {
    if (isNotValid(spotIdParam)) {
        throwParseError(methodName, 'spot', spotIdParam)
    }
    if (isNotValid(userIdParam)) {
        throwParseError(methodName, 'user', userIdParam)
    }

    return {
        spotId: stringToObjectId(spotIdParam),
        userId: stringToObjectId(userIdParam),
    }
}

function throwParseError(methodName: string, entityName: string, value: string) {
    console.log(`like/${methodName} Wrong ${entityName} id were passed.`, value)
    throw new IdError(value, 'Id is not valid.')
}
