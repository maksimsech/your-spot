'use client'

import { ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { Map } from '@/components/map'

import { useCurrentLocation } from './use-current-location'
import { useCurrentSpots } from './use-current-spots'

import './base-layout.scss'


const warsawLocation = {
    lat: 52.237049,
    lng: 21.017532,
}

interface BaseLayoutProps {
    children: ReactNode
}

export function BaseLayout({
    children,
}: BaseLayoutProps) {
    const router = useRouter()
    const location = useCurrentLocation(warsawLocation)
    const {
        spots,
        onBoundsUpdated,
    } = useCurrentSpots()

    return (
        <>
            <header>
                Header
            </header>
            {location !== 'loading' && ( // TODO: Add loading or skeleton
                <Map
                    startingPoint={location}
                    spots={spots}
                    markerIconUrl='/icons/pushpin.svg'
                    onCurrentBoundsUpdated={onBoundsUpdated}
                    onCoordinateClicked={({ lat, lng }) => {
                        router.push(`/spots?lat=${lat}&lng=${lng}`)
                    }}
                    onSpotClicked={(s) => router.push(`/spots/${s.id}`)}
                />
            )}
            {children}
            <footer>
                Footer?
            </footer>
        </>
    )
}
