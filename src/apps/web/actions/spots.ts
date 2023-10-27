'use server'

import type {
    Bounds,
    Spot,
} from '@your-spot/contracts'
import {
    createSpot as createSpotCore,
    getSpotsWithinBounds as getSpotsWithinBoundsCore,
} from '@your-spot/core/services'


export async function createSpot(spot: Omit<Spot, 'id'>) {
    await createSpotCore(spot)
}

export async function getSpotsWithinBounds(bounds: Bounds) {
    return await getSpotsWithinBoundsCore(bounds)
}
