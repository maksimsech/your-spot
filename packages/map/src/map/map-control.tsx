import {
    useEffect,
    useCallback,
} from 'react'

import { LatLng } from 'leaflet'
import { useMapEvents } from 'react-leaflet'

import type {
    Coordinate,
    Bounds,
} from '@your-spot/contracts'


function toCoordinate(latlng: LatLng): Coordinate {
    return {
        lat: latlng.lat,
        lng: latlng.lng,
    }
}

interface MapControlProps {
    onCoordinateClicked: (coordinate: Coordinate) => void
    onCurrentBoundsUpdated: (bounds: Bounds) => void
}

export function MapControl({
    onCoordinateClicked,
    onCurrentBoundsUpdated,
}: MapControlProps) {
    const map = useMapEvents({
        click(e) {
            onCoordinateClicked(toCoordinate(e.latlng))
        },
    })

    const onMove = useCallback(
        () => {
            const bounds = map.getBounds()

            onCurrentBoundsUpdated({
                southWest: toCoordinate(bounds.getSouthWest()),
                northEast: toCoordinate(bounds.getNorthEast()),
                northWest: toCoordinate(bounds.getNorthWest()),
                southEast: toCoordinate(bounds.getSouthEast()),
            })
        },
        [map, onCurrentBoundsUpdated],
    )

    useEffect(() => {
        // TODO: To pass bounds initially. Check for better solution
        onMove()
        map.on('move', onMove)

        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove])

    return null
}
