import {
    useEffect,
    useCallback,
    useRef,
} from 'react'

import { LatLng } from 'leaflet'
import { useMapEvents } from 'react-leaflet'

import type { Coordinate } from '@your-spot/contracts'
import type { MapProps } from '@your-spot/map-types'


function toCoordinate(latlng: LatLng): Coordinate {
    return {
        lat: latlng.lat,
        lng: latlng.lng,
    }
}

interface MapControlProps {
    onCoordinateClicked: (coordinate: Coordinate) => void
    onCurrentLocationUpdated?: MapProps['onCurrentLocationUpdated']
}

export function MapControl({
    onCoordinateClicked,
    onCurrentLocationUpdated,
}: MapControlProps) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
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
            if (onCurrentLocationUpdated) {
                const mapCenter = map.getCenter()
                const mapZoom = map.getZoom()
                const mapBounds = map.getBounds()

                const center = toCoordinate(mapCenter)
                const bounds = {
                    southWest: toCoordinate(mapBounds.getSouthWest()),
                    northEast: toCoordinate(mapBounds.getNorthEast()),
                    northWest: toCoordinate(mapBounds.getNorthWest()),
                    southEast: toCoordinate(mapBounds.getSouthEast()),
                }
                onCurrentLocationUpdated(center, mapZoom, bounds)
            }
        },
        [map, onCurrentLocationUpdated],
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
