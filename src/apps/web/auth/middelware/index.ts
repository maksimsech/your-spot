import { Session } from 'next-auth'

import { validateAnonymousRoute } from './anonymous-route'
import { validateAuthenticatedRoute } from './authenticated-routes'


export * from './config'

export function validateRoute(session: Session | null, request: Request) {
    if (!validateAuthenticatedRoute(session, request)) {
        console.log('middleware/validateRoute authorized route were accessed.', request.url)
        return false
    }

    if (!validateAnonymousRoute(session, request)) {
        return false
    }

    return true
}
