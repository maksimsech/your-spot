'use client'

import {
    createContext,
    useContext,
    useState,
} from 'react'

import type { Coordinate } from '@your-spot/contracts'

import {
    Map,
    type MapProps,
} from './map'


export interface MapContext {
    refreshSpots: () => void
    navigateTo: (location: Coordinate, zoom?: number) => void
}

const MapContext = createContext<MapContext | null>(null)

export function useMap() {
    const mapContext = useContext(MapContext)

    return mapContext
}

interface MapProviderProps extends Omit<MapProps, 'setMapContext'> {

}

export function MapProvider(props: MapProviderProps) {
    const [mapContext, setMapContext] = useState<MapContext | null>(null)

    return (
        <MapContext.Provider value={mapContext}>
            <Map
                setMapContext={setMapContext}
                {...props}
            />
        </MapContext.Provider>
    )
}
