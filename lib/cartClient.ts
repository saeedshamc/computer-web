export interface CartProduct {
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

export interface CartItem {
    product: CartProduct
    quantity: number
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

function getLocalCart(): CartItem[] {
    try {
        const cartData = localStorage.getItem('cart')
        return cartData ? JSON.parse(cartData) : []
    } catch {
        return []
    }
}

function mergeCarts(local: CartItem[], server: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>()

    for (const item of server) {
        map.set(item.product._id, { ...item })
    }

    for (const item of local) {
        const existing = map.get(item.product._id)
        if (existing) {
            existing.quantity = Math.min(
                existing.quantity + item.quantity,
                item.product.stock
            )
        } else {
            map.set(item.product._id, { ...item })
        }
    }

    return Array.from(map.values())
}

export async function loadUserCart(): Promise<CartItem[]> {
    const token = localStorage.getItem('token')
    const localCart = getLocalCart()

    if (!token) {
        return localCart
    }

    try {
        const response = await fetch('/api/cart', {
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            return localCart
        }

        const data = await response.json()
        const serverCart: CartItem[] = data.cart || []

        if (localCart.length === 0) {
            localStorage.setItem('cart', JSON.stringify(serverCart))
            return serverCart
        }

        const merged = mergeCarts(localCart, serverCart)
        await saveUserCart(merged)
        return merged
    } catch {
        return localCart
    }
}

export async function saveUserCart(cart: CartItem[]): Promise<void> {
    localStorage.setItem('cart', JSON.stringify(cart))

    const token = localStorage.getItem('token')
    if (!token) return

    try {
        await fetch('/api/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                })),
            }),
        })
    } catch (error) {
        console.error('Error syncing cart to server:', error)
    }
}
