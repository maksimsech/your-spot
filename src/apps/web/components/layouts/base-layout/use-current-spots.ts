import {
    useMemo,
    useState,
} from 'react'

import debounce from 'lodash/debounce'

import type {
    Spot,
    Bounds,
} from '@your-spot/contracts'

import { getSpotsWithinBounds } from '@/actions/spots'


interface UseCurrentSpotsResult {
    spots: ReadonlyArray<Spot>
    onBoundsUpdated: (bounds: Bounds) => void
}

export function useCurrentSpots(): UseCurrentSpotsResult {
    const [spots, setSpots] = useState<Spot[]>([])
    const onBoundsUpdated = useMemo(
        () => debounce(
            async (bounds: Bounds) => {
                // TODO: Refactor
                const newSpots = await getSpotsWithinBounds(bounds)
                setSpots(newSpots)
            },
            100,
        ),
        [],
    )

    return {
        spots,
        onBoundsUpdated,
    }
}
