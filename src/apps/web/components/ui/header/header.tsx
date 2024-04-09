import Link from 'next/link'

import { getAuthenticatedUser } from '@/auth/helper'
import { cn } from '@/utils'
import { buttonVariants } from '../button'

import { MenuItems } from './menu-items/menu-items'
import { Profile } from './profile'


interface HeaderProps {
    className: string
}

export async function Header({ className }: HeaderProps) {
    const user = await getAuthenticatedUser()

    const isLoggedIn = !!user

    return (
        <header className={cn('flex w-full flex-none items-center justify-between p-2 shadow-inner border-b dark:border-b-slate-300 border-b-slate-700', className)}>
            <span className='flex items-center gap-1'>
                <Link href='/' className='font-bold'>
                    Your spot
                </Link>
            </span>
            <div className='flex items-center gap-2'>
                {!isLoggedIn && (
                    <Link
                        className={buttonVariants({ variant: 'outline' })}
                        href='/auth/sign-in'
                    >
                        Sign in
                    </Link>
                )}
                {isLoggedIn && <Profile user={user} />}
                <MenuItems />
            </div>
        </header>
    )
}
