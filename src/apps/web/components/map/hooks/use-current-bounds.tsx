'use client'

import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
    useRef,
    useCallback,
} from 'react'

import type { Bounds } from '@your-spot/contracts'

interface CurrentBoundsContext {
    currentBounds: Bounds | null
    getCurrentBounds: () => Bounds | null
    setCurrentBounds: (bounds: Bounds) => void
}

const CurrentBoundsContext = createContext<CurrentBoundsContext | null>(null)

export function useCurrentBounds() {
    const currentBoundsContext = useContext(CurrentBoundsContext)
    if (!currentBoundsContext) {
        throw new Error('useCurrentBounds should be used within CurrentBoundsProvider')
    }

    return currentBoundsContext.currentBounds
}

export function useGetCurrentBounds() {
    const currentBoundsContext = useContext(CurrentBoundsContext)
    if (!currentBoundsContext) {
        throw new Error('useCurrentBounds should be used within CurrentBoundsProvider')
    }

    return currentBoundsContext.getCurrentBounds
}


export function useMutableCurrentBounds() {
    const currentBoundsContext = useContext(CurrentBoundsContext)
    if (!currentBoundsContext) {
        throw new Error('useCurrentBounds should be used within CurrentBoundsProvider')
    }

    return currentBoundsContext
}

interface CurrentBoundsProviderProps extends PropsWithChildren {
}

export function CurrentBoundsProvider({ children }: CurrentBoundsProviderProps) {
    const [currentBounds, setCurrentBoundsState] = useState<Bounds | null>(null)
    const currentBoundsRef = useRef<Bounds | null>(null)

    const getCurrentBounds = useCallback(() => currentBoundsRef.current, [])

    const setCurrentBounds = useCallback((bounds: Bounds | null) => {
        setCurrentBoundsState(bounds)
        currentBoundsRef.current = bounds
    }, [])

    return (
        <CurrentBoundsContext.Provider value={{
            currentBounds,
            getCurrentBounds,
            setCurrentBounds,
        }}
        >
            {children}
        </CurrentBoundsContext.Provider>
    )
}
