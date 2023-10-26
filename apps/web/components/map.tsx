'use client'

import dynamic from 'next/dynamic'

import { MapProps } from '@your-spot/map-types'

const Map = dynamic<MapProps>(() => import('@your-spot/map').then(m => m.Map), {
    loading: () => <p>Loading...</p>, // TODO: Add loading component or skeleton
    ssr: false,
})

export { Map }
