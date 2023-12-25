import { Session } from 'next-auth'

import { validateAnonymousRoute } from './anonymous-route'
import { validateAuthenticatedRoute } from './authenticated-routes'


export * from './config'

export async function validateRoute(session: Session | null, request: Request) {
    if (!validateAuthenticatedRoute(session, request)) {
        console.log('middleware/validateRoute authorized route were accessed.', request.url)
        return false
    }

    if (!validateAnonymousRoute(session, request)) {
        return false
    }

    // TODO: Move logic to middleware when mongodb will be edge compatible or middleware will support edge runtime
    // if (!(await validateAuthorizedRoute(session, request))) {
    //     return false
    // }

    return true
}
