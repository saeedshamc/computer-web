'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    role: string;
}

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    stock?: number;
}

// Define product categories (outside component)
const PRODUCT_CATEGORIES = [
    'cpu',
    'gpu',
    'ram',
    'motherboard',
    'storage',
    'case',
    'power-supply',
    'laptop',
];

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // All hooks and derived variables must be inside the component
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [showAddCategoryAdd, setShowAddCategoryAdd] = useState(false);
    const [newCategoryAdd, setNewCategoryAdd] = useState('');
    const [showAddCategoryEdit, setShowAddCategoryEdit] = useState(false);
    const [newCategoryEdit, setNewCategoryEdit] = useState('');
    const allCategories = [...PRODUCT_CATEGORIES, ...customCategories];

    // Product form state
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        stock: ''
    });

    // Filter states
    const [userFilter, setUserFilter] = useState({ search: '', role: 'all' });
    const [productFilter, setProductFilter] = useState({ search: '', category: 'all' });

    // Unique product categories for filter dropdown
    const productCategories = Array.from(new Set(products.map(p => p.category)));

    // Filtered users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.includes(userFilter.search) ||
            user.email.includes(userFilter.search);
        const matchesRole = userFilter.role === 'all' || user.role === userFilter.role;
        return matchesSearch && matchesRole;
    });

    // Filtered products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.includes(productFilter.search);
        const matchesCategory = productFilter.category === 'all' || product.category === productFilter.category;
        return matchesSearch && matchesCategory;
    });

    // Edit product state
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editProductData, setEditProductData] = useState({ name: '', category: '', price: '', description: '', stock: '' });

    useEffect(() => {
        // Check if user is admin
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                router.replace("/login");
                return;
            }
            try {
                const user = JSON.parse(userStr);
                if (user.role !== "admin") {
                    router.replace("/login");
                }
            } catch {
                router.replace("/login");
            }
        }
    }, [router]);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data);
            else setError(data.message || 'خطا در دریافت کاربران');
        } catch {
            setError('خطا در دریافت کاربران');
        } finally {
            setLoading(false);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProducts(data);
            else setError(data.message || 'خطا در دریافت محصولات');
        } catch {
            setError('خطا در دریافت محصولات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        else fetchProducts();
        // eslint-disable-next-line
    }, [activeTab]);

    // Delete user
    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('آیا از حذف کاربر مطمئن هستید؟')) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('کاربر حذف شد');
                fetchUsers();
            } else setError(data.message || 'خطا در حذف کاربر');
        } catch {
            setError('خطا در حذف کاربر');
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('آیا از حذف محصول مطمئن هستید؟')) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('محصول حذف شد');
                fetchProducts();
            } else setError(data.message || 'خطا در حذف محصول');
        } catch {
            setError('خطا در حذف محصول');
        } finally {
            setLoading(false);
        }
    };

    // Add product
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: newProduct.name,
                    category: newProduct.category,
                    price: Number(newProduct.price),
                    description: newProduct.description,
                    stock: Number(newProduct.stock)
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('محصول اضافه شد');
                setNewProduct({ name: '', category: '', price: '', description: '', stock: '' });
                fetchProducts();
            } else setError(data.message || 'خطا در افزودن محصول');
        } catch {
            setError('خطا در افزودن محصول');
        } finally {
            setLoading(false);
        }
    };

    // Open edit form
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setEditProductData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            description: product.description,
            stock: (product.stock ?? 0).toString()
        });
    };

    // Save edit
    const handleSaveEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    _id: editingProduct._id,
                    name: editProductData.name,
                    category: editProductData.category,
                    price: Number(editProductData.price),
                    description: editProductData.description,
                    stock: Number(editProductData.stock)
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('محصول ویرایش شد');
                setEditingProduct(null);
                fetchProducts();
            } else setError(data.message || 'خطا در ویرایش محصول');
        } catch {
            setError('خطا در ویرایش محصول');
        } finally {
            setLoading(false);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6 mt-8">
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">پنل مدیریت فروشگاه</h1>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded-lg font-bold border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        مدیریت کاربران
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-bold border-b-2 transition-colors ${activeTab === 'products' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
                        onClick={() => setActiveTab('products')}
                    >
                        مدیریت محصولات
                    </button>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
                {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}
                {loading && <div className="text-center text-gray-500 mb-4">در حال بارگذاری...</div>}
                {/* Users Table */}
                {activeTab === 'users' && (
                    <>
                        <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
                            <input
                                type="text"
                                placeholder="جستجو بر اساس نام یا ایمیل"
                                className="input-field w-full md:w-64 text-black placeholder-gray-400"
                                value={userFilter.search}
                                onChange={e => setUserFilter(f => ({ ...f, search: e.target.value }))}
                            />
                            <select
                                className="input-field w-full md:w-40 text-black"
                                value={userFilter.role}
                                onChange={e => setUserFilter(f => ({ ...f, role: e.target.value }))}
                            >
                                <option value="all" className="text-black">همه نقش‌ها</option>
                                <option value="admin" className="text-black">ادمین</option>
                                <option value="user" className="text-black">کاربر</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg text-black">
                                <thead>
                                    <tr className="bg-gray-100 text-black">
                                        <th className="py-2 px-4 border-b">نام</th>
                                        <th className="py-2 px-4 border-b">ایمیل</th>
                                        <th className="py-2 px-4 border-b">نقش</th>
                                        <th className="py-2 px-4 border-b">شماره تماس</th>
                                        <th className="py-2 px-4 border-b">تاریخ عضویت</th>
                                        <th className="py-2 px-4 border-b">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="text-center text-black">
                                            <td className="py-2 px-4 border-b">{user.name}</td>
                                            <td className="py-2 px-4 border-b">{user.email}</td>
                                            <td className="py-2 px-4 border-b">{user.role === 'admin' ? 'ادمین' : 'کاربر'}</td>
                                            <td className="py-2 px-4 border-b">{user.phone}</td>
                                            <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString('fa-IR')}</td>
                                            <td className="py-2 px-4 border-b">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        className="text-red-600 hover:underline"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        حذف
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {/* Products Table & Add Form */}
                {activeTab === 'products' && (
                    <>
                        <form className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={handleAddProduct}>
                            <input
                                type="text"
                                placeholder="نام محصول"
                                className="input-field text-black placeholder-gray-400"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                                disabled={!!editingProduct}
                            />
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-black">دسته‌بندی</label>
                                <select
                                    className="input-field text-black"
                                    value={newProduct.category}
                                    onChange={e => {
                                        if (e.target.value === '__add_new__') {
                                            setShowAddCategoryAdd(true);
                                        } else {
                                            setNewProduct({ ...newProduct, category: e.target.value });
                                            setShowAddCategoryAdd(false);
                                        }
                                    }}
                                    required
                                    disabled={!!editingProduct}
                                >
                                    <option value="" disabled>انتخاب دسته‌بندی</option>
                                    {allCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="__add_new__">افزودن دسته‌بندی جدید...</option>
                                </select>
                                {showAddCategoryAdd && (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            className="input-field text-black placeholder-gray-400 flex-1"
                                            placeholder="نام دسته‌بندی جدید"
                                            value={newCategoryAdd}
                                            onChange={e => setNewCategoryAdd(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-700"
                                            onClick={() => {
                                                if (newCategoryAdd && !allCategories.includes(newCategoryAdd)) {
                                                    setCustomCategories([...customCategories, newCategoryAdd]);
                                                    setNewProduct({ ...newProduct, category: newCategoryAdd });
                                                    setShowAddCategoryAdd(false);
                                                    setNewCategoryAdd('');
                                                }
                                            }}
                                        >
                                            افزودن
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-gray-300 text-gray-800 rounded-lg px-3 py-1 hover:bg-gray-400"
                                            onClick={() => {
                                                setShowAddCategoryAdd(false);
                                                setNewCategoryAdd('');
                                            }}
                                        >
                                            انصراف
                                        </button>
                                    </div>
                                )}
                            </div>
                            <input
                                type="number"
                                placeholder="قیمت"
                                className="input-field text-black placeholder-gray-400"
                                value={newProduct.price}
                                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                required
                                min={0}
                                disabled={!!editingProduct}
                            />
                            <input
                                type="number"
                                placeholder="موجودی"
                                className="input-field text-black placeholder-gray-400"
                                value={newProduct.stock}
                                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                required
                                min={0}
                                disabled={!!editingProduct}
                            />
                            <input
                                type="text"
                                placeholder="توضیح کوتاه"
                                className="input-field text-black placeholder-gray-400"
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                                disabled={!!editingProduct}
                            />
                            <button
                                type="submit"
                                className="col-span-1 md:col-span-5 bg-primary text-white rounded-lg py-2 px-4 mt-2 hover:bg-blue-700"
                                disabled={loading || !!editingProduct}
                            >
                                افزودن محصول
                            </button>
                        </form>
                        {/* Edit Product Form (inline) */}
                        {editingProduct && (
                            <form className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 bg-yellow-50 p-4 rounded-lg" onSubmit={handleSaveEditProduct}>
                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm font-medium text-black">نام محصول</label>
                                    <input
                                        type="text"
                                        placeholder="نام محصول"
                                        className="input-field text-black placeholder-gray-400"
                                        value={editProductData.name}
                                        onChange={e => setEditProductData(d => ({ ...d, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm font-medium text-black">دسته‌بندی</label>
                                    <select
                                        className="input-field text-black"
                                        value={editProductData.category}
                                        onChange={e => {
                                            if (e.target.value === '__add_new__') {
                                                setShowAddCategoryEdit(true);
                                            } else {
                                                setEditProductData(d => ({ ...d, category: e.target.value }));
                                                setShowAddCategoryEdit(false);
                                            }
                                        }}
                                        required
                                    >
                                        <option value="" disabled>انتخاب دسته‌بندی</option>
                                        {allCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__add_new__">افزودن دسته‌بندی جدید...</option>
                                    </select>
                                    {showAddCategoryEdit && (
                                        <div className="flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                className="input-field text-black placeholder-gray-400 flex-1"
                                                placeholder="نام دسته‌بندی جدید"
                                                value={newCategoryEdit}
                                                onChange={e => setNewCategoryEdit(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-700"
                                                onClick={() => {
                                                    if (newCategoryEdit && !allCategories.includes(newCategoryEdit)) {
                                                        setCustomCategories([...customCategories, newCategoryEdit]);
                                                        setEditProductData(d => ({ ...d, category: newCategoryEdit }));
                                                        setShowAddCategoryEdit(false);
                                                        setNewCategoryEdit('');
                                                    }
                                                }}
                                            >
                                                افزودن
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-gray-300 text-gray-800 rounded-lg px-3 py-1 hover:bg-gray-400"
                                                onClick={() => {
                                                    setShowAddCategoryEdit(false);
                                                    setNewCategoryEdit('');
                                                }}
                                            >
                                                انصراف
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm font-medium text-black">قیمت</label>
                                    <input
                                        type="number"
                                        placeholder="قیمت"
                                        className="input-field text-black placeholder-gray-400"
                                        value={editProductData.price}
                                        onChange={e => setEditProductData(d => ({ ...d, price: e.target.value }))}
                                        required
                                        min={0}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm font-medium text-black">موجودی</label>
                                    <input
                                        type="number"
                                        placeholder="موجودی"
                                        className="input-field text-black placeholder-gray-400"
                                        value={editProductData.stock}
                                        onChange={e => setEditProductData(d => ({ ...d, stock: e.target.value }))}
                                        required
                                        min={0}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm font-medium text-black">توضیح کوتاه</label>
                                    <input
                                        type="text"
                                        placeholder="توضیح کوتاه"
                                        className="input-field text-black placeholder-gray-400"
                                        value={editProductData.description}
                                        onChange={e => setEditProductData(d => ({ ...d, description: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-5 flex gap-2 mt-2">
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        ذخیره تغییرات
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-400"
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                    >
                                        انصراف
                                    </button>
                                </div>
                            </form>
                        )}
                        {/* Product Filters */}
                        <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
                            <input
                                type="text"
                                placeholder="جستجو بر اساس نام محصول"
                                className="input-field w-full md:w-64 text-black placeholder-gray-400"
                                value={productFilter.search}
                                onChange={e => setProductFilter(f => ({ ...f, search: e.target.value }))}
                                disabled={!!editingProduct}
                            />
                            <select
                                className="input-field w-full md:w-40 text-black"
                                value={productFilter.category}
                                onChange={e => setProductFilter(f => ({ ...f, category: e.target.value }))}
                                disabled={!!editingProduct}
                            >
                                <option value="all" className="text-black">همه دسته‌ها</option>
                                {productCategories.map(cat => (
                                    <option key={cat} value={cat} className="text-black">{cat}</option>
                                ))}
                            </select>
                        </div>
                        {/* Product Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg text-black">
                                <thead>
                                    <tr className="bg-gray-100 text-black">
                                        <th className="py-2 px-4 border-b">نام</th>
                                        <th className="py-2 px-4 border-b">دسته‌بندی</th>
                                        <th className="py-2 px-4 border-b">قیمت</th>
                                        <th className="py-2 px-4 border-b">موجودی</th>
                                        <th className="py-2 px-4 border-b">توضیح</th>
                                        <th className="py-2 px-4 border-b">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="text-center text-black">
                                            <td className="py-2 px-4 border-b">{product.name}</td>
                                            <td className="py-2 px-4 border-b">{product.category}</td>
                                            <td className="py-2 px-4 border-b">{product.price.toLocaleString('fa-IR')}</td>
                                            <td className="py-2 px-4 border-b">{product.stock ?? 0}</td>
                                            <td className="py-2 px-4 border-b">{product.description}</td>
                                            <td className="py-2 px-4 border-b flex gap-2 justify-center">
                                                <button
                                                    className="text-blue-600 hover:underline"
                                                    onClick={() => handleEditProduct(product)}
                                                    disabled={!!editingProduct}
                                                >
                                                    ویرایش
                                                </button>
                                                <button
                                                    className="text-red-600 hover:underline"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    disabled={!!editingProduct}
                                                >
                                                    حذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
