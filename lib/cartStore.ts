import fs from 'fs'
import path from 'path'
import { productStore } from './productStore'

export interface StoredCartItem {
    productId: string
    quantity: number
}

export interface CartItemWithProduct {
    product: {
        _id: string
        name: string
        description: string
        price: number
        image: string
        category: string
        stock: number
        createdAt: string
        subcategory?: string
    }
    quantity: number
}

const cartsFile = path.join(process.cwd(), 'lib', 'carts.json')

if (!fs.existsSync(cartsFile)) {
    fs.writeFileSync(cartsFile, '{}')
}

export class CartStore {
    private carts: Record<string, StoredCartItem[]> = {}

    constructor() {
        this.loadCarts()
    }

    private loadCarts() {
        try {
            const data = fs.readFileSync(cartsFile, 'utf8')
            this.carts = JSON.parse(data)
        } catch (error) {
            console.error('Error loading carts:', error)
            this.carts = {}
        }
    }

    private saveCarts() {
        try {
            fs.writeFileSync(cartsFile, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.error('Error saving carts:', error)
        }
    }

    private async enrichItems(items: StoredCartItem[]): Promise<CartItemWithProduct[]> {
        const enriched: CartItemWithProduct[] = []

        for (const item of items) {
            const product = await productStore.getProductById(item.productId)
            if (!product) continue

            enriched.push({
                product,
                quantity: Math.min(item.quantity, product.stock),
            })
        }

        return enriched
    }

    async getCart(userId: string): Promise<CartItemWithProduct[]> {
        const items = this.carts[userId] || []
        return this.enrichItems(items)
    }

    async saveCart(userId: string, items: StoredCartItem[]): Promise<CartItemWithProduct[]> {
        const validItems: StoredCartItem[] = []

        for (const item of items) {
            if (!item.productId || item.quantity < 1) continue

            const product = await productStore.getProductById(item.productId)
            if (!product) continue

            validItems.push({
                productId: item.productId,
                quantity: Math.min(item.quantity, product.stock),
            })
        }

        this.carts[userId] = validItems
        this.saveCarts()
        return this.enrichItems(validItems)
    }

    async clearCart(userId: string): Promise<void> {
        delete this.carts[userId]
        this.saveCarts()
    }
}

export const cartStore = new CartStore()
