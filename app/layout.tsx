import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'فروشگاه قطعات کامپیوتر',
    description: 'بهترین قطعات کامپیوتر با قیمت مناسب',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fa" dir="rtl">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    )
} 