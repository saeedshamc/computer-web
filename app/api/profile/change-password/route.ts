import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
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
        const { currentPassword, newPassword } = await request.json()

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'رمز عبور فعلی و جدید الزامی هستند' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: 'رمز عبور جدید باید حداقل 6 کاراکتر باشد' },
                { status: 400 }
            )
        }

        // Get user
        const user = await userStore.findUserById(decoded.userId)
        if (!user) {
            return NextResponse.json(
                { message: 'کاربر یافت نشد' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidCurrentPassword) {
            return NextResponse.json(
                { message: 'رمز عبور فعلی اشتباه است' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12)

        // Update password
        const updatedUser = await userStore.updatePassword(decoded.userId, hashedNewPassword)

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'خطا در به‌روزرسانی رمز عبور' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'رمز عبور با موفقیت تغییر یافت'
        })

    } catch (error) {
        console.error('Change password error:', error)
        return NextResponse.json(
            { message: 'خطا در تغییر رمز عبور' },
            { status: 500 }
        )
    }
} 