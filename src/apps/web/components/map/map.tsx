'use client'

import {
    useCallback,
    useState,
} from 'react'

import { useRouter } from 'next/navigation'

import type {
    Bounds,
    Coordinate,
    Spot,
} from '@your-spot/contracts'
import type { MapRef } from '@your-spot/map-types'

import {
    useCurrentLocation,
    useCurrentSpots,
    useNavigateAction,
    useRefreshAction,
} from './hooks'
import {
    Map as LeafletMap,
    MapLoader,
} from './leaflet-map'


export function Map() {
    const router = useRouter()

    const [map, setMap] = useState<MapRef | null>(null)

    const {
        spots,
        onBoundsUpdated,
        refresh,
    } = useCurrentSpots()

    const initialLocation = useNavigateAction(map)
    useRefreshAction(refresh)

    const {
        onLocationUpdated,
        ...restCurrentLocation
    } = useCurrentLocation(initialLocation)

    const onCurrentLocationUpdated = useCallback((center: Coordinate, zoom: number, bounds: Bounds) => {
        onLocationUpdated(center, zoom)
        onBoundsUpdated(bounds)
    }, [onLocationUpdated, onBoundsUpdated])

    const onCoordinateClicked = useCallback(
        ({ lat, lng }: Coordinate) => router.push(`/spots?lat=${lat}&lng=${lng}`),
        [router],
    )

    const onSpotClicked = useCallback(
        (s: Spot) => router.push(`/spots/${s.id}`),
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
                forwardedRef={setMap}
                center={location}
                zoom={zoom}
                spots={spots}
                markerIconUrl='/icons/pin.svg'
                onCurrentLocationUpdated={onCurrentLocationUpdated}
                onCoordinateClicked={onCoordinateClicked}
                onSpotClicked={onSpotClicked}
            />
        </div>
    )
}
