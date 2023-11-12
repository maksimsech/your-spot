import { Session } from 'next-auth'


const anonymousRoutes = [/\/auth\/sign-in/]


export function validateAnonymousRoute(session: Session | null, request: Request) {
    const isAuthenticated = !!session?.user

    if (!isAuthenticated) {
        return true
    }

    if (anonymousRoutes.some(r => r.test(request.url))) {
        return !isAuthenticated
    }

    return true
}
