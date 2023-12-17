import type {
    Spot,
    SpotInfo,
} from '@your-spot/contracts'
import type {
    WithId,
    Spot as DbSpot,
} from '@your-spot/database'

import {
    objectIdToString,
    toWithStringId,
} from '../common'

import { createContractCoordinate } from './coordinate'


export function createSpot(spot: WithId<DbSpot>): Spot {
    const authorId = spot.authorId
        ? objectIdToString(spot.authorId)
        : null

    return {
        ...toWithStringId(spot),
        coordinate: createContractCoordinate(spot.coordinate),
        authorId,
    }
}

export function createSpotInfo(spot: Pick<WithId<DbSpot>, '_id' | 'coordinate'>): SpotInfo {
    return {
        id: objectIdToString(spot._id),
        coordinate: createContractCoordinate(spot.coordinate),
    }
}
