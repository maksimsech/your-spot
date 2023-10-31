'use client'

import { useEffect } from 'react'

import {
    useRouter,
    useSearchParams,
} from 'next/navigation'

import {
    useCurrentLocation,
    useCurrentSpots,
} from './hooks'
import { Map as LeafletMap } from './leaflet-map'
import { MapLoader } from './map-loader'


const warsawLocation = {
    lat: 52.237049,
    lng: 21.017532,
}

export function Map() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const location = useCurrentLocation(warsawLocation)
    const {
        spots,
        onBoundsUpdated,
        refresh,
    } = useCurrentSpots()

    const action = searchParams.get('action')
    useEffect(() => {
        if (action === 'refresh') {
            refresh()
            router.replace('/', { scroll: false })
        }
    }, [action, refresh, router])

    if (location === 'loading') {
        return <MapLoader />
    }

    return (
        <div className='h-full w-full p-1'>
            <LeafletMap
                className='h-full w-full rounded-xl shadow-md'
                startingPoint={location}
                spots={spots}
                markerIconUrl='/icons/pin.svg'
                onCurrentBoundsUpdated={onBoundsUpdated}
                onCoordinateClicked={({ lat, lng }) => {
                    router.push(`/spots?lat=${lat}&lng=${lng}`)
                }}
                onSpotClicked={(s) => router.push(`/spots/${s.id}`)}
            />
        </div>
    )
}
