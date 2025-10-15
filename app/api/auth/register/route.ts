import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { userStore } from '@/lib/userStore'

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password } = await request.json()

        // Validate input
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { message: 'تمام فیلدها الزامی هستند' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create new user
        const user = await userStore.createUser({
            name,
            email,
            phone,
            password: hashedPassword
        })

        return NextResponse.json(
            { message: 'ثبت نام با موفقیت انجام شد' },
            { status: 201 }
        )

    } catch (error) {
        console.error('Registration error:', error)

        if (error instanceof Error && error.message.includes('قبلاً ثبت شده')) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'خطا در ثبت نام' },
            { status: 500 }
        )
    }
} 