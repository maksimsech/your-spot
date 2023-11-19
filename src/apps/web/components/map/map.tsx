'use client'

import { useRouter } from 'next/navigation'

import {
    useCurrentLocation,
    useCurrentSpots,
    useMapActions,
} from './hooks'
import { Map as LeafletMap } from './leaflet-map'
import { MapLoader } from './map-loader'


export function Map() {
    const router = useRouter()

    const useCurrentLocationResult = useCurrentLocation()
    const {
        spots,
        onBoundsUpdated,
        refresh,
    } = useCurrentSpots()

    useMapActions({
        refreshSpots: refresh,
    })

    if (useCurrentLocationResult.isLoading) {
        return <MapLoader />
    }

    const {
        location,
        zoom,
        onLocationUpdated,
    } = useCurrentLocationResult

    return (
        <div className='h-full w-full p-1'>
            <LeafletMap
                className='h-full w-full rounded-xl shadow-md'
                center={location}
                zoom={zoom}
                spots={spots}
                markerIconUrl='/icons/pin.svg'
                onCurrentLocationUpdated={(center, zoom, bounds) => {
                    onLocationUpdated(center, zoom)
                    onBoundsUpdated(bounds)
                }}
                onCoordinateClicked={({ lat, lng }) => {
                    router.push(`/spots?lat=${lat}&lng=${lng}`)
                }}
                onSpotClicked={(s) => router.push(`/spots/${s.id}`)}
            />
        </div>
    )
}
