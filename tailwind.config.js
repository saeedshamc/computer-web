/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                accent: '#f59e0b',
                background: '#f8fafc',
                surface: '#ffffff',
                success: '#10b981',
                danger: '#f43f5e',
                info: '#0ea5e9',
                neutral: '#94a3b8',
            },
        },
    },
    plugins: [],
} 