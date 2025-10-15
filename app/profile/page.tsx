'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

interface User {
    _id: string
    name: string
    email: string
    phone: string
    createdAt: string
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }

        // Get user data from localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
            const userObj = JSON.parse(userData)
            setUser(userObj)
            setFormData({
                name: userObj.name || '',
                email: userObj.email || '',
                phone: userObj.phone || ''
            })
        }
        setLoading(false)
    }, [router])

    const handleEdit = () => {
        setIsEditing(true)
        setError('')
        setSuccess('')
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset form data to original values
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            })
        }
        setError('')
        setSuccess('')
    }

    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
                setIsEditing(false)
                setSuccess('اطلاعات پروفایل با موفقیت به‌روزرسانی شد')
            } else {
                setError(data.message || 'خطا در به‌روزرسانی اطلاعات')
            }
        } catch (err) {
            setError('خطا در اتصال به سرور')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordSubmit = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('رمز عبور جدید و تکرار آن یکسان نیستند')
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError('رمز عبور جدید باید حداقل 6 کاراکتر باشد')
            return
        }

        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/profile/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess('رمز عبور با موفقیت تغییر یافت')
                setShowPasswordModal(false)
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } else {
                setError(data.message || 'خطا در تغییر رمز عبور')
            }
        } catch (err) {
            setError('خطا در اتصال به سرور')
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-800">پروفایل کاربری</h1>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                بازگشت به داشبورد
                            </button>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <FaUser className="h-10 w-10" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{user?.name || 'کاربر'}</h2>
                                    <p className="text-blue-100">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="p-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نام و نام خانوادگی
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="نام و نام خانوادگی خود را وارد کنید"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <FaUser className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-900">{user?.name || 'تعریف نشده'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ایمیل
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="ایمیل خود را وارد کنید"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-900">{user?.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        شماره تلفن
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="شماره تلفن خود را وارد کنید"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <FaPhone className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-900">{user?.phone || 'تعریف نشده'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Join Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تاریخ عضویت
                                    </label>
                                    <div className="text-gray-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : 'نامشخص'}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 space-x-reverse pt-4">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                <FaSave className="h-4 w-4" />
                                                <span>{saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center space-x-2 space-x-reverse bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                                <span>انصراف</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                            <span>ویرایش پروفایل</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">گزینه‌های اضافی</h3>
                        <div className="space-y-3">
                            <button className="w-full text-right bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                مشاهده سفارشات
                            </button>
                            <button className="w-full text-right bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                تنظیمات اعلان‌ها
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full text-right bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between"
                            >
                                <span>تغییر رمز عبور</span>
                                <FaLock className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-right bg-red-100 text-red-700 py-3 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-between"
                            >
                                <span>خروج از حساب کاربری</span>
                                <FaSignOutAlt className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">تغییر رمز عبور</h3>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false)
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    })
                                    setError('')
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رمز عبور فعلی
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                        placeholder="رمز عبور فعلی خود را وارد کنید"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                    >
                                        {showPasswords.current ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رمز عبور جدید
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                        placeholder="رمز عبور جدید خود را وارد کنید"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                    >
                                        {showPasswords.new ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تکرار رمز عبور جدید
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                        placeholder="رمز عبور جدید را تکرار کنید"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                    >
                                        {showPasswords.confirm ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 space-x-reverse mt-6">
                            <button
                                onClick={handlePasswordSubmit}
                                disabled={saving}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false)
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    })
                                    setError('')
                                }}
                                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 