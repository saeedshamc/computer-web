import { NextRequest, NextResponse } from 'next/server'
import { productStore } from '@/lib/productStore'

export async function GET(request: NextRequest) {
    try {
        // Get all products
        const products = await productStore.getAllProducts()

        return NextResponse.json(products)

    } catch (error) {
        console.error('Products fetch error:', error)
        return NextResponse.json(
            { message: 'خطا در دریافت محصولات' },
            { status: 500 }
        )
    }
} 