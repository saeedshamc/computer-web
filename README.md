# فروشگاه قطعات کامپیوتر

یک وبسایت فروشگاهی کامل برای فروش قطعات کامپیوتر با سیستم احراز هویت و مدیریت محصولات.

## ویژگی‌ها

- 🔐 سیستم ثبت نام و ورود کاربران
- 🛒 سبد خرید تعاملی **متصل به حساب کاربری** (ذخیره در سرور per-user)
- 🔍 جستجو و فیلتر محصولات
- 📱 طراحی ریسپانسیو
- 🎨 رابط کاربری مدرن با Tailwind CSS
- 🗄️ پایگاه داده MongoDB
- 🔒 احراز هویت JWT

## تکنولوژی‌های استفاده شده

### Frontend
- **Next.js 14** - فریم‌ورک React
- **TypeScript** - زبان برنامه‌نویسی
- **Tailwind CSS** - فریم‌ورک CSS
- **React Icons** - آیکون‌ها

### Backend
- **Next.js API Routes** - API endpoints
- **MongoDB** - پایگاه داده
- **Mongoose** - ODM برای MongoDB
- **bcryptjs** - رمزنگاری پسورد
- **jsonwebtoken** - احراز هویت JWT

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- MongoDB (محلی یا Atlas)

### مراحل نصب

1. **کلون کردن پروژه**
```bash
git clone <repository-url>
cd computer-parts-store
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم متغیرهای محیطی**
فایل `.env.local` را در ریشه پروژه ایجاد کنید:
```env
MONGODB_URI=mongodb://localhost:27017/computer-store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. **راه‌اندازی MongoDB**
اگر از MongoDB محلی استفاده می‌کنید:
```bash
# راه‌اندازی MongoDB
mongod
```

5. **اجرای پروژه**
```bash
npm run dev
```

پروژه در آدرس `http://localhost:3000` قابل دسترسی خواهد بود.

## ساختار پروژه

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # احراز هویت (login, register, logout)
│   │   ├── cart/              # سبد خرید کاربر
│   │   ├── products/          # محصولات
│   │   ├── profile/           # پروفایل کاربر
│   │   └── admin/             # پنل ادمین
│   ├── dashboard/             # صفحه اصلی فروشگاه
│   ├── checkout/              # تکمیل سفارش
│   ├── login/                 # صفحه ورود
│   ├── register/              # صفحه ثبت نام
│   ├── profile/               # پروفایل کاربر
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                # کامپوننت‌های React
│   ├── Header.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── auth.ts                # JWT و احراز هویت درخواست‌ها
│   ├── cartStore.ts           # ذخیره سبد خرید هر کاربر در سرور
│   ├── cartClient.ts          # همگام‌سازی سبد با API (فرانت‌اند)
│   ├── carts.json             # داده سبد خرید کاربران (userId → items)
│   ├── productStore.ts
│   ├── products.json
│   ├── userStore.ts
│   └── users.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## API Endpoints

### احراز هویت
- `POST /api/auth/register` - ثبت نام کاربر جدید
- `POST /api/auth/login` - ورود کاربر

### محصولات
- `GET /api/products` - دریافت لیست محصولات

### سبد خرید
- `GET /api/cart` - دریافت سبد خرید کاربر لاگین‌شده (نیاز به JWT)
- `PUT /api/cart` - ذخیره/به‌روزرسانی سبد خرید کاربر (نیاز به JWT)

**بدنه درخواست `PUT /api/cart`:**
```json
{
  "items": [
    { "productId": "1234567890", "quantity": 2 }
  ]
}
```

**پاسخ:**
```json
{
  "message": "سبد خرید ذخیره شد",
  "cart": [
    {
      "product": { "_id": "...", "name": "...", "price": 8500000, "stock": 15, ... },
      "quantity": 2
    }
  ]
}
```

## سبد خرید متصل به کاربر

قبلاً سبد خرید فقط در `localStorage` مرورگر ذخیره می‌شد و به حساب کاربری وصل نبود. این یعنی با عوض کردن دستگاه یا مرورگر، سبد از بین می‌رفت.

### چه تغییراتی انجام شد

