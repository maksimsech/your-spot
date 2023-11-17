'use server'

import type {
    Bounds,
    Spot,
} from '@your-spot/contracts'
import {
    createSpot as createSpotCore,
    getSpot as getSpotCore,
    updateSpot as updateSpotCore,
    deleteSpot as deleteSpotCore,
    getSpotsWithinBounds as getSpotsWithinBoundsCore,
} from '@your-spot/core/services'

import { getAuthorizedUser } from '@/auth/helper'
import {
    canDeleteSpot,
    canEditSpot,
} from '@/auth/rules/spots'


export async function createSpot(spot: Omit<Spot, 'id' | 'authorId'>) {
    const user = await getAuthorizedUser()
    if (!user) {
        throw Error('Not authenticated')
    }

    const spotWithAuthorId = {
        ...spot,
        authorId: user.id,
    }

    await createSpotCore(spotWithAuthorId)
}

export async function updateSpot(spot: Spot) {
    const user = await getAuthorizedUser()
    if (!user) {
        return
    }

    if (!canEditSpot(spot, user)) {
        return
    }

    await updateSpotCore(spot)
}

export async function deleteSpot(spotId: string) {
    const user = await getAuthorizedUser()
    if (!user) {
        return
    }

    const spot = await getSpotCore(spotId)
    if (!spot) {
        return
    }

    if (!canDeleteSpot(spot, user)) {
        return
    }

    await deleteSpotCore(spotId)
}

export async function getSpotsWithinBounds(bounds: Bounds) {
    return await getSpotsWithinBoundsCore(bounds)
}