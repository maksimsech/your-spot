'use client'

import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import type {
    Bounds,
    Coordinate,
} from '@your-spot/contracts'

import {
    useCurrentLocation,
    useCurrentSpots,
    useMapActions,
} from './hooks'
import { Map as LeafletMap } from './leaflet-map'
import { MapLoader } from './map-loader'


export function Map() {
    const router = useRouter()

    const {
        onLocationUpdated,
        ...restCurrentLocation
    } = useCurrentLocation()
    const {
        spots,
        onBoundsUpdated,
        refresh,
    } = useCurrentSpots()

    useMapActions({
        refreshSpots: refresh,
    })

    const onCurrentLocationUpdated = useCallback((center: Coordinate, zoom: number, bounds: Bounds) => {
        onLocationUpdated(center, zoom)
        onBoundsUpdated(bounds)
    }, [onLocationUpdated, onBoundsUpdated])

    const onCoordinateClicked = useCallback(
        ({ lat, lng }: Coordinate) => router.push(`/spots?lat=${lat}&lng=${lng}`),
        [router],
    )


    if (restCurrentLocation.isLoading) {
        return <MapLoader />
    }

    const {
        location,
        zoom,
    } = restCurrentLocation

    return (
        <div className='h-full w-full p-1'>
            <LeafletMap
                className='h-full w-full rounded-xl shadow-md'
                center={location}
                zoom={zoom}
                spots={spots}
                markerIconUrl='/icons/pin.svg'
                onCurrentLocationUpdated={onCurrentLocationUpdated}
                onCoordinateClicked={onCoordinateClicked}
                onSpotClicked={(s) => router.push(`/spots/${s.id}`)}
            />
        </div>
    )
}
