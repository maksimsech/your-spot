import {
    notFound,
    redirect,
} from 'next/navigation'

import { getSpot } from '@your-spot/core'

import { getAuthenticatedUser } from '@/auth/helper'
import {
    canDeleteSpot,
    canEditSpot,
} from '@/auth/rules/spots'
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

    const user = await getAuthenticatedUser()
    if (!user || !canEditSpot(spot, user)) {
        // TODO: Should be unauthorized page or smth
        redirect('/')
    }

    const showDeleteButton = canDeleteSpot(spot, user)

    return (
        <SpotForm
            spot={spot}
            showDeleteButton={showDeleteButton}
        />
    )
}
