'use server'

import { revalidateTag } from 'next/cache'

import type {
    Bounds,
    Spot,
} from '@your-spot/contracts'
import {
    createSpot as createSpotCore,
    getSpot as getSpotCore,
    updateSpot as updateSpotCore,
    deleteSpot as deleteSpotCore,
    getSpotsAndGroupsWithinBounds as getSpotsAndGroupsWithinBoundsCore,
    searchSpots as searchSpotsCore,
    minZoom as minZoomCore,
    maxZoom as maxZoomCore,
    likeSpot as likeSpotCore,
    removeSpotLike as removeSpotLikeCore,
} from '@your-spot/core/services'

import { ensureAuthenticated } from '@/auth/helper'
import {
    canDeleteSpot,
    canEditSpot,
} from '@/auth/rules/spots'
import { getSpotCacheTag } from '@/cache/spots'


export async function createSpot(spot: Omit<Parameters<typeof createSpotCore>[0], 'authorId'>) {
    const user = await ensureAuthenticated()

    const spotWithAuthorId = {
        ...spot,
        authorId: user.id,
    }

    await createSpotCore(spotWithAuthorId)
}

export async function updateSpot(spot: Parameters<typeof updateSpotCore>[0] & Pick<Spot, 'authorId'>) {
    const user = await ensureAuthenticated()

    const existingSpot = await getSpotCore(spot.id)
    if (existingSpot === null) {
        return
    }

    if (!canEditSpot(existingSpot, user)) {
        return
    }

    await updateSpotCore(spot)

    revalidateSpotPage(spot.id)
}

export async function deleteSpot(spotId: string) {
    const user = await ensureAuthenticated()

    const spot = await getSpotCore(spotId)
    if (!spot) {
        return
    }

    if (!canDeleteSpot(spot, user)) {
        return
    }

    await deleteSpotCore(spotId)

    revalidateSpotPage(spot.id)
}

export async function getSpotsAndGroupsWithinBounds({
    bounds,
    ...zoomArguments
}: { bounds: Bounds } & MapZoomArguments) {
    const zoom = mapZoom(zoomArguments)
    return await getSpotsAndGroupsWithinBoundsCore(bounds, zoom)
}

export async function searchSpots(args: Parameters<typeof searchSpotsCore>[0]) {
    return await searchSpotsCore(args)
}

export async function likeSpot(args: Parameters<typeof likeSpotCore>[0]) {
    return await likeSpotCore(args)
}

export async function removeSpotLike(args: Parameters<typeof removeSpotLikeCore>[0]) {
    return await removeSpotLikeCore(args)
}


function revalidateSpotPage(spotId: string) {
    revalidateTag(getSpotCacheTag(spotId))
}

type MapZoomArguments = {
    minZoom: number
    maxZoom: number
    zoom: number
}

const coreZoomRange = maxZoomCore - minZoomCore
function mapZoom({
    minZoom,
    maxZoom,
    zoom,
}: MapZoomArguments) {
    const zoomRange = maxZoom - minZoom

    const coreZoomFromZero = (zoom - minZoom) * coreZoomRange / zoomRange
    return coreZoomFromZero + minZoomCore
}
