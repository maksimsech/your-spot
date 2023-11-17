import type {
    User,
    DefaultSession,
} from '@auth/core/types'


export interface AuthUser extends User {
}

declare module '@auth/core/types' {
    export interface Session extends DefaultSession {
        user?: AuthUser
    }
}
