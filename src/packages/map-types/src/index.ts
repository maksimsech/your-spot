import type {
    Coordinate,
    Bounds,
    Spot,
} from '@your-spot/contracts'


export interface MapProps {
    className?: string
    startingPoint: Coordinate
    spots: ReadonlyArray<Spot>
    markerIconUrl: string
    onCoordinateClicked: (coordinate: Coordinate) => void
    // TODO: Better migrate to geo bounds. Investigate.
    onCurrentBoundsUpdated: (bounds: Bounds) => void
    onSpotClicked: (spot: Spot) => void
}
