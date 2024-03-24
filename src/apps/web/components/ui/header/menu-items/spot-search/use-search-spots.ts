import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'

import debounce from 'lodash/debounce'

import type { SpotDescription } from '@your-spot/contracts'

import { searchSpots } from '@/actions/spots'
import { useGetCurrentBounds } from '@/components/map'


export function useSearchSpots() {
    const [isLoading, setIsLoading] = useState(false)
    const [spots, setSpots] = useState<ReadonlyArray<SpotDescription>>([])
    const latestUpdateTimestamp = useRef<number | null>(null)

    const getCurrentBounds = useGetCurrentBounds()

    const onTextUpdated = useMemo(
        () => debounce(
            async (text: string) => {
                if (!text) {
                    setSpots([])
                    return
                }

                const currentBounds = getCurrentBounds()
                if (!currentBounds) {
                    // Something went wrong and this should be the case, but stuff happens...
                    return
                }

                const updateTimestamp = Date.now()
                latestUpdateTimestamp.current = updateTimestamp

                setIsLoading(true)
                try {
                    const result = await searchSpots({
                        text,
                        bounds: currentBounds,
                    })

                    if (updateTimestamp === latestUpdateTimestamp.current) {
                        setSpots(result)
                    }
                }
                finally {
                    setIsLoading(false)
                }
            },
            300,
        ),
        [getCurrentBounds],
    )

    const reset = useCallback(() => setSpots([]), [])

    return {
        isLoading,
        spots,
        onTextUpdated,
        reset,
    }
}
