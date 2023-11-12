import { Session } from 'next-auth'

import { validateAnonymousRoute } from './anonymous-route'
import { validateAuthenticatedRoute } from './authenticated-routes'


export * from './config'

export function validateRoute(session: Session | null, request: Request) {
    if (!validateAuthenticatedRoute(session, request)) {
        return false
    }

    if (!validateAnonymousRoute(session, request)) {
        return false
    }

    return true
}
