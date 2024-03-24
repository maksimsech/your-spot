import type {
    Coordinate,
    Bounds,
    SpotCoordinates,
    SpotGroup,
} from '@your-spot/contracts'


export interface MapProps {
    className?: string
    center: Coordinate
    zoom: number
    spots: ReadonlyArray<SpotCoordinates>
    spotGroups: ReadonlyArray<SpotGroup>
    markerIconUrl: string
    markerGroupIconUrl: string
    onCoordinateClicked: (coordinate: Coordinate) => void
    onCurrentLocationUpdated: (args: {
        coordinate: Coordinate
        zoom: number
        minZoom: number
        maxZoom: number
        bounds: Bounds
    }) => void
    onSpotClicked: (spot: SpotCoordinates) => void
    onSpotGroupClicked: (spotGroup: SpotGroup) => void
}

export interface MapRef {
    setCurrentLocation: (location: Coordinate, zoom?: number) => void
}
