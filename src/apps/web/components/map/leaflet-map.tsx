'use client'

import dynamic from 'next/dynamic'

import { MapProps } from '@your-spot/map-types'

import { MapLoader } from './map-loader'


const Map = dynamic<MapProps>(() => import('@your-spot/map').then(m => m.Map), {
    loading: () => <MapLoader />,
    ssr: false,
})

export { Map }
