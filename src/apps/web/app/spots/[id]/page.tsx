import { notFound } from 'next/navigation'

import { getSpot } from '@your-spot/core'

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

    return (
        <SpotInfo
            spot={spot}
        />
    )
}
