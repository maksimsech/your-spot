import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'

import debounce from 'lodash/debounce'

import type {
    SpotGroup,
    Bounds,
    SpotCoordinates,
} from '@your-spot/contracts'

import { getSpotsAndGroupsWithinBounds } from '@/actions/spots'


// TODO: Refactor
export function useCurrentSpots() {
    const [isLoading, setIsLoading] = useState(false)
    const [spots, setSpots] = useState<ReadonlyArray<SpotCoordinates>>([])
    const [spotGroups, setSpotGroups] = useState<ReadonlyArray<SpotGroup>>([])
    const latestParams = useRef<Parameters<typeof onBoundsUpdated> | null>(null)
    const latestUpdateTimestamp = useRef<number | null>(null)

    const onBoundsUpdated = useMemo(
        () => debounce(
            async (bounds: Bounds, zoom: number, minZoom: number, maxZoom: number) => {
                latestParams.current = [bounds, zoom, minZoom, maxZoom]

                const updateTimestamp = Date.now()
                latestUpdateTimestamp.current = updateTimestamp

                setIsLoading(true)
                try {
                    const result = await getSpotsAndGroupsWithinBounds({
                        bounds,
                        zoom,
                        minZoom,
                        maxZoom,
                    })

                    if (updateTimestamp === latestUpdateTimestamp.current) {
                        setSpots(result.spots)
                        setSpotGroups(result.spotGroups)
                    }
                }
                finally {
                    setIsLoading(false)
                }
            },
            300,
        ),
        [],
    )

    const refresh = useCallback(
        () => latestParams.current && onBoundsUpdated(...latestParams.current),
        [onBoundsUpdated],
    )

    return {
        isLoading,
        spots,
        spotGroups,
        onBoundsUpdated,
        refresh,
    }
}
