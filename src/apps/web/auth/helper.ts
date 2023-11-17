import {
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

export async function getAuthorizedUser() {
    const session = await auth()

    return session?.user
}
