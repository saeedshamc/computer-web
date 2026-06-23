'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FaShoppingCart, FaStar, FaTimes, FaInfoCircle } from 'react-icons/fa'

interface Product {
    _id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    stock: number
    subcategory?: string
}

interface ProductCardProps {
    product: Product
    onAddToCart: (quantity: number) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [imageError, setImageError] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'cpu': return 'پردازنده'
            case 'gpu': return 'کارت گرافیک'
            case 'ram': return 'رم'
            case 'motherboard': return 'مادربورد'
            case 'storage': return 'حافظه'
            case 'power-supply': return 'منبع تغذیه'
            case 'case': return 'کیس'
            case 'laptop': return 'لپ تاپ'
            default: return category
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'cpu': return 'bg-blue-500'
            case 'gpu': return 'bg-purple-500'
            case 'ram': return 'bg-green-500'
            case 'motherboard': return 'bg-orange-500'
            case 'storage': return 'bg-teal-500'
            case 'power-supply': return 'bg-red-500'
            case 'case': return 'bg-gray-500'
            case 'laptop': return 'bg-pink-500'
            default: return 'bg-gray-500'
        }
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (product.stock === 0) return
        onAddToCart(quantity)
    }

    const handleCardClick = () => {
        setShowDetails(true)
    }

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-0 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="relative h-48 bg-gray-200">
                    {!imageError ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-2 rounded-full ${getCategoryColor(product.category)} flex items-center justify-center`}>
                                    <span className="text-white text-xl font-bold">
                                        {product.category.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">تصویر محصول</p>
                            </div>
                        </div>
                    )}

                    <div className={`absolute top-2 right-2 ${getCategoryColor(product.category)} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                        {getCategoryName(product.category)}
                        {product.category === 'laptop' && product.subcategory && (
                            <span className="bg-white text-blue-600 rounded px-2 py-0.5 ml-1 font-bold shadow-sm">
                                {product.subcategory === 'gaming' && 'گیمینگ'}
                                {product.subcategory === 'normal' && 'معمولی'}
                                {product.subcategory === 'macbook' && 'مک‌بوک'}
                            </span>
                        )}
                    </div>

                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                            کم موجود
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            ناموجود
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2 space-x-reverse bg-white bg-opacity-80 rounded-lg p-1">
                        <button
                            className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-primary hover:text-white border border-primary transition-colors disabled:opacity-50"
                            onClick={e => { e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)) }}
                            disabled={quantity <= 1}
                            tabIndex={-1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={product.stock}
                            value={quantity}
                            aria-label="تعداد محصول"
                            onChange={e => {
                                let val = parseInt(e.target.value) || 1
                                if (val < 1) val = 1
                                if (val > product.stock) val = product.stock
                                setQuantity(val)
                            }}
                            className="w-12 text-center border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary text-black bg-white font-bold"
                            onClick={e => e.stopPropagation()}
                        />
                        <button
                            className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-primary hover:text-white border border-primary transition-colors disabled:opacity-50"
                            onClick={e => { e.stopPropagation(); setQuantity(q => Math.min(product.stock, q + 1)) }}
                            disabled={quantity >= product.stock}
                            tabIndex={-1}
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="absolute bottom-2 left-2 bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
                    >
                        <FaShoppingCart className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800 line-clamp-2">
                        {product.name}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 break-words overflow-x-hidden whitespace-pre-line">
                        {product.description}
                    </p>

                    <div className="flex items-center mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500 mr-2">(4.0)</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-2xl sm:text-2xl font-bold text-primary">
                                {product.price.toLocaleString()} تومان
                            </p>
                            <p className="text-sm text-gray-500">
                                موجودی: {product.stock} عدد
                            </p>
                        </div>

                        <button
                            onClick={handleCardClick}
                            className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                            title="مشاهده جزئیات"
                        >
                            <FaInfoCircle className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">جزئیات محصول</h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="بستن جزئیات محصول"
                                >
                                    <FaTimes className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Product Image */}
                                <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                                    {!imageError ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            onError={() => setImageError(true)}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                            <div className="text-center">
                                                <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${getCategoryColor(product.category)} flex items-center justify-center`}>
                                                    <span className="text-white text-3xl font-bold">
                                                        {product.category.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500">تصویر محصول</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`absolute top-4 right-4 ${getCategoryColor(product.category)} text-white px-3 py-1 rounded text-sm`}>
                                        {getCategoryName(product.category)}
                                    </div>

                                    {product.stock < 5 && product.stock > 0 && (
                                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-sm">
                                            کم موجود
                                        </div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm">
                                            ناموجود
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-500 mr-3">(4.0)</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">توضیحات محصول:</h4>
                                        <p className="text-gray-600 leading-relaxed break-words overflow-x-hidden whitespace-pre-line">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">دسته‌بندی:</span>
                                            <span className="font-semibold">{getCategoryName(product.category)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">موجودی:</span>
                                            <span className={`font-semibold text-gray-900`}>
                                                {product.stock} عدد
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">قیمت:</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {product.price.toLocaleString()} تومان
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-2">
                                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                            <span className="text-gray-600">تعداد:</span>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min={1}
                                                max={product.stock}
                                                value={quantity}
                                                aria-label="تعداد محصول"
                                                onChange={e => {
                                                    let val = parseInt(e.target.value) || 1
                                                    if (val < 1) val = 1
                                                    if (val > product.stock) val = product.stock
                                                    setQuantity(val)
                                                }}
                                                className="w-12 text-center border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary text-black bg-white font-bold"
                                                onClick={e => e.stopPropagation()}
                                            />
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                                disabled={quantity >= product.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => {
                                                onAddToCart(quantity)
                                                setShowDetails(false)
                                            }}
                                            disabled={product.stock === 0}
                                            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                                        >
                                            <FaShoppingCart className="h-5 w-5" />
                                            <span>{product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 