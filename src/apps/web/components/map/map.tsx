'use client'

import {
    type ReactNode,
    useCallback,
    useState,
} from 'react'

import { useRouter } from 'next/navigation'

import type {
    Coordinate,
    SpotGroup,
    SpotCoordinates,
} from '@your-spot/contracts'
import type {
    MapRef,
    MapProps as LibMapProps,
} from '@your-spot/map-types'

import { cn } from '@/utils'

import type { MapContext } from './context'
import {
    useCurrentLocation,
    useCurrentSpots,
    useNavigateAction,
} from './hooks'
import { useMutableCurrentBounds } from './hooks/use-current-bounds'
import {
    Map as LeafletMap,
    MapLoader,
} from './leaflet-map'


export interface MapProps {
    setMapContext: (context: MapContext) => void
    className?: string
    children: ReactNode
    canAddSpot: boolean
}

export function Map({
    setMapContext,
    className,
    children,
    canAddSpot,
} : MapProps) {
    const router = useRouter()

    const [map, setMap] = useState<MapRef | null>(null)

    const {
        isLoading,
        spots,
        spotGroups,
        onBoundsUpdated,
        refresh,
    } = useCurrentSpots()

    const initialLocation = useNavigateAction(map)

    const {
        onLocationUpdated,
        ...restCurrentLocation
    } = useCurrentLocation(initialLocation)

    const { setCurrentBounds } = useMutableCurrentBounds()

    const onCurrentLocationUpdated = useCallback(
        ({
            coordinate,
            bounds,
            zoom,
            minZoom,
            maxZoom,
        }: Parameters<LibMapProps['onCurrentLocationUpdated']>[0]) => {
            onLocationUpdated(coordinate, zoom)
            onBoundsUpdated(bounds, zoom, minZoom, maxZoom)
            setCurrentBounds(bounds)
        },
        [onLocationUpdated, onBoundsUpdated, setCurrentBounds],
    )

    const onCoordinateClicked = useCallback(
        ({ lat, lng }: Coordinate) => canAddSpot && router.push(`/spots?lat=${lat}&lng=${lng}`),
        [router, canAddSpot],
    )

    const onSpotClicked = useCallback(
        (s: SpotCoordinates) => router.push(`/spots/${s.id}`),
        [router],
    )

    const onSpotGroupClicked = useCallback(
        (s: SpotGroup) => {
            const searchParams = new URLSearchParams()
            for (const spotId of s.spotIds) {
                searchParams.append('id', spotId)
            }
            router.push(`/spot-groups?${searchParams.toString()}`)
        },
        [router],
    )

    const forwardedRef = useCallback((mapRef: MapRef | null) => {
        if (!mapRef) {
            return
        }

        setMapContext({
            refreshSpots: refresh,
            navigateTo: mapRef.setCurrentLocation,
        })
        setMap(mapRef)
    }, [setMapContext, refresh])

    if (restCurrentLocation.isLoading) {
        return <MapLoader />
    }

    const {
        location,
        zoom,
    } = restCurrentLocation

    return (
        <>
            <div
                className={cn(
                    'h-full w-full p-1',
                    className,
                    { 'animate-pulse': isLoading },
                )}
            >
                <LeafletMap
                    className='size-full rounded-xl shadow-md'
                    forwardedRef={forwardedRef}
                    center={location}
                    zoom={zoom}
                    spots={spots}
                    spotGroups={spotGroups}
                    markerIconUrl='/icons/pin.svg'
                    markerGroupIconUrl='/icons/pin-group.svg'
                    onCurrentLocationUpdated={onCurrentLocationUpdated}
                    onCoordinateClicked={onCoordinateClicked}
                    onSpotClicked={onSpotClicked}
                    onSpotGroupClicked={onSpotGroupClicked}
                />
            </div>
            {children}
        </>
    )
}
