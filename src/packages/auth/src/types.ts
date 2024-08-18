import type { User } from '@auth/core/types'


export interface AuthUser extends User {
    id: string
}

declare module '@auth/core/types' {
    export interface Session extends DefaultSession {
        user?: AuthUser
    }
}
