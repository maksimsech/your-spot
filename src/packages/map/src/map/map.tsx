import {
    forwardRef,
    type ForwardedRef,
} from 'react'

import { icon } from 'leaflet'
import {
    MapContainer,
    Marker,
    TileLayer,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import type { SpotGroup } from '@your-spot/contracts'
import type {
    MapProps,
    MapRef,
} from '@your-spot/map-types'

import { MapControl } from './map-control'

import './map.css'


const Map = forwardRef<MapRef, MapProps>(
    ({
        className,
        center,
        zoom,
        spots,
        spotGroups,
        markerIconUrl,
        markerGroupIconUrl,
        onCoordinateClicked,
        onCurrentLocationUpdated,
        onSpotClicked,
    }: MapProps,
    ref: ForwardedRef<MapRef>) => (
        <MapContainer
            center={center}
            zoom={zoom}
            className={className}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {spots.map(s => (
                <Marker
                    key={s.id}
                    position={[s.coordinate.lat, s.coordinate.lng]}
                    icon={icon({
                        iconUrl: markerIconUrl,
                        iconSize: [24, 24],
                    })}
                    eventHandlers={{
                        click() {
                            onSpotClicked(s)
                        },
                    }}
                >
                </Marker>
            ))}
            {spotGroups.map(s => (
                <Marker
                    key={getSpotGroupKey(s)}
                    position={[s.coordinate.lat, s.coordinate.lng]}
                    icon={icon({
                        iconUrl: markerGroupIconUrl,
                        iconSize: [24, 24],
                    })}
                    eventHandlers={{
                        click() {
                            console.log('SpotGroup')
                        },
                    }}
                >
                </Marker>
            ))}
            <MapControl
                ref={ref}
                onCoordinateClicked={onCoordinateClicked}
                onCurrentLocationUpdated={onCurrentLocationUpdated}
            />
        </MapContainer>
    ),
)
Map.displayName = 'Map'

export { Map }

function getSpotGroupKey(spotGroup: SpotGroup) {
    return `${spotGroup.coordinate.lat}${spotGroup.coordinate.lng}`
}
