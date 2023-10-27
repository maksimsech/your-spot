import {
    useState,
    useEffect,
} from 'react'

import type { Coordinate } from '@your-spot/contracts'


type CurrentLocationState = Coordinate | 'loading'

export function useCurrentLocation(defaultLocation: Coordinate): CurrentLocationState {
    const [currentLocationState, setCurrentLocationState] = useState<CurrentLocationState | null>('loading')

    // NextJS hydration
    useEffect(() => {
        if (!window?.navigator) {
            setCurrentLocationState(null)
            return
        }

        navigator.geolocation.getCurrentPosition(
            position => setCurrentLocationState({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }),
            () => setCurrentLocationState(null),
        )
    }, [])

    return currentLocationState === null
        ? defaultLocation
        : currentLocationState
}
