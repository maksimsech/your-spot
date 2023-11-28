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
    authorId: string | null
}

export interface SpotInfo extends Pick<Spot, 'id' | 'coordinate'> {
}

export interface SpotGroup {
    spotIds: Array<string>
    coordinate: Coordinate
}

export interface User {
    id: string
    name: string
    email: string | null
    image: string | null
}

export type Provider = 'google' | 'osu'

export interface Account {
    id: string
    provider: Provider
    providerAccountId: string
    userId: string
}
