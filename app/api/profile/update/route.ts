import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { userStore } from '@/lib/userStore'

export async function PUT(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'توکن احراز هویت یافت نشد' },
                { status: 401 }
            )
        }

        const token = authHeader.substring(7)

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
        if (!decoded || !decoded.userId) {
            return NextResponse.json(
                { message: 'توکن نامعتبر است' },
                { status: 401 }
            )
        }

        // Get request body
        const { name, email, phone } = await request.json()

        // Validate input
        if (!name || !email) {
            return NextResponse.json(
                { message: 'نام و ایمیل الزامی هستند' },
                { status: 400 }
            )
        }

        // Check if email is already taken by another user
        const existingUser = await userStore.findByEmail(email)
        if (existingUser && existingUser._id !== decoded.userId) {
            return NextResponse.json(
                { message: 'این ایمیل قبلاً استفاده شده است' },
                { status: 400 }
            )
        }

        // Update user
        const updatedUser = await userStore.updateUser(decoded.userId, {
            name,
            email,
            phone: phone || ''
        })

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'کاربر یافت نشد' },
                { status: 404 }
            )
        }

        // Return updated user data (without password)
        const userData = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            createdAt: updatedUser.createdAt
        }

        return NextResponse.json({
            message: 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد',
            user: userData
        })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { message: 'خطا در به‌روزرسانی اطلاعات' },
            { status: 500 }
        )
    }
} 