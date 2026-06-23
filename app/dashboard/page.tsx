'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaUser, FaHome, FaSearch, FaChevronDown } from 'react-icons/fa'
import { loadUserCart, saveUserCart, CartItem } from '@/lib/cartClient'

interface Product {
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

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cart, setCart] = useState<CartItem[]>([])
    const [showCart, setShowCart] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedLaptopSubs, setSelectedLaptopSubs] = useState<string[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const [cartBounce, setCartBounce] = useState(false)
    const [cartLoaded, setCartLoaded] = useState(false)
    const [selectedCpuBrands, setSelectedCpuBrands] = useState<string[]>([])
    const [selectedGpuBrands, setSelectedGpuBrands] = useState<string[]>([])
    const [selectedRamBrands, setSelectedRamBrands] = useState<string[]>([])
    const [selectedMotherboardBrands, setSelectedMotherboardBrands] = useState<string[]>([])
    const [selectedStorageBrands, setSelectedStorageBrands] = useState<string[]>([])
    const [selectedPowerBrands, setSelectedPowerBrands] = useState<string[]>([])
    const [selectedCaseBrands, setSelectedCaseBrands] = useState<string[]>([])

    // Extract unique categories from products
    const dynamicCategories = Array.from(new Set(products.map(p => p.category)));

    // Optional: Farsi display names for known categories
    const categoryDisplayNames: Record<string, string> = {
        cpu: 'پردازنده (CPU)',
        gpu: 'کارت گرافیک (GPU)',
        ram: 'رم (RAM)',
        motherboard: 'مادربورد',
        storage: 'حافظه',
        'power-supply': 'منبع تغذیه',
        case: 'کیس',
        laptop: 'لپ‌تاپ',
    };

    // زیرمجموعه‌های لپ‌تاپ
    const laptopSubcategories = [
        { id: 'gaming', name: 'گیمینگ' },
        { id: 'normal', name: 'معمولی' },
        { id: 'macbook', name: 'مک‌بوک' },
    ]

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }

        fetchProducts()
        loadUserCart().then(loadedCart => {
            setCart(loadedCart)
            setCartLoaded(true)
        })
    }, [router])

    // Sync cart to server whenever it changes (after initial load)
    useEffect(() => {
        if (!cartLoaded) return
        saveUserCart(cart)
    }, [cart, cartLoaded]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [dropdownOpen])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            if (response.ok) {
                const data = await response.json()
                setProducts(data)
            } else {
                setError('خطا در دریافت محصولات')
            }
        } catch (err) {
            setError('خطا در اتصال به سرور')
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (product: Product, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product._id === product._id)
            if (existingItem) {
                const newQuantity = Math.min(existingItem.quantity + quantity, product.stock)
                return prevCart.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            } else {
                return [...prevCart, { product, quantity: Math.min(quantity, product.stock) }]
            }
        })
        setCartBounce(true)
        setTimeout(() => setCartBounce(false), 500)
        // Show success message
        console.log(`${product.name} به سبد خرید اضافه شد`)
    }

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.product._id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.product._id === productId
                    ? { ...item, quantity }
                    : item
            )
        )
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    }

    // Filtered products by search and selected categories
    const getProductsByCategory = (category: string) => {
        if (category === 'cpu') {
            // اگر هیچ فیلتری فعال نیست، همه cpuها را نمایش بده
            if (selectedCategories.length === 0) {
                return products.filter(product =>
                    product.category === 'cpu' &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            }
            if (!selectedCategories.includes('cpu')) return []
            // اگر هیچ برند انتخاب نشده، همه cpuها را نشان بده
            if (selectedCpuBrands.length === 0) {
                return products.filter(product =>
                    product.category === 'cpu' &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            }
            // فقط cpuهای برندهای انتخاب‌شده
            return products.filter(product => {
                const name = product.name.toLowerCase()
                const isIntel = name.includes('intel')
                const isAmd = name.includes('amd')
                return (
                    product.category === 'cpu' &&
                    (
                        (selectedCpuBrands.includes('intel') && isIntel) ||
                        (selectedCpuBrands.includes('amd') && isAmd)
                    ) &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            })
        }
        if (category === 'laptop') {
            // همیشه لپ‌تاپ‌ها را نمایش بده، حتی اگر هیچ فیلتر فعالی نیست
            if (selectedCategories.length === 0) {
                return products.filter(product =>
                    product.category === 'laptop' &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            }
            if (!selectedCategories.includes('laptop')) return []
            // اگر هیچ زیرمجموعه‌ای انتخاب نشده، همه لپ‌تاپ‌ها را نشان بده
            if (selectedLaptopSubs.length === 0) {
                return products.filter(product =>
                    product.category === 'laptop' &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            }
            // فقط لپ‌تاپ‌های زیرمجموعه‌های انتخاب‌شده
            return products.filter(product =>
                product.category === 'laptop' &&
                selectedLaptopSubs.includes(product.subcategory) &&
                (
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    product.description.toLowerCase().includes(search.toLowerCase())
                )
            )
        }
        if (category === 'gpu') {
            // اگر هیچ فیلتری فعال نیست، همه gpuها را نمایش بده
            if (selectedCategories.length === 0) {
                return products.filter(product =>
                    product.category === 'gpu' &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            }
            if (!selectedCategories.includes('gpu')) return []
            // اگر هیچ برند انتخاب نشده، همه gpuها را نشان بده
            if (selectedGpuBrands.length === 0) {
                return products.filter(product =>
                    product.category === 'gpu' &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            }
            // فقط gpuهای برندهای انتخاب‌شده
            return products.filter(product => {
                const name = product.name.toLowerCase()
                const isNvidia = name.includes('nvidia')
                const isAmd = name.includes('amd')
                return (
                    product.category === 'gpu' &&
                    (
                        (selectedGpuBrands.includes('nvidia') && isNvidia) ||
                        (selectedGpuBrands.includes('amd') && isAmd)
                    ) &&
                    (
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase())
                    )
                )
            })
        }
        if (category === 'ram') {
            if (selectedCategories.length === 0) {
                return products.filter(product => product.category === 'ram' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            if (!selectedCategories.includes('ram')) return []
            if (selectedRamBrands.length === 0) {
                return products.filter(product => product.category === 'ram' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            return products.filter(product => product.category === 'ram' && selectedRamBrands.includes(product.name.split(' ')[0]) && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
        }
        if (category === 'motherboard') {
            if (selectedCategories.length === 0) {
                return products.filter(product => product.category === 'motherboard' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            if (!selectedCategories.includes('motherboard')) return []
            if (selectedMotherboardBrands.length === 0) {
                return products.filter(product => product.category === 'motherboard' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            return products.filter(product => product.category === 'motherboard' && selectedMotherboardBrands.includes(product.name.split(' ')[0]) && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
        }
        if (category === 'storage') {
            if (selectedCategories.length === 0) {
                return products.filter(product => product.category === 'storage' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            if (!selectedCategories.includes('storage')) return []
            if (selectedStorageBrands.length === 0) {
                return products.filter(product => product.category === 'storage' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            return products.filter(product => product.category === 'storage' && selectedStorageBrands.includes(product.name.split(' ')[0]) && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
        }
        if (category === 'power-supply') {
            if (selectedCategories.length === 0) {
                return products.filter(product => product.category === 'power-supply' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            if (!selectedCategories.includes('power-supply')) return []
            if (selectedPowerBrands.length === 0) {
                return products.filter(product => product.category === 'power-supply' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            return products.filter(product => product.category === 'power-supply' && selectedPowerBrands.includes(product.name.split(' ')[0]) && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
        }
        if (category === 'case') {
            if (selectedCategories.length === 0) {
                return products.filter(product => product.category === 'case' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            if (!selectedCategories.includes('case')) return []
            if (selectedCaseBrands.length === 0) {
                return products.filter(product => product.category === 'case' && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
            }
            return products.filter(product => product.category === 'case' && selectedCaseBrands.includes(product.name.split(' ')[0]) && (product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())))
        }
        // سایر دسته‌ها مثل قبل
        if (selectedCategories.length > 0 && !selectedCategories.includes(category)) return []
        return products.filter(product =>
            product.category === category &&
            (
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            )
        )
    }

    // Handle category select
    const handleCategoryToggle = (catId: string) => {
        setSelectedCategories(prev =>
            prev.includes(catId)
                ? prev.filter(id => id !== catId)
                : [...prev, catId]
        )
    }

    const scrollContainer = (containerId: string, direction: 'left' | 'right') => {
        const container = document.getElementById(containerId)
        if (container) {
            const scrollAmount = 400 // Adjust scroll amount as needed
            const currentScroll = container.scrollLeft
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount

            container.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            })
        }
    }

    // تابع تشخیص برند cpu
    const getCpuBrand = (product) => {
        const name = product.name.toLowerCase()
        if (name.includes('intel')) return 'intel'
        if (name.includes('amd')) return 'amd'
        return 'other'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">{error}</div>
                    <button
                        onClick={fetchProducts}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onCartClick={() => setShowCart(true)}
                onProfileClick={() => router.push('/profile')}
                onHomeClick={() => router.push('/dashboard')}
                cartItemCount={cart.length}
                cartBounce={cartBounce}
            />

            {/* Cart Modal */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-4 relative animate-fade-in flex flex-col max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 left-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
                            onClick={() => setShowCart(false)}
                            aria-label="بستن سبد خرید"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">سبد خرید</h2>
                        {cart.length === 0 ? (
                            <div className="text-gray-500 text-center py-8">سبد خرید شما خالی است.</div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-4">
                                    {cart.map(item => (
                                        <div key={item.product._id} className="flex items-center justify-between border-b pb-2 gap-2">
                                            <div className="flex items-center gap-2">
                                                <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-sm">{item.product.name}</div>
                                                    {item.quantity > 1 && (
                                                        <div className="text-xs text-gray-500">تعداد: {item.quantity}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="font-bold text-gray-800 text-sm">
                                                {item.quantity > 1
                                                    ? `${(item.product.price * item.quantity).toLocaleString()} تومان`
                                                    : `${item.product.price.toLocaleString()} تومان`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-center pt-3 gap-2 border-t">
                                    <span className="font-semibold text-base">مبلغ کل:</span>
                                    <span className="font-bold text-lg text-primary">{getTotalPrice().toLocaleString()} تومان</span>
                                </div>
                                <button
                                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold mt-6"
                                    onClick={() => {
                                        setShowCart(false);
                                        router.push('/checkout');
                                    }}
                                >
                                    ادامه فرایند خرید
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">فروشگاه قطعات و لپ‌تاپ</h1>
                    <p className="text-gray-600 text-sm sm:text-base">بهترین قطعات کامپیوتر و انواع لپ‌تاپ با بهترین قیمت</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative w-full max-w-md mx-auto sm:mx-0">
                        <input
                            type="text"
                            className="input-field max-w-md w-full text-sm sm:text-base text-gray-900 pr-4 pl-10 border border-primary rounded-lg focus:ring-2 focus:ring-primary shadow-sm"
                            placeholder="جستجوی محصول..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch className="text-primary h-5 w-5" />
                        </span>
                    </div>
                    {/* Category Filter Dropdown */}
                    <div className="relative w-full sm:w-64" ref={dropdownRef}>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between px-4 py-2 border border-primary rounded-lg bg-white text-gray-700 text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            onClick={() => setDropdownOpen(open => !open)}
                        >
                            <span>دسته‌بندی محصولات</span>
                            <FaChevronDown className={`ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 left-0 mt-2 bg-white border border-primary rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto animate-fade-in">
                                <div className="flex flex-col p-2 gap-1">
                                    <select
                                        value={selectedCategories[0] || ''}
                                        onChange={e => setSelectedCategories(e.target.value ? [e.target.value] : [])}
                                        className="input-field max-w-md w-full text-sm sm:text-base text-gray-900 pr-4 pl-10 border border-primary rounded-lg focus:ring-2 focus:ring-primary shadow-sm"
                                    >
                                        <option value="">همه دسته‌بندی‌ها</option>
                                        {dynamicCategories.map(cat => (
                                            <option key={cat} value={cat}>{categoryDisplayNames[cat] || cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {/* Selected categories summary */}
                        {(selectedCategories.length > 0 || selectedLaptopSubs.length > 0) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedCategories.map(catId => {
                                    const cat = dynamicCategories.find(c => c === catId)
                                    return cat ? (
                                        <span key={catId} className="bg-primary text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                            {categoryDisplayNames[cat] || cat}
                                            <button type="button" className="ml-1 text-white hover:text-red-200" onClick={() => handleCategoryToggle(catId)} aria-label="حذف دسته">
                                                ✕
                                            </button>
                                        </span>
                                    ) : null
                                })}
                                {selectedCategories.includes('laptop') && selectedLaptopSubs.map(subId => {
                                    const sub = laptopSubcategories.find(s => s.id === subId)
                                    return sub ? (
                                        <span key={subId} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                            {sub.name}
                                            <button type="button" className="ml-1 text-white hover:text-red-200" onClick={() => setSelectedLaptopSubs(prev => prev.filter(id => id !== subId))} aria-label="حذف زیرمجموعه">
                                                ✕
                                            </button>
                                        </span>
                                    ) : null
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories */}
                {dynamicCategories.map(category => {
                    const categoryProducts = getProductsByCategory(category)
                    if (categoryProducts.length === 0) return null

                    // Unique container id for scrolling
                    const containerId = `products-scroll-${category}`

                    return (
                        <div key={category} className="mb-8 sm:mb-12">
                            {/* نمایش نام دسته‌بندی */}
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center mb-4">
                                {categoryDisplayNames[category] || category}
                            </h2>
                            {/* Horizontal scrollable product list */}
                            <div className="relative">
                                {/* Scroll buttons */}
                                <button
                                    type="button"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full shadow p-2 transition-colors border border-primary hidden sm:block"
                                    onClick={() => scrollContainer(containerId, 'left')}
                                    aria-label="اسکرول به چپ"
                                >
                                    <FaChevronRight />
                                </button>
                                <button
                                    type="button"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-primary text-primary hover:text-white rounded-full shadow p-2 transition-colors border border-primary hidden sm:block"
                                    onClick={() => scrollContainer(containerId, 'right')}
                                    aria-label="اسکرول به راست"
                                >
                                    <FaChevronLeft />
                                </button>
                                <div
                                    id={containerId}
                                    className="flex overflow-x-auto gap-4 py-2 scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-gray-200 pr-2"
                                    style={{ scrollBehavior: 'smooth' }}
                                >
                                    {categoryProducts.map(product => (
                                        <div key={product._id} className="min-w-[260px] max-w-xs flex-shrink-0">
                                            <ProductCard
                                                product={product}
                                                onAddToCart={quantity => addToCart(product, quantity)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {/* زیرمجموعه‌های لپ‌تاپ */}
                {selectedCategories.includes('laptop') && (
                    <div className="flex flex-col p-2 gap-1 border-t mt-2 pt-2">
                        <span className="text-xs text-gray-500 mb-1">زیرمجموعه‌های لپ‌تاپ:</span>
                        {laptopSubcategories.map(sub => (
                            <label key={sub.id} className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-primary/10 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedLaptopSubs.includes(sub.id)}
                                    onChange={() => setSelectedLaptopSubs(prev =>
                                        prev.includes(sub.id)
                                            ? prev.filter(id => id !== sub.id)
                                            : [...prev, sub.id]
                                    )}
                                    className="accent-primary"
                                />
                                <span className="text-sm text-gray-900">{sub.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 