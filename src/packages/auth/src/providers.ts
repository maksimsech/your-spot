import type { OAuthConfig } from '@auth/core/providers'
import GoogleProvider from '@auth/core/providers/google'
import OsuProvider from '@auth/core/providers/osu'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: OAuthConfig<any>[] = [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})]

const osuClientId = process.env.OSU_CLIENT_ID
const osuClientSecret = process.env.OSU_CLIENT_SECRET
if (osuClientId && osuClientSecret) {
    providers.push(OsuProvider({
        clientId: osuClientId,
        clientSecret: osuClientSecret,
    }))
}

export { providers }
