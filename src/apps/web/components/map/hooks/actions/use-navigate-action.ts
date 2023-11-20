import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import {
    useSearchParams,
    type ReadonlyURLSearchParams,
} from 'next/navigation'

import type { MapRef } from '@your-spot/map-types'

import { useRemoveQueryParams } from '@/hooks/use-remove-query-params'

export function useNavigateAction(map: MapRef | null) {
    const searchParams = useSearchParams()
    const { removeQueryParams } = useRemoveQueryParams()

    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const action = searchParams.get('action')

    const processNavigateAction = useCallback(() => {
        if (action !== 'navigate') {
            return
        }

        const latLng = getLatLngFromParams(searchParams)
        if (!latLng) {
            return
        }

        removeQueryParams('action', 'lat', 'lng')

        return latLng
    }, [action, removeQueryParams, searchParams])

    const location = isInitialLoad
        ? processNavigateAction()
        : undefined

    useEffect(() => {
        if (!location && map) {
            const newLocation = processNavigateAction()
            if (newLocation) {
                map.setCurrentLocation(newLocation)
            }
        }

        if (isInitialLoad) {
            setIsInitialLoad(false)
        }
    }, [map, isInitialLoad, location, processNavigateAction])

    return location
}

function getLatLngFromParams(searchParams: ReadonlyURLSearchParams) {
    const latString = searchParams.get('lat')
    const lngString = searchParams.get('lng')
    if (!latString || !lngString) {
        return null
    }

    const lat = parseFloat(latString)
    const lng = parseFloat(lngString)
    if (isNaN(lat) || isNaN(lng)) {
        return null
    }

    return {
        lat,
        lng,
    }
}
