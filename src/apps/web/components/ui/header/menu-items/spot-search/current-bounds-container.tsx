'use client'

import { useCurrentBounds } from '@/components/map'

import { SpotSearch } from './spot-search'


export function CurrentBoundsContainer() {
    const currentBounds = useCurrentBounds()
    if (!currentBounds) {
        return null
    }

    return <SpotSearch />
}
