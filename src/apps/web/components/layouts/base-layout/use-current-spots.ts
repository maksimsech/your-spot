import {
    useMemo,
    useState,
} from 'react'

import debounce from 'lodash/debounce'

import {getSpotsWithinBounds} from ':actions/spots'
import type {
    Spot,
    Bounds,
} from '../../../../../packages/contracts/src'


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
