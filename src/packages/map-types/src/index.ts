import type {
    Coordinate,
    Bounds,
    Spot,
} from '@your-spot/contracts'


export interface MapProps {
    className?: string
    center: Coordinate
    zoom: number
    spots: ReadonlyArray<Spot>
    markerIconUrl: string
    onCoordinateClicked: (coordinate: Coordinate) => void
    // TODO: Better migrate to geo bounds. Investigate.
    onCurrentLocationUpdated?: (coordinate: Coordinate, zoom: number, bounds: Bounds) => void
    onSpotClicked: (spot: Spot) => void
}
