import { NextRequest, NextResponse } from 'next/server'
import { userStore } from '@/lib/userStore'

export async function GET(request: NextRequest) {
    try {
        // Test userStore functionality
        const testUser = await userStore.findUserByEmail('test@example.com')

        return NextResponse.json({
            message: 'سیستم کاربران آماده است',
            status: 'ready',
            userStore: 'working',
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('UserStore test error:', error)
        return NextResponse.json({
            message: 'خطا در سیستم کاربران',
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 'error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
} 