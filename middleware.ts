import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/register'

    // Get the token from cookies
    const token = request.cookies.get('token')?.value || ''

    // Redirect logic
    if (isPublicPath && token) {
        // If user is logged in and tries to access login/register, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and tries to access protected routes, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register'
    ]
} 