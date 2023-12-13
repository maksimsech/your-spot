import { notFound } from 'next/navigation'

import { getSpot } from '@your-spot/core'

import { SpotForm } from '@/components/spots/form'


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
        <SpotForm
            spot={spot}
        />
    )
}
