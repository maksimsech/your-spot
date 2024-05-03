import {
    notFound,
    redirect,
} from 'next/navigation'

import { canAddSpot as canAddSpotRule } from '@/auth/rules/spots'
import { SpotForm } from '@/components/spots/form'
import { isFeatureEnabled } from '@/feature-flags'


export default async function Page({
    searchParams,
}: {
    searchParams: {
        [key: string]: string
    }
}) {
    const canAddSpot = await isFeatureEnabled('spot_add') && await canAddSpotRule()
    if (!canAddSpot) {
        redirect('/')
    }

    const lat = searchParams.lat != null ? parseFloat(searchParams.lat!) : null
    const lng = searchParams.lng != null ? parseFloat(searchParams.lng!) : null
    if (lat == null || lng == null) {
        notFound()
    }

    const spotAddImageEnabled = await isFeatureEnabled('spot_add_image')

    return (
        <SpotForm
            showImageInput={spotAddImageEnabled}
            lat={lat}
            lng={lng}
        />
    )
}
