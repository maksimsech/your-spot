import type {
    Bounds,
    Coordinate,
} from '@your-spot/contracts'
import type {
    LngLatTuple,
    Coordinate as MongoCoordinate,
} from '@your-spot/database/types'


export function createMongoCoordinate(coordinate: Coordinate): MongoCoordinate {
    return {
        type: 'Point',
        coordinates: coordinateToLngLatTuple(coordinate),
    }
}

export function createContractCoordinate(coordinate: MongoCoordinate): Coordinate {
    return {
        lng: coordinate.coordinates[0],
        lat: coordinate.coordinates[1],
    }
}

export function boundsToCoordinates(bounds: Bounds) {
    const firstAndLastTuple = coordinateToLngLatTuple(bounds.southWest)

    return [
        [
            firstAndLastTuple,
            coordinateToLngLatTuple(bounds.northWest),
            coordinateToLngLatTuple(bounds.northEast),
            coordinateToLngLatTuple(bounds.southEast),
            firstAndLastTuple,
        ],
    ]
}

function coordinateToLngLatTuple(coordinate: Coordinate): LngLatTuple {
    return [coordinate.lng, coordinate.lat]
}
