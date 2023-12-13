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

const maximumZoom = 18

interface CurrentLocation {
    coordinate: Coordinate
    zoom: number
}

type UseCurrentLocationResultBase = {
    onLocationUpdated: (coordinate: Coordinate, zoom: number) => void
}

type UseCurrentLocationResult = (
    | {
        isLoading: false
        location: Coordinate
        zoom: number
    }
    | {
        isLoading: true
    }
) & UseCurrentLocationResultBase

export function useCurrentLocation(initialLocation?: Coordinate): UseCurrentLocationResult {
    const [currentLocationState, setCurrentLocationState] = useState<CurrentLocation | 'loading'>('loading')

    // NextJS hydration
    useEffect(() => {
        if (initialLocation) {
            setCurrentLocationState({
                coordinate: initialLocation,
                zoom: maximumZoom,
            })
            saveLocation(initialLocation, maximumZoom)
            return
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (currentLocationState === 'loading') {
        return {
            isLoading: true,
            onLocationUpdated: saveLocation,
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
