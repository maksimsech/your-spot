import {
    useState,
    useEffect,
} from 'react'

import type { Coordinate } from '@your-spot/contracts'


// Warsaw
const defaultLocationState = {
    coordinate: {
        lat: 52.237049,
        lng: 21.017532,
    },
    zoom: 10,
}

interface CurrentLocation {
    coordinate: Coordinate
    zoom: number
}

type UseCurrentLocationResult =
    | {
        isLoading: false
        location: Coordinate
        zoom: number
        onLocationUpdated: (coordinate: Coordinate, zoom: number) => void
    }
    | {
        isLoading: true
    }

export function useCurrentLocation(): UseCurrentLocationResult {
    const [currentLocationState, setCurrentLocationState] = useState<CurrentLocation | 'loading'>('loading')

    // NextJS hydration
    useEffect(() => {
        const savedLocation = getLocation()
        if (savedLocation) {
            setCurrentLocationState(savedLocation)
            return
        }

        if (!window?.navigator) {
            setCurrentLocationState(defaultLocationState)
            return
        }

        navigator.geolocation.getCurrentPosition(
            position => setCurrentLocationState({
                coordinate: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
                zoom: defaultLocationState.zoom,
            }),
            () => setCurrentLocationState(defaultLocationState),
        )
    }, [])

    if (currentLocationState === 'loading') {
        return {
            isLoading: true,
        }
    }

    return {
        isLoading: false,
        location: currentLocationState.coordinate,
        zoom: currentLocationState.zoom,
        onLocationUpdated: saveLocation,
    }
}

const storageKey = 'current-location'

function saveLocation(coordinate: Coordinate, zoom: number) {
    const json = JSON.stringify({
        coordinate,
        zoom,
    })
    localStorage.setItem(storageKey, json)
}

function getLocation(): CurrentLocation | null {
    const json = localStorage.getItem(storageKey)
    if (!json) {
        return null
    }

    return JSON.parse(json)
}
