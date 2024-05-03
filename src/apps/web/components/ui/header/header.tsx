import Link from 'next/link'

import { getAuthenticatedUser } from '@/auth/helper'
import { isFeatureEnabled } from '@/feature-flags'
import { cn } from '@/utils'
import { buttonVariants } from '../button'

import { MenuItems } from './menu-items/menu-items'
import { Profile } from './profile'


interface HeaderProps {
    className: string
}

export async function Header({ className }: HeaderProps) {
    const user = await getAuthenticatedUser()

    const showSpotSearch = await isFeatureEnabled('spot_search')
    const showProfile = await isFeatureEnabled('user_sign_in')

    const isLoggedIn = !!user
    const profileBlock = showProfile
        ? isLoggedIn
            ? <Profile user={user} />
            : (
                <Link
                    className={buttonVariants({ variant: 'outline' })}
                    href='/auth/sign-in'
                >
                Sign in
                </Link>
            )
        : undefined

    return (
        <header className={cn('flex w-full flex-none items-center justify-between p-2 shadow-inner border-b dark:border-b-slate-300 border-b-slate-700', className)}>
            <span className='flex items-center gap-1'>
                <Link href='/' className='py-2 font-bold'>
                    Your spot
                </Link>
            </span>
            <div className='flex items-center gap-2'>
                {profileBlock}
                <MenuItems
                    showSpotSearch={showSpotSearch}
                />
            </div>
        </header>
    )
}
