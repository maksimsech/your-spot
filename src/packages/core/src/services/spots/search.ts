import type { Bounds } from '@your-spot/contracts'
import {
    type WithId,
    type Spot as DbSpot,
    spotCollection,
} from '@your-spot/database'

import { createMongoCoordinate } from './coordinate'
import { createSpotDescription } from './mapper'


interface SearchSpotsArguments {
    text: string
    bounds: Bounds
    limit?: number
}

export async function searchSpots({ text, bounds, limit = 10 }: SearchSpotsArguments) {
    if (!text) {
        return []
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    // await new Promise((res: Function) => setTimeout(() => res(), 4000))

    const dbSpots = await spotCollection
        .aggregate<Pick<WithId<DbSpot>, '_id' | 'coordinate' | 'title'>>([
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
                    returnStoredSource: true,
                },
            },
            {
                $limit: limit,
            },
        ])
        .toArray()

    return dbSpots.map(createSpotDescription)
}


function boundsToBox(bounds: Bounds) {
    return {
        bottomLeft: createMongoCoordinate(bounds.southWest),
        topRight: createMongoCoordinate(bounds.northEast),
    }
}
