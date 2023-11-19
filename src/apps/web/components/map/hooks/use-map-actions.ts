import { useEffect } from 'react'

import {
    useRouter,
    useSearchParams,
} from 'next/navigation'


interface UseMapActionsArgs {
    refreshSpots: () => void
}

export function useMapActions({
    refreshSpots,
}: UseMapActionsArgs) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const action = searchParams.get('action')
    useEffect(() => {
        if (action === 'refresh') {
            refreshSpots()
            router.replace('/', { scroll: false })
        }
    }, [action, refreshSpots, router])
}
