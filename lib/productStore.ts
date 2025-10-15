import fs from 'fs'
import path from 'path'

interface Product {
    _id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    stock: number
    createdAt: string
}

const productsFile = path.join(process.cwd(), 'lib', 'products.json')

// Sample products data
const sampleProducts = [
    {
        name: 'Intel Core i7-12700K',
        description: 'پردازنده Intel Core i7 نسل 12 با 12 هسته و 20 رشته، مناسب برای گیمینگ و کارهای حرفه‌ای',
        price: 8500000,
        image: 'https://gzhls.at/i/35/20/2613520-n4.jpg',
        category: 'cpu',
        stock: 15
    },
    {
        name: 'AMD Ryzen 7 5800X',
        description: 'پردازنده AMD Ryzen 7 با 8 هسته و 16 رشته، عملکرد عالی در گیمینگ و رندر',
        price: 7200000,
        image: 'https://gzhls.at/i/35/20/2613520-n4.jpg',
        category: 'cpu',
        stock: 8
    },
    {
        name: 'NVIDIA RTX 4080',
        description: 'کارت گرافیک قدرتمند NVIDIA با 16GB VRAM، مناسب برای گیمینگ 4K و رندر',
        price: 45000000,
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
        category: 'gpu',
        stock: 5
    },
    {
        name: 'AMD RX 6800 XT',
        description: 'کارت گرافیک AMD با 16GB VRAM، عملکرد عالی در گیمینگ و کارهای گرافیکی',
        price: 28000000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'gpu',
        stock: 12
    },
    {
        name: 'Corsair Vengeance 32GB DDR4',
        description: 'رم Corsair با سرعت 3200MHz، مناسب برای گیمینگ و کارهای چند وظیفه‌ای',
        price: 3200000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'ram',
        stock: 25
    },
    {
        name: 'G.Skill Trident Z 16GB DDR4',
        description: 'رم G.Skill با طراحی زیبا و عملکرد بالا، مناسب برای اورکلاک',
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'ram',
        stock: 18
    },
    {
        name: 'ASUS ROG Strix Z690-E',
        description: 'مادربورد ASUS ROG با پشتیبانی از DDR5 و PCIe 5.0، مناسب برای پردازنده‌های نسل 12',
        price: 12000000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'motherboard',
        stock: 7
    },
    {
        name: 'MSI MPG B550 Gaming Edge',
        description: 'مادربورد MSI با طراحی گیمینگ و پشتیبانی از AMD Ryzen، مناسب برای گیمینگ',
        price: 6500000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'motherboard',
        stock: 14
    },
    {
        name: 'Samsung 970 EVO Plus 1TB',
        description: 'SSD Samsung با سرعت خواندن/نوشتن بالا، مناسب برای سیستم عامل و بازی‌ها',
        price: 4200000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'storage',
        stock: 22
    },
    {
        name: 'WD Black SN850 2TB',
        description: 'SSD Western Digital با سرعت PCIe 4.0، مناسب برای کارهای حرفه‌ای',
        price: 8500000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'storage',
        stock: 9
    },
    {
        name: 'Corsair RM850x',
        description: 'منبع تغذیه Corsair با گواهی 80+ Gold، مناسب برای سیستم‌های قدرتمند',
        price: 5800000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'power-supply',
        stock: 11
    },
    {
        name: 'Seasonic Focus GX-750',
        description: 'منبع تغذیه Seasonic با کیفیت بالا و گواهی 80+ Gold، مناسب برای گیمینگ',
        price: 4200000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'power-supply',
        stock: 16
    },
    {
        name: 'NZXT H510 Elite',
        description: 'کیس NZXT با طراحی مدرن و شیشه تمپرد، مناسب برای نمایش قطعات داخلی',
        price: 3800000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'case',
        stock: 13
    },
    {
        name: 'Lian Li O11 Dynamic',
        description: 'کیس Lian Li با طراحی منحصر به فرد و فضای داخلی زیاد، مناسب برای سیستم‌های حرفه‌ای',
        price: 5200000,
        image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop',
        category: 'case',
        stock: 6
    }
]

// Ensure products file exists
if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, '[]')
}

export class ProductStore {
    private products: Product[] = []

    constructor() {
        this.loadProducts()
        this.initializeSampleData()
    }

    private loadProducts() {
        try {
            const data = fs.readFileSync(productsFile, 'utf8')
            this.products = JSON.parse(data)
        } catch (error) {
            console.error('Error loading products:', error)
            this.products = []
        }
    }

    private saveProducts() {
        try {
            fs.writeFileSync(productsFile, JSON.stringify(this.products, null, 2))
        } catch (error) {
            console.error('Error saving products:', error)
        }
    }

    private initializeSampleData() {
        if (this.products.length === 0) {
            console.log('Initializing sample products...')
            this.products = sampleProducts.map((product, index) => ({
                _id: (Date.now() + index).toString(),
                ...product,
                createdAt: new Date().toISOString()
            }))
            this.saveProducts()
        }
    }

    async getAllProducts(): Promise<Product[]> {
        return this.products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    async getProductById(id: string): Promise<Product | null> {
        return this.products.find(p => p._id === id) || null
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        return this.products.filter(p => p.category === category)
    }

    async searchProducts(query: string): Promise<Product[]> {
        const lowerQuery = query.toLowerCase()
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        )
    }
}

export const productStore = new ProductStore() 