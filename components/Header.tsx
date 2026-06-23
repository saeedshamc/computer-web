'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaTimes, FaInfoCircle, FaBars, FaGlobe } from 'react-icons/fa'

interface HeaderProps {
    onCartClick: () => void
    onProfileClick: () => void
    onHomeClick: () => void
    cartItemCount: number
    cartBounce?: boolean
}

export default function Header({ onCartClick, onProfileClick, onHomeClick, cartItemCount, cartBounce }: HeaderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [showAbout, setShowAbout] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            // Call logout API
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            // Clear localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('cart')

            // Redirect to login
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            // Fallback: clear localStorage and redirect
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('cart')
            router.push('/login')
        }
    }

    const changeLanguage = (lang: string) => {
        // Remove current locale from path if present
        const pathParts = pathname.split('/').filter(Boolean)
        const locales = ['fa', 'en', 'fr']
        if (locales.includes(pathParts[0])) {
            pathParts.shift()
        }
        const newPath = '/' + [lang, ...pathParts].join('/')
        router.push(newPath)
    }

    return (
        <>
            <header className="sticky top-0 bg-white shadow-md relative z-50">
                <div className="container mx-auto px-2 sm:px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                            <h1 className="text-lg sm:text-xl font-bold text-primary">فروشگاه قطعات کامپیوتر</h1>
                        </div>
                        {/* Hamburger for mobile */}
                        <div className="flex sm:hidden">
                            {mobileMenuOpen ? (
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-primary focus:outline-none"
                                    aria-label="بستن منو"
                                    aria-expanded="true"
                                    aria-controls="mobile-menu"
                                >
                                    <FaBars className="h-6 w-6" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="text-primary focus:outline-none"
                                    aria-label="باز کردن منو"
                                    aria-expanded="false"
                                    aria-controls="mobile-menu"
                                >
                                    <FaBars className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                        {/* Nav buttons for desktop */}
                        <div className="hidden sm:flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                            <button
                                onClick={() => setShowAbout(true)}
                                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                aria-label="درباره ما"
                            >
                                <FaInfoCircle className="h-5 w-5 text-primary" />
                                <span>درباره ما</span>
                            </button>

                            <button
                                onClick={onHomeClick}
                                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                aria-label="خانه"
                            >
                                <FaHome className="h-5 w-5 text-primary" />
                                <span>خانه</span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={onCartClick}
                                    className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                    aria-label="سبد خرید"
                                >
                                    <FaShoppingCart className={`h-5 w-5 text-primary ${cartBounce ? 'animate-bounce-fast' : ''}`} />
                                    <span>سبد خرید</span>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={onProfileClick}
                                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                aria-label="پروفایل"
                            >
                                <FaUser className="h-5 w-5 text-primary" />
                                <span>پروفایل</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-700 transition-colors font-bold"
                                aria-label="خروج"
                            >
                                <FaSignOutAlt className="h-5 w-5 text-red-600" />
                                <span>خروج</span>
                            </button>

                            {/* Language Switcher */}
                            <div className="flex items-center gap-1">
                                <FaGlobe className="h-5 w-5 text-primary" aria-label="انتخاب زبان" />
                                <label htmlFor="lang-select" className="sr-only">انتخاب زبان</label>
                                <select
                                    id="lang-select"
                                    aria-label="انتخاب زبان"
                                    className="border border-primary text-primary font-bold bg-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-blue-700 transition-colors shadow-sm"
                                    defaultValue={(() => {
                                        const locales = ['fa', 'en', 'fr']
                                        const pathParts = pathname.split('/').filter(Boolean)
                                        return locales.includes(pathParts[0]) ? pathParts[0] : 'fa'
                                    })()}
                                    onChange={e => changeLanguage(e.target.value)}
                                >
                                    <option value="fa" className="text-gray-900">فارسی</option>
                                    <option value="en" className="text-gray-900">English</option>
                                    <option value="fr" className="text-gray-900">Français</option>
                                </select>
                            </div>
                            {/* End Language Switcher */}
                        </div>
                    </div>
                    {/* Mobile menu dropdown */}
                    {mobileMenuOpen && (
                        <>
                            {/* Overlay */}
                            <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setMobileMenuOpen(false)}></div>
                            {/* Mobile menu dropdown */}
                            <div id="mobile-menu" className="sm:hidden flex flex-col gap-2 mt-2 bg-white rounded shadow p-4 z-50 fixed top-4 right-4 left-4 max-h-[80vh] overflow-y-auto animate-fade-in">
                                <div className="flex justify-end mb-2">
                                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-red-600 transition-colors" aria-label="بستن منو">
                                        <FaTimes className="h-6 w-6" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowAbout(true)}
                                    className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                    aria-label="درباره ما"
                                >
                                    <FaInfoCircle className="h-5 w-5 text-primary" />
                                    <span>درباره ما</span>
                                </button>

                                <button
                                    onClick={onHomeClick}
                                    className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                    aria-label="خانه"
                                >
                                    <FaHome className="h-5 w-5 text-primary" />
                                    <span>خانه</span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={onCartClick}
                                        className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                        aria-label="سبد خرید"
                                    >
                                        <FaShoppingCart className={`h-5 w-5 text-primary ${cartBounce ? 'animate-bounce-fast' : ''}`} />
                                        <span>سبد خرید</span>
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={onProfileClick}
                                    className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-primary transition-colors font-bold"
                                    aria-label="پروفایل"
                                >
                                    <FaUser className="h-5 w-5 text-primary" />
                                    <span>پروفایل</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-700 transition-colors font-bold"
                                    aria-label="خروج"
                                >
                                    <FaSignOutAlt className="h-5 w-5 text-red-600" />
                                    <span>خروج</span>
                                </button>

                                {/* Language Switcher */}
                                <div className="flex items-center gap-1 mt-2">
                                    <FaGlobe className="h-5 w-5 text-primary" aria-label="انتخاب زبان" />
                                    <label htmlFor="lang-select-mobile" className="sr-only">انتخاب زبان</label>
                                    <select
                                        id="lang-select-mobile"
                                        aria-label="انتخاب زبان"
                                        className="border border-primary text-primary font-bold bg-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-blue-700 transition-colors shadow-sm"
                                        defaultValue={(() => {
                                            const locales = ['fa', 'en', 'fr']
                                            const pathParts = pathname.split('/').filter(Boolean)
                                            return locales.includes(pathParts[0]) ? pathParts[0] : 'fa'
                                        })()}
                                        onChange={e => changeLanguage(e.target.value)}
                                    >
                                        <option value="fa" className="text-gray-900">فارسی</option>
                                        <option value="en" className="text-gray-900">English</option>
                                        <option value="fr" className="text-gray-900">Français</option>
                                    </select>
                                </div>
                                {/* End Language Switcher */}
                            </div>
                        </>
                    )}
                </div>
            </header>
            {showAbout && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            type="button"
                            onClick={() => setShowAbout(false)}
                            className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-xl"
                            aria-label="بستن"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-primary">درباره فروشگاه ما</h2>
                        <p className="text-gray-700 leading-relaxed text-justify">
                            فروشگاه قطعات کامپیوتر ما با هدف ارائه بهترین و جدیدترین قطعات سخت‌افزاری، تجربه‌ای مطمئن و لذت‌بخش از خرید آنلاین را برای مشتریان فراهم می‌کند. ما با ارائه محصولات اورجینال، قیمت مناسب، ارسال سریع و پشتیبانی تخصصی، همواره در کنار شما هستیم تا بهترین انتخاب را برای ارتقاء یا اسمبل سیستم خود داشته باشید. رضایت و اعتماد شما، بزرگ‌ترین سرمایه ماست.
                        </p>
                    </div>
                </div>
            )}
        </>
    )
} 