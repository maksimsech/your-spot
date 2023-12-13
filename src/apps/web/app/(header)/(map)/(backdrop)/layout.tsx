'use client'

import { useRouter } from 'next/navigation'

import type { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    const router = useRouter()

    return (
        <>
            <div
                id='spots-layout-backdrop'
                className='bg-background/80 animate-in fade-in-0 fixed inset-0 z-10 backdrop-blur-sm duration-0'
                onClick={() => router.push('/')}
            />
            {children}
        </>
    )
}
