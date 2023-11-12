/* eslint-disable @next/next/no-img-element */
'use client'

import { ReactNode } from 'react'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'


interface SignInButtonProps {
    id: string
    name: string
    children: ReactNode
}

export function SignInButton({
    id,
    name,
    children,
} : SignInButtonProps) {

    return (
        <Button
            className='flex gap-2'
            variant='outline'
            onClick={() => signIn(id)}
        >
            {children}
            <span>
                {name}
            </span>
        </Button>
    )
}
