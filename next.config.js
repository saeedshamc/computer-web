/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:
            [
                'images.unsplash.com',
                'res.cloudinary.com',
                'gzhls.at',
                'cdn.asus.com',
                'cdn.lenovo.com',
                'store.storeimages.cdn-apple.com',
                'dlcdnwebimgs.asus.com',
                'p4-ofp.static.pub',
                'ssl-product-images.www8-hp.com',
                'i.dell.com'
                
            ],
    },
    // Enable compression
    compress: true,
    // Optimize bundle size
    swcMinify: true,
    // Enable React strict mode for better development
    reactStrictMode: true,
}

module.exports = nextConfig 