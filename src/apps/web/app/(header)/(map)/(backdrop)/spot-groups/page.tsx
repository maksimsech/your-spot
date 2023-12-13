import { notFound } from 'next/navigation'

import { getSpots } from '@your-spot/core'

import { SpotGroup } from '@/components/spots/group'


export default async function Page({
    searchParams,
}: {
    searchParams: {
        [key: string]: string
    }
}) {
    const spotIds: string | ReadonlyArray<string> | null | undefined = searchParams.id
    if (!Array.isArray(spotIds)) {
        notFound()
    }

    let spots = null
    try {
        spots = await getSpots(spotIds)
    }
    catch {
        notFound()
    }
    if (spots.length === 0) {
        notFound()
    }

    return (
        <SpotGroup
            className={spots.length > 4 ? 'h-[60vh]' : 'h-[40vh]'}
            spots={spots}
        />
    )
}
