import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { userStore } from '@/lib/userStore'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'ایمیل و رمز عبور الزامی هستند' },
                { status: 400 }
            )
        }

        // Validate user credentials
        const user = await userStore.validatePassword(email, password)
        if (!user) {
            return NextResponse.json(
                { message: 'ایمیل یا رمز عبور اشتباه است' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        )

        // Return user data (without password) and token
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            role: user.role
        }

        // Create response with token in cookie
        const response = NextResponse.json({
            message: 'ورود موفقیت‌آمیز',
            token,
            user: userData
        })

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'خطا در ورود' },
            { status: 500 }
        )
    }
} 