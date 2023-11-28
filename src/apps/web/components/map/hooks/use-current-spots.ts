import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'

import debounce from 'lodash/debounce'

import {
    SpotGroup,
    type Bounds,
    type SpotInfo,
} from '@your-spot/contracts'

import { getSpotsAndGroupsWithinBounds } from '@/actions/spots'


// TODO: Refactor
export function useCurrentSpots() {
    const [spots, setSpots] = useState<SpotInfo[]>([])
    const [spotGroups, setSpotGroups] = useState<SpotGroup[]>([])
    const latestParams = useRef<Parameters<typeof onBoundsUpdated> | null>(null)
    const latestUpdateTimestamp = useRef<number | null>(null)

    const onBoundsUpdated = useMemo(
        () => debounce(
            async (bounds: Bounds, zoom: number, minZoom: number, maxZoom: number) => {
                latestParams.current = [bounds, zoom, minZoom, maxZoom]

                const updateTimestamp = Date.now()
                latestUpdateTimestamp.current = updateTimestamp

                const result = await getSpotsAndGroupsWithinBounds({
                    bounds,
                    zoom,
                    minZoom,
                    maxZoom,
                })
                if (updateTimestamp === latestUpdateTimestamp.current) {
                    console.log(result)
                    setSpots(result.spots)
                    setSpotGroups(result.spotGroups)
                }
            },
            100,
        ),
        [],
    )

    const refresh = useCallback(
        () => latestParams.current && onBoundsUpdated(...latestParams.current),
        [onBoundsUpdated],
    )

    return {
        spots,
        spotGroups,
        onBoundsUpdated,
        refresh,
    }
}
