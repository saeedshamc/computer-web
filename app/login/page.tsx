'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUser, FaLock, FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa'

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user')
    const router = useRouter()

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token')
        if (token) {
            router.replace('/dashboard')
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                // Store token in localStorage for client-side access
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))

                // Check role for admin tab
                if (activeTab === 'admin') {
                    if (data.user.role === 'admin') {
                        router.replace('/admin')
                    } else {
                        setError('دسترسی فقط برای کارکنان مجاز است')
                        // Remove token/user if not admin
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        return
                    }
                } else {
                    // Redirect to dashboard for normal users
                router.replace('/dashboard')
                }
            } else {
                setError(data.message || 'خطا در ورود')
            }
        } catch (err) {
            setError('خطا در اتصال به سرور')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        ورود به حساب کاربری
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        یا{' '}
                        <Link href="/register" className="font-medium text-primary hover:text-blue-500">
                            ثبت نام کنید
                        </Link>
                    </p>
                </div>
                {/* Tabs */}
                <div className="flex justify-center gap-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded-t-lg font-bold border-b-2 transition-colors ${activeTab === 'user' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
                        onClick={() => setActiveTab('user')}
                    >
                        <FaUser className="inline mr-1" /> ورود کاربران
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg font-bold border-b-2 transition-colors ${activeTab === 'admin' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <FaUserTie className="inline mr-1" /> ورود کارکنان
                    </button>
                </div>
                {/* User Login Form */}
                {activeTab === 'user' && (
                    <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                    ایمیل <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field pr-10"
                                    placeholder="ایمیل خود را وارد کنید"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                                    رمز عبور <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input-field pr-10"
                                    placeholder="رمز عبور خود را وارد کنید"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </div>
                </form>
                )}
                {/* Admin Login Form */}
                {activeTab === 'admin' && (
                    <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="admin-email" className="block text-sm font-medium text-black mb-2">
                                    ایمیل ادمین <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FaUserTie className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="admin-email"
                                        name="email"
                                        type="email"
                                        required
                                        className="input-field pr-10"
                                        placeholder="ایمیل ادمین را وارد کنید"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="admin-password" className="block text-sm font-medium text-black mb-2">
                                    رمز عبور <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="admin-password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="input-field pr-10"
                                        placeholder="رمز عبور ادمین را وارد کنید"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'در حال ورود...' : 'ورود ادمین'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
} 