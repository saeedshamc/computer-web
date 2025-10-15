import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const productsFile = path.join(process.cwd(), 'lib', 'products.json');

function verifyAdmin(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (!auth) return false;
    const token = auth.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // @ts-ignore
        return decoded.role === 'admin';
    } catch {
        return false;
    }
}

function loadProducts() {
    try {
        const data = fs.readFileSync(productsFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveProducts(products: any[]) {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

export async function GET(req: NextRequest) {
    if (!verifyAdmin(req)) {
        return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }
    const products = loadProducts();
    return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
    if (!verifyAdmin(req)) {
        return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }
    const product = await req.json();
    const products = loadProducts();
    product._id = Date.now().toString();
    products.push(product);
    saveProducts(products);
    return NextResponse.json({ message: 'محصول اضافه شد', product });
}

export async function DELETE(req: NextRequest) {
    if (!verifyAdmin(req)) {
        return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }
    const { id } = await req.json();
    let products = loadProducts();
    products = products.filter((p: any) => p._id !== id);
    saveProducts(products);
    return NextResponse.json({ message: 'محصول حذف شد' });
}

export async function PUT(req: NextRequest) {
    if (!verifyAdmin(req)) {
        return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }
    const { _id, name, category, price, description, stock } = await req.json();
    let products = loadProducts();
    const idx = products.findIndex((p: any) => p._id === _id);
    if (idx === -1) {
        return NextResponse.json({ message: 'محصول یافت نشد' }, { status: 404 });
    }
    products[idx] = { ...products[idx], name, category, price, description, stock };
    saveProducts(products);
    return NextResponse.json({ message: 'محصول ویرایش شد', product: products[idx] });
} 