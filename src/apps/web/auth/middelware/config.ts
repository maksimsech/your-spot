import NextAuth from 'next-auth'

import { baseConfig } from '@your-spot/auth/base-config'


export const { auth } = NextAuth(baseConfig)
