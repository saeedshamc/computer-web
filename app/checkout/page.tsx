'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { loadUserCart, saveUserCart, CartItem } from '@/lib/cartClient';

export default function Checkout() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [postalError, setPostalError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
            return;
        }

        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.phone) setPhone(user.phone);
            } catch { }
        }

        loadUserCart().then(setCart);
    }, [router]);

    const syncCart = (updatedCart: CartItem[]) => {
        setCart(updatedCart);
        saveUserCart(updatedCart);
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        const updatedCart = cart.map(item =>
            item.product._id === productId ? { ...item, quantity } : item
        );
        syncCart(updatedCart);
    };

    const removeFromCart = (productId: string) => {
        syncCart(cart.filter(item => item.product._id !== productId));
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;
        setMessage('');
        setPostalError('');
        setPhoneError('');
        if (!address.trim()) {
            setMessage('آدرس محل سکونت نباید خالی باشد');
            valid = false;
        }
        if (!postalCode.trim() || postalCode.length !== 10 || !/^\d{10}$/.test(postalCode)) {
            setPostalError('کد پستی باید ۱۰ رقم و فقط عدد باشد');
            valid = false;
        }
        if (!phone.trim() || phone.length !== 11 || !/^\d{11}$/.test(phone)) {
            setPhoneError('شماره تماس باید ۱۱ رقم و فقط عدد باشد');
            valid = false;
        }
        if (!valid) return;
        setMessage('در آینده اضافه می‌شود');
    };

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setPostalCode(value);
            if (value.length > 0 && value.length < 10) {
                setPostalError('کد پستی وارد شده را درست وارد کنید');
            } else {
                setPostalError('');
            }
        } else if (value.length > 10) {
            setPostalError('کد پستی را درست وارد کنید');
        } else {
            setPostalError('کد پستی را درست وارد کنید');
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 11) {
            setPhone(value);
            if (value.length > 0 && value.length < 11) {
                setPhoneError('شماره تماس باید ۱۱ رقم باشد');
            } else {
                setPhoneError('');
            }
        } else if (value.length > 11) {
            setPhoneError('شماره تماس باید ۱۱ رقم باشد');
        } else {
            setPhoneError('شماره تماس باید ۱۱ رقم باشد');
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-2 sm:px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 sm:p-8 space-y-6 sm:space-y-8">
                {/* Back to Dashboard Link */}
                <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="mb-4 sm:mb-6 text-primary hover:text-blue-700 font-medium text-sm transition-colors"
                >
                    ← بازگشت به صفحه محصولات
                </button>
                {/* Cart Summary */}
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">سبد خرید شما</h2>
                {cart.length === 0 ? (
                    <div className="text-gray-500 text-center">سبد خرید شما خالی است.</div>
                ) : (
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        {cart.map((item) => (
                            <div key={item.product._id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-2 gap-2 sm:gap-0">
                                <div className="flex items-center gap-2">
                                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                                    <div>
                                        <div className="font-semibold text-gray-800 text-sm sm:text-base">{item.product.name}</div>
                                        <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                                            <button type="button" aria-label="کاهش تعداد" className="p-1 text-primary hover:text-blue-700" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}><FaMinus /></button>
                                            <span>{item.quantity}</span>
                                            <button type="button" aria-label="افزایش تعداد" className="p-1 text-primary hover:text-blue-700" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}><FaPlus /></button>
                                            <button type="button" aria-label="حذف از سبد" className="p-1 text-red-600 hover:text-red-800" onClick={() => removeFromCart(item.product._id)}><FaTrash /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="font-bold text-gray-800 text-sm sm:text-base">{(item.product.price * item.quantity).toLocaleString()} تومان</div>
                            </div>
                        ))}
                        <div className="flex flex-col sm:flex-row justify-between items-center pt-3 sm:pt-4 gap-2 sm:gap-0">
                            <span className="font-semibold text-base sm:text-lg">مبلغ کل:</span>
                            <span className="font-bold text-lg sm:text-xl text-primary">{getTotalPrice().toLocaleString()} تومان</span>
                        </div>
                    </div>
                )}
                {/* Checkout Form */}
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">تکمیل اطلاعات سفارش</h2>
                <form className="space-y-3 sm:space-y-4" onSubmit={handlePayment} autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-black mb-2 flex flex-row-reverse items-center justify-end">
                            آدرس محل سکونت
                            <span className="text-red-600 ml-1">*</span>
                        </label>
                        <textarea
                            className="input-field text-black border border-primary focus:ring-2 focus:ring-primary"
                            required
                            rows={3}
                            placeholder="آدرس دقیق محل سکونت را وارد کنید"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-2 flex flex-row-reverse items-center justify-end">
                            کد پستی
                            <span className="text-red-600 ml-1">*</span>
                        </label>
                        <input
                            className="input-field text-black border border-primary focus:ring-2 focus:ring-primary"
                            required
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="کد پستی را وارد کنید"
                            value={postalCode}
                            onChange={handlePostalCodeChange}
                            maxLength={10}
                        />
                        {postalError && (
                            <div className="text-red-600 text-sm mt-1">{postalError}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-2 flex flex-row-reverse items-center justify-end">
                            شماره تماس
                            <span className="text-red-600 ml-1">*</span>
                        </label>
                        <input
                            className="input-field text-black border border-primary focus:ring-2 focus:ring-primary"
                            required
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="شماره تماس را وارد کنید"
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={11}
                        />
                        {phoneError && (
                            <div className="text-red-600 text-sm mt-1">{phoneError}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold mt-4"
                    >
                        پرداخت
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-center text-red-600 font-semibold">{message}</div>
                )}
            </div>
        </div>
    );
}

