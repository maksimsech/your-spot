import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'

import debounce from 'lodash/debounce'

import type { SpotInfo } from '@your-spot/contracts'

import { searchSpots } from '@/actions/spots'


export function useSearchSpots() {
    const [isLoading, setIsLoading] = useState(false)
    const [spots, setSpots] = useState<ReadonlyArray<SpotInfo>>([])
    const latestUpdateTimestamp = useRef<number | null>(null)

    const onTextUpdated = useMemo(
        () => debounce(
            async (text: string) => {
                if (!text) {
                    setSpots([])
                    return
                }

                const updateTimestamp = Date.now()
                latestUpdateTimestamp.current = updateTimestamp

                setIsLoading(true)
                try {
                    const result = await searchSpots({
                        text,
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
        [],
    )

    const reset = useCallback(() => setSpots([]), [])

    return {
        isLoading,
        spots,
        onTextUpdated,
        reset,
    }
}
