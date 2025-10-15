import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/userStore';
import jwt from 'jsonwebtoken';

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

export async function GET(req: NextRequest) {
    if (!verifyAdmin(req)) {
        return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }
    const users = userStore['users'].map(u => ({ ...u, password: undefined }));
    return NextResponse.json(users);
}

export async function DELETE(req: NextRequest) {
    if (!verifyAdmin(req)) {
        return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }
    const { id } = await req.json();
    // Prevent deleting main admin
    const user = userStore['users'].find(u => u._id === id);
    if (user?.role === 'admin') {
        return NextResponse.json({ message: 'حذف ادمین اصلی مجاز نیست' }, { status: 400 });
    }
    userStore['users'] = userStore['users'].filter(u => u._id !== id);
    userStore['saveUsers']();
    return NextResponse.json({ message: 'کاربر حذف شد' });
} 