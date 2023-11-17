import NextAuth, { NextAuthConfig } from 'next-auth'

import { config } from '@your-spot/auth'


const configWithPages = {
    ...config,
    pages: {
        signIn: '/auth/sign-in',
    },
} satisfies NextAuthConfig

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(configWithPages)
