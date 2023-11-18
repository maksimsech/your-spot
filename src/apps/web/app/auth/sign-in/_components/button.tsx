/* eslint-disable @next/next/no-img-element */
'use client'

import { ReactNode } from 'react'

import { signIn } from 'next-auth/react'

import { Button as UiButton } from '@/components/ui/button'


interface ButtonProps {
    id: string
    name: string
    children: ReactNode
}

export function Button({
    id,
    name,
    children,
} : ButtonProps) {

    return (
        <UiButton
            className='flex gap-2'
            variant='outline'
            onClick={() => signIn(id)}
        >
            {children}
            <span>
                {name}
            </span>
        </UiButton>
    )
}
