import { cache } from 'react'

import { redirect } from 'next/navigation'

import type {
    Account,
    Provider,
} from '@your-spot/contracts'

import { auth } from './index'


const providerLogoPath = 'https://authjs.dev/img/providers'
const providerAccountLinkMap: Record<Provider, (account: Account) => string | undefined> = {
    osu: (a) => `https://osu.ppy.sh/users/${a.providerAccountId}`,
    google: () => undefined,
}

export function getLogo(logo: string | undefined) {
    if (!logo) {
        return null
    }

    if (logo.startsWith('/')) {
        return providerLogoPath + logo
    }

    return logo
}

export function getOauthProviderLogoUrls(logo?: string, logoDark?: string) {
    return {
        logo: getLogo(logo),
        logoDark: getLogo(logoDark),
    }
}

export function getAccountUrl(account: Account) {
    return providerAccountLinkMap[account.provider](account)
}

export const getAuthenticatedUser = cache(async () => {
    const session = await auth()

    return session?.user
})

export async function ensureAuthenticated(shouldRedirect?: boolean) {
    const user = await getAuthenticatedUser()
    if (!user) {
        if (shouldRedirect) {
            redirect('/')
        }

        // TODO: Custom exception?
        throw new Error('Unauthorized')
    }

    return user
}
