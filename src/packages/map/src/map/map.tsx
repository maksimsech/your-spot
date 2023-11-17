import { icon } from 'leaflet'
import {
    MapContainer,
    Marker,
    TileLayer,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import type { MapProps } from '@your-spot/map-types'

import { MapControl } from './map-control'

import './map.css'


export function Map({
    className,
    startingPoint,
    spots,
    markerIconUrl,
    onCoordinateClicked,
    onCurrentBoundsUpdated,
    onSpotClicked,
}: MapProps) {
    return (
        <MapContainer
            center={startingPoint}
            zoom={10}
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
            <MapControl
                onCoordinateClicked={onCoordinateClicked}
                onCurrentBoundsUpdated={onCurrentBoundsUpdated}
            />
        </MapContainer>
    )
}