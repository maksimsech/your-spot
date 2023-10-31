import {
    useCallback,
    useMemo,
    useRef,
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
    refresh: () => void
}

// TODO: Refactor
export function useCurrentSpots(): UseCurrentSpotsResult {
    const [spots, setSpots] = useState<Spot[]>([])
    const latestBounds = useRef<Bounds | null>(null)

    const onBoundsUpdated = useMemo(
        () => debounce(
            async (bounds: Bounds) => {
                latestBounds.current = bounds

                const newSpots = await getSpotsWithinBounds(bounds)
                setSpots(newSpots)
            },
            100,
        ),
        [],
    )

    const refresh = useCallback(
        () => latestBounds.current && onBoundsUpdated(latestBounds.current),
        [onBoundsUpdated],
    )

    return {
        spots,
        onBoundsUpdated,
        refresh,
    }
}
