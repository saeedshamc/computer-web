import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const token = request.cookies.get('token')?.value || ''

    const isAuthPage = path === '/login' || path === '/register'
    const isProtectedPath =
        path.startsWith('/checkout') ||
        path.startsWith('/profile') ||
        path.startsWith('/admin')

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/checkout/:path*',
        '/profile/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
}
