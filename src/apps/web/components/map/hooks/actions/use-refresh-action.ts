import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { useRemoveQueryParams } from '@/hooks/use-remove-query-params'


export function useRefreshAction(refreshSpots: () => void) {
    const searchParams = useSearchParams()
    const { removeQueryParams } = useRemoveQueryParams()

    const action = searchParams.get('action')
    useEffect(() => {
        if (action === 'refresh') {
            refreshSpots()
            removeQueryParams('action')
        }
    }, [action, refreshSpots, removeQueryParams])
}
