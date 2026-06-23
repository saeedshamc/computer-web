import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { cartStore, StoredCartItem } from '@/lib/cartStore'

export async function GET(request: NextRequest) {
    try {
        const auth = authenticateRequest(request)
        if (!auth) {
            return NextResponse.json(
                { message: 'توکن احراز هویت یافت نشد' },
                { status: 401 }
            )
        }

        const cart = await cartStore.getCart(auth.userId)
        return NextResponse.json({ cart })
    } catch (error) {
        console.error('Cart fetch error:', error)
        return NextResponse.json(
            { message: 'خطا در دریافت سبد خرید' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const auth = authenticateRequest(request)
        if (!auth) {
            return NextResponse.json(
                { message: 'توکن احراز هویت یافت نشد' },
                { status: 401 }
            )
        }

        const { items } = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json(
                { message: 'فرمت سبد خرید نامعتبر است' },
                { status: 400 }
            )
        }

        const storedItems: StoredCartItem[] = items.map((item: StoredCartItem) => ({
            productId: item.productId,
            quantity: item.quantity,
        }))

        const cart = await cartStore.saveCart(auth.userId, storedItems)
        return NextResponse.json({
            message: 'سبد خرید ذخیره شد',
            cart,
        })
    } catch (error) {
        console.error('Cart save error:', error)
        return NextResponse.json(
            { message: 'خطا در ذخیره سبد خرید' },
            { status: 500 }
        )
    }
}
