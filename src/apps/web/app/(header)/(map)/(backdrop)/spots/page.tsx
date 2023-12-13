import { notFound } from 'next/navigation'

import { SpotForm } from '@/components/spots/form'


export default function Page({
    searchParams,
}: {
    searchParams: {
        [key: string]: string
    }
}) {
    const lat = searchParams.lat != null ? parseFloat(searchParams.lat!) : null
    const lng = searchParams.lng != null ? parseFloat(searchParams.lng!) : null
    if (lat == null || lng == null) {
        notFound()
    }

    return (
        <SpotForm
            lat={lat}
            lng={lng}
        />
    )
}
