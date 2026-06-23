/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'gzhls.at' },
            { protocol: 'https', hostname: 'cdn.asus.com' },
            { protocol: 'https', hostname: 'cdn.lenovo.com' },
            { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
            { protocol: 'https', hostname: 'dlcdnwebimgs.asus.com' },
            { protocol: 'https', hostname: 'p4-ofp.static.pub' },
            { protocol: 'https', hostname: 'ssl-product-images.www8-hp.com' },
            { protocol: 'https', hostname: 'i.dell.com' },
        ],
    },
    compress: true,
    swcMinify: true,
    reactStrictMode: true,
}

module.exports = nextConfig
