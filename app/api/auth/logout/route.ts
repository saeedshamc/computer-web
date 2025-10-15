import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Create response
        const response = NextResponse.json({
            message: 'خروج موفقیت‌آمیز'
        })

        // Clear the token cookie
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0 // Expire immediately
        })

        return response

    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { message: 'خطا در خروج' },
            { status: 500 }
        )
    }
} 