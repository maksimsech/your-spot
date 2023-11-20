import {
    useEffect,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
    type ForwardedRef,
} from 'react'

import { LatLng } from 'leaflet'
import { useMapEvents } from 'react-leaflet'

import type { Coordinate } from '@your-spot/contracts'
import type {
    MapProps,
    MapRef,
} from '@your-spot/map-types'


interface MapControlProps {
    onCoordinateClicked: (coordinate: Coordinate) => void
    onCurrentLocationUpdated?: MapProps['onCurrentLocationUpdated']
}

interface MapControlRef {
    setCurrentLocation: MapRef['setCurrentLocation']
}


const MapControl = forwardRef<MapControlRef, MapControlProps>(
    ({
        onCoordinateClicked,
        onCurrentLocationUpdated,
    }: MapControlProps,
    ref: ForwardedRef<MapControlRef>) => {
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

        useImperativeHandle(ref, () => ({
            setCurrentLocation: (location: Coordinate, zoom: number | undefined = undefined ) => {
                zoom ??= map.getZoom()
                const latLng = toLatLng(location)
                map.setView(latLng, zoom)
            },
        }), [map])

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
    },
)
MapControl.displayName = 'MapControl'

function toCoordinate(latlng: LatLng): Coordinate {
    return {
        lat: latlng.lat,
        lng: latlng.lng,
    }
}

function toLatLng(coordinate: Coordinate): LatLng {
    return new LatLng(coordinate.lat, coordinate.lng)
}

export { MapControl }
