import { NextResponse } from 'next/server'

import {
    auth,
    validateRoute,
} from './auth/middelware'


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|icons).*)',
        '/auth/:path*',
        '/spots',
        '/profile',
        '/profile/:path*',
    ],
}

export default async function middleware(request: Request) {
    const session = await auth()
    if (!validateRoute(session, request)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}
