'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'


export function DropdownItems() {
    const router = useRouter()

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                Profile
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </>
    )
}
