# فروشگاه قطعات کامپیوتر

یک وبسایت فروشگاهی کامل برای فروش قطعات کامپیوتر با سیستم احراز هویت و مدیریت محصولات.

## ویژگی‌ها

- 🔐 سیستم ثبت نام و ورود کاربران
- 🛒 سبد خرید تعاملی
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
│   │   ├── auth/              # احراز هویت
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── products/          # محصولات
│   ├── dashboard/             # صفحه اصلی فروشگاه
│   ├── login/                 # صفحه ورود
│   ├── register/              # صفحه ثبت نام
│   ├── globals.css            # استایل‌های全局
│   ├── layout.tsx             # لایوت اصلی
│   └── page.tsx               # صفحه اصلی
├── components/                # کامپوننت‌های React
│   ├── Header.tsx
│   └── ProductCard.tsx
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
- سبد خرید تعاملی
- هدر با منوی ناوبری

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