import { cache } from 'react'

import {
    Account,
    Provider,
} from '@your-spot/contracts'
import { getUser } from '@your-spot/core'

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

// TODO: Instead of going each time to db create new model and write it to session
async function getAuthorizedUserCore() {
    const session = await auth()
    if (!session?.user) {
        return null
    }

    return await getUser(session.user.id)
}

export const getAuthorizedUser = cache(getAuthorizedUserCore)
