'use client'

import { useRouter } from 'next/navigation'

import { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    const router = useRouter()

    return (
        <>
            <div
                id='spots-layout-backdrop'
                className='bg-background/80 animate-in fade-in-0 fixed inset-0 z-10 backdrop-blur-sm duration-0'
                onClick={() => router.push('/')}
            />
            <div className='bg-background slide-in-from-bottom-0 fixed bottom-0 z-10 flex max-h-[70vh] min-h-[40vh] w-full flex-col border p-6 duration-300'>
                {children}
            </div>
        </>
    )
}
