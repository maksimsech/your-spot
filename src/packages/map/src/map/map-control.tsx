import {
    useEffect,
    useCallback,
    useRef,
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
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const latestDoubleClickTimeStamp = useRef<number | null>(null)

    const map = useMapEvents({
        click(e) {
            const { detail, timeStamp } = e.originalEvent

            if (detail > 1) {
                clearTimeout(timeoutRef.current)
                return
            }

            const doubleClickTimeStamp = latestDoubleClickTimeStamp.current
            // TODO: Looks like bug in leaflet. Investigate later
            if (doubleClickTimeStamp !== null && timeStamp - doubleClickTimeStamp < 45) {
                return
            }

            if (detail === 1) {
                timeoutRef.current = setTimeout(
                    () => onCoordinateClicked(toCoordinate(e.latlng)),
                    200,
                )
            }
        },
        dblclick(e) {
            latestDoubleClickTimeStamp.current = e.originalEvent.timeStamp
        },
        // TODO: Add animation on preclick
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
