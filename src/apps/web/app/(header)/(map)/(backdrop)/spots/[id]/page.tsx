import { unstable_cache as cache } from 'next/cache'
import { notFound } from 'next/navigation'

import {
    getSpot,
    getUser,
    isNotValidId,
} from '@your-spot/core'

import { getSpotCacheTag } from '@/cache/spots'
import { SpotInfo } from '@/components/spots/info'


interface PageProps {
    params: {
        id: string
    }
}

export default async function Page({
    params: {
        id,
    },
}: PageProps) {
    if (isNotValidId(id)) {
        notFound()
    }

    // TODO: Revisit with newer versions
    const cachedGetSpot = cache(getSpot, ['get-spot'], { tags: [getSpotCacheTag(id)] })
    const spot = await cachedGetSpot(id)
    if (!spot) {
        notFound()
    }

    const author = spot.authorId
        ? await getUser(spot.authorId)
        : null

    return (
        <SpotInfo
            spot={spot}
            spotAuthor={author}
        />
    )
}
