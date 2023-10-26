export interface Coordinate {
    lat: number
    lng: number
}

export interface Bounds {
    southWest: Coordinate
    northEast: Coordinate
    northWest: Coordinate
    southEast: Coordinate
}

export interface Spot {
    id: string
    title: string
    description: string
    image?: string
    coordinate: Coordinate
}
