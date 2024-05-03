import {
    type NextRequest,
    NextResponse,
} from 'next/server'

import {
    auth,
    validateRoute,
} from './auth/middleware'


const ignoredAuthPages = [
    '/api/auth/signin',
    '/api/auth/signout',
    '/api/auth/error',
    '/api/auth/verify-request',
    '/api/auth/new-user',
]

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icons).*)',
        '/api/auth/:path*',
        '/auth/:path*',
        '/spots',
        '/profile',
        '/profile/:path*',
    ],
}

export default async function middleware(request: NextRequest) {
    if (request.url.includes('/api')) {
        if (request.method === 'GET' && ignoredAuthPages.some(p => request.url.includes(p))) {
            console.log('middleware @auth.js default route were accessed and blocked.', request.geo, request.ip)

            const url = request.nextUrl.clone()

            url.pathname = '/404'
            return NextResponse.rewrite(url)
        }

        return NextResponse.next()
    }

    const session = await auth()
    if (!(await validateRoute(session, request))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}
