import type { Session } from 'next-auth'


const authenticatedRoutes = [/\/spots\?/, /\/profile$/]

export function validateAuthenticatedRoute(session: Session | null, request: Request) {
    const isAuthenticated = !!session?.user

    if (isAuthenticated) {
        return true
    }

    if (authenticatedRoutes.some(r => r.test(request.url))) {
        return isAuthenticated
    }

    return true
}