| فایل | توضیح |
|------|--------|
| `lib/cartStore.ts` | مدیریت سبد هر کاربر در سرور (کلید: `userId`) |
| `lib/carts.json` | فایل ذخیره‌سازی سبدها (مشابه `users.json` و `products.json`) |
| `lib/cartClient.ts` | توابع فرانت‌اند برای بارگذاری و همگام‌سازی سبد با API |
| `app/api/cart/route.ts` | API دریافت و ذخیره سبد خرید |
| `app/dashboard/page.tsx` | بارگذاری سبد از سرور + sync بعد از هر تغییر |
| `app/checkout/page.tsx` | بارگذاری سبد از سرور + sync هنگام ویرایش |
| `components/Header.tsx` | پاک کردن سبد `localStorage` هنگام خروج |

### جریان کار

```
کاربر لاگین‌شده → داشبورد / چک‌اوت → /api/cart → cartStore → carts.json
                                              ↓
                                         localStorage (کش موقت)
```

1. **ورود:** کاربر با JWT وارد می‌شود.
2. **بارگذاری:** داشبورد و چک‌اوت سبد را از `GET /api/cart` می‌گیرند.
3. **تغییر سبد:** هر افزودن/حذف/تغییر تعداد → `PUT /api/cart` + به‌روزرسانی `localStorage`.
4. **ادغام:** اگر قبل از sync آیتمی در `localStorage` باشد، با سبد سرور ادغام می‌شود.
5. **خروج:** سبد `localStorage` پاک می‌شود؛ سبد سرور برای همان کاربر باقی می‌ماند.
6. **ورود مجدد:** سبد از سرور بازیابی می‌شود.

### ساختار ذخیره‌سازی در `carts.json`

```json
{
  "1734567890123": [
    { "productId": "1734567890124", "quantity": 1 },
    { "productId": "1734567890125", "quantity": 2 }
  ]
}
```

کلید هر سبد، `_id` کاربر در `users.json` است. هنگام خواندن، اطلاعات کامل محصول از `productStore` بارگذاری می‌شود.

### تست سبد خرید

1. وارد حساب کاربری شوید.
2. چند محصول به سبد اضافه کنید.
3. از حساب خارج شوید و دوباره وارد شوید → سبد باید برگردد.
4. فایل `lib/carts.json` را بررسی کنید → باید `userId` و آیتم‌های سبد را ببینید.

## صفحات

### صفحه ورود (`/login`)
- فرم ورود با ایمیل و رمز عبور
- لینک به صفحه ثبت نام
- اعتبارسنجی فرم

### صفحه ثبت نام (`/register`)
- فرم ثبت نام با فیلدهای کامل
- اعتبارسنجی پسورد
- لینک به صفحه ورود

### داشبورد (`/dashboard`)
- نمایش محصولات در قالب کارت
- جستجو و فیلتر محصولات
- سبد خرید تعاملی (همگام با سرور per-user)
- هدر با منوی ناوبری

### چک‌اوت (`/checkout`)
- نمایش خلاصه سبد خرید (از سرور)
- فرم آدرس، کد پستی و شماره تماس
- ویرایش تعداد و حذف آیتم با sync به سرور
- نیاز به ورود کاربر

## ویژگی‌های امنیتی

- رمزنگاری پسورد با bcrypt
- احراز هویت JWT
- اعتبارسنجی ورودی‌ها
- محافظت از API endpoints

## توسعه

### اضافه کردن محصول جدید
محصولات جدید را در فایل `app/api/products/route.ts` در آرایه `sampleProducts` اضافه کنید.

### تغییر استایل‌ها
از Tailwind CSS برای تغییر استایل‌ها استفاده کنید. فایل `tailwind.config.js` را برای تنظیمات سفارشی ویرایش کنید.

### اضافه کردن ویژگی جدید
1. کامپوننت جدید در پوشه `components/` ایجاد کنید
2. API endpoint جدید در پوشه `app/api/` اضافه کنید
3. صفحه جدید در پوشه `app/` ایجاد کنید

## مشارکت

1. پروژه را fork کنید
2. شاخه جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. به شاخه push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## پشتیبانی

برای سوالات و مشکلات، لطفاً issue جدید ایجاد کنید. 