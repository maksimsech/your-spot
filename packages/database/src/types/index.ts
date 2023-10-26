export type LngLatTuple = [number, number]

export interface Coordinate {
    type: 'Point'
    coordinates: LngLatTuple
}
