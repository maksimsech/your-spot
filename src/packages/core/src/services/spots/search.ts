import type { Bounds } from '@your-spot/contracts'
import {
    type WithId,
    type Spot as DbSpot,
    spotCollection,
} from '@your-spot/database'

import { createMongoCoordinate } from './coordinate'
import { createSpot } from './mapper'


interface SearchSpotsArguments {
    text: string
    // bounds: Bounds
    limit?: number
}

export async function searchSpots({ text, limit = 10 }: SearchSpotsArguments) {
    const bounds = {
        'southWest': {
            'lat': 52.20760667286523,
            'lng': 19.93606567382813,
        },
        'northEast': {
            'lat': 52.63639665997182,
            'lng': 22.001495361328125,
        },
        'northWest': {
            'lat': 52.63639665997182,
            'lng': 19.93606567382813,
        },
        'southEast': {
            'lat': 52.20760667286523,
            'lng': 22.001495361328125,
        },
    }

    if (!text) {
        return []
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    // await new Promise((res: Function) => setTimeout(() => res(), 4000))

    const dbSpots = await spotCollection
        .aggregate<WithId<DbSpot>>([
            {
                $search: {
                    index: 'spots-autocomplete',
                    compound: {
                        must: [
                            {
                                autocomplete: {
                                    path: 'title',
                                    query: text,
                                    fuzzy: {},
                                },
                            },
                            {
                                geoWithin: {
                                    path: 'coordinate',
                                    box: boundsToBox(bounds),
                                },
                            },
                        ],
                    },
                },
            },
            {
                $limit: limit,
            },
        ])
        .toArray()

    return dbSpots.map(createSpot)
}


function boundsToBox(bounds: Bounds) {
    return {
        bottomLeft: createMongoCoordinate(bounds.southWest),
        topRight: createMongoCoordinate(bounds.northEast),
    }
}
