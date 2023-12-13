import { notFound } from 'next/navigation'

import {
    getSpot,
    getUser,
} from '@your-spot/core'

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
    const spot = await getSpot(id)
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
