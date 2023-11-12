import type { AuthConfig } from '@auth/core'

import { providers } from './providers'


export const baseConfig = {
    providers,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.email = user.email
                token.sub = user.id
                token.name = user.name
            }

            return token
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.sub!
            }

            return session
        },
    },
} satisfies AuthConfig
