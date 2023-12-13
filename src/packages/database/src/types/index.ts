export type LngLatTuple = readonly [number, number]

export interface Coordinate {
    type: 'Point'
    coordinates: LngLatTuple
}
