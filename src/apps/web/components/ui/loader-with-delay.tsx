'use client'

import {
    useEffect,
    useState,
} from 'react'

import { SymbolIcon } from '@radix-ui/react-icons'

import { cn } from '@/utils'


interface LoaderWithDelayProps {
    className?: string
    hideText?: boolean
    showWithDelay?: boolean
}

export function LoaderWithDelay({
    className,
    hideText,
    showWithDelay,
}: LoaderWithDelayProps) {
    const [isVisible, setIsVisible] = useState(!showWithDelay)

    useEffect(() => {
        if (showWithDelay) {
            setTimeout(() => setIsVisible(true), 500)
        }
    }, [showWithDelay])

    return (
        <div className={cn('flex gap-2', className, { 'hidden': !isVisible })}>
            <SymbolIcon className='size-6 animate-spin' />
            {!hideText && <span className='font-bold'>Loading</span>}
        </div>
    )
}
