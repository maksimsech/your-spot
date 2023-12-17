'use client'

import {
    createContext,
    useContext,
    useState,
} from 'react'

import type { Coordinate } from '@your-spot/contracts'

import {
    Map as InnerMap,
    type MapProps as InnerMapProps,
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

// In reality this component should be called MapProvider, but for type clarity
// and to not introduce additional component to hide provider lets rename this to hide.
// It might be fixed with HOC in someway but nah..
interface MapProps extends Omit<InnerMapProps, 'setMapContext'> {

}

export function Map(props: MapProps) {
    const [mapContext, setMapContext] = useState<MapContext | null>(null)

    return (
        <MapContext.Provider value={mapContext}>
            <InnerMap
                setMapContext={setMapContext}
                {...props}
            />
        </MapContext.Provider>
    )
}
