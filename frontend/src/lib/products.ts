import { prisma } from './db';

// 本地商品数据备份（数据库不可用时使用）
export const localProducts = [
  {
    id: 'prod_001',
    slug: 'rolex-submariner',
    baseName: 'Rolex Submariner Style',
    baseDesc: 'Classic diving watch with automatic movement and water resistance',
    price: 189.00,
    comparePrice: 299.00,
    sku: 'ROL-SUB-001',
    stock: 15,
    images: ['/products/image1.webp', '/products/image2.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '40mm', movement: 'Automatic', waterResistance: '300m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'prod_002',
    slug: 'rolex-datejust',
    baseName: 'Rolex Datejust Style',
    baseDesc: 'Elegant dress watch with date function and fluted bezel',
    price: 169.00,
    comparePrice: 259.00,
    sku: 'ROL-DAT-001',
    stock: 12,
    images: ['/products/image3.jpeg', '/products/image4.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '36mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel', strap: 'Jubilee Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'prod_003',
    slug: 'rolex-daytona',
    baseName: 'Rolex Daytona Style',
    baseDesc: 'Chronograph sports watch with tachymeter bezel',
    price: 199.00,
    comparePrice: 329.00,
    sku: 'ROL-DAY-001',
    stock: 8,
    images: ['/products/image5.jpeg', '/products/image6.webp'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '40mm', movement: 'Automatic Chronograph', waterResistance: '100m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'prod_004',
    slug: 'rolex-gmt-master',
    baseName: 'Rolex GMT-Master Style',
    baseDesc: 'Dual time zone watch with rotating 24-hour bezel',
    price: 179.00,
    comparePrice: 289.00,
    sku: 'ROL-GMT-001',
    stock: 10,
    images: ['/products/image7.jpeg', '/products/image8.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '40mm', movement: 'Automatic GMT', waterResistance: '100m', material: 'Stainless Steel', strap: 'Jubilee Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_005',
    slug: 'rolex-explorer',
    baseName: 'Rolex Explorer Style',
    baseDesc: 'Adventure watch with luminous markers and rugged design',
    price: 159.00,
    comparePrice: 249.00,
    sku: 'ROL-EXP-001',
    stock: 20,
    images: ['/products/image9.jpeg', '/products/image10.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '39mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_006',
    slug: 'rolex-yacht-master',
    baseName: 'Rolex Yacht-Master Style',
    baseDesc: 'Nautical watch with rotatable bezel and regatta countdown',
    price: 189.00,
    comparePrice: 299.00,
    sku: 'ROL-YAC-001',
    stock: 6,
    images: ['/products/image11.jpeg', '/products/image12.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '40mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel', strap: 'Oysterflex' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_007',
    slug: 'rolex-oyster-perpetual',
    baseName: 'Rolex Oyster Perpetual Style',
    baseDesc: 'Classic time-only watch with clean dial design',
    price: 149.00,
    comparePrice: 229.00,
    sku: 'ROL-OP-001',
    stock: 25,
    images: ['/products/image13.jpeg', '/products/image14.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '36mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_008',
    slug: 'rolex-lady-datejust',
    baseName: 'Rolex Lady-Datejust Style',
    baseDesc: 'Elegant women watch with diamond markers',
    price: 169.00,
    comparePrice: 269.00,
    sku: 'ROL-LDY-001',
    stock: 18,
    images: ['/products/image15.jpeg', '/products/image16.jpeg'],
    category: { name: 'Women', slug: 'women' },
    specifications: { dialSize: '28mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel & Gold', strap: 'Jubilee Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'prod_009',
    slug: 'rolex-pearlmaster',
    baseName: 'Rolex Pearlmaster Style',
    baseDesc: 'Luxury women watch with precious stone setting',
    price: 199.00,
    comparePrice: 319.00,
    sku: 'ROL-PM-001',
    stock: 5,
    images: ['/products/image17.jpeg', '/products/image18.jpeg'],
    category: { name: 'Women', slug: 'women' },
    specifications: { dialSize: '29mm', movement: 'Automatic', waterResistance: '100m', material: '18K Gold', strap: 'Pearlmaster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'prod_010',
    slug: 'rolex-air-king',
    baseName: 'Rolex Air-King Style',
    baseDesc: 'Aviation-inspired watch with bold dial',
    price: 159.00,
    comparePrice: 239.00,
    sku: 'ROL-AK-001',
    stock: 14,
    images: ['/products/image19.jpeg', '/products/image20.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '40mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_011',
    slug: 'rolex-sea-dweller',
    baseName: 'Rolex Sea-Dweller Style',
    baseDesc: 'Professional diving watch with helium escape valve',
    price: 209.00,
    comparePrice: 339.00,
    sku: 'ROL-SD-001',
    stock: 4,
    images: ['/products/image21.jpeg', '/products/image22.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '43mm', movement: 'Automatic', waterResistance: '1220m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_012',
    slug: 'rolex-milgauss',
    baseName: 'Rolex Milgauss Style',
    baseDesc: 'Anti-magnetic watch with lightning bolt seconds hand',
    price: 179.00,
    comparePrice: 279.00,
    sku: 'ROL-MG-001',
    stock: 9,
    images: ['/products/image23.jpeg', '/products/image24.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '40mm', movement: 'Automatic', waterResistance: '100m', material: 'Stainless Steel', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_013',
    slug: 'rolex-cellini',
    baseName: 'Rolex Cellini Style',
    baseDesc: 'Dress watch with leather strap and moonphase',
    price: 189.00,
    comparePrice: 299.00,
    sku: 'ROL-CEL-001',
    stock: 7,
    images: ['/products/image25.jpeg', '/products/image26.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '39mm', movement: 'Automatic', waterResistance: '50m', material: '18K Gold', strap: 'Leather' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'prod_014',
    slug: 'rolex-sky-dweller',
    baseName: 'Rolex Sky-Dweller Style',
    baseDesc: 'Annual calendar watch with dual time zone',
    price: 219.00,
    comparePrice: 359.00,
    sku: 'ROL-SD-002',
    stock: 3,
    images: ['/products/image27.jpeg', '/products/image28.jpeg'],
    category: { name: 'Men', slug: 'men' },
    specifications: { dialSize: '42mm', movement: 'Automatic Annual Calendar', waterResistance: '100m', material: 'Stainless Steel & Gold', strap: 'Oyster Bracelet' },
    translations: [],
    isActive: true,
    isFeatured: false,
  },
];

// 获取所有商品（优先数据库，失败时用本地数据）
export async function getProductsWithFallback(options?: {
  category?: string;
  language?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}) {
  try {
    // 尝试从数据库获取
    const dbProducts = await prisma.product.findMany({
      where: {
        ...(options?.category && { category: { slug: options.category } }),
        ...(options?.isActive !== undefined && { isActive: options.isActive }),
        ...(options?.isFeatured && { isFeatured: true }),
      },
      include: {
        category: true,
        translations: options?.language ? { where: { language: options.language } } : true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    if (dbProducts.length > 0) {
      return dbProducts.map(p => ({
        ...p,
        name: p.translations?.[0]?.name || p.baseName,
        description: p.translations?.[0]?.description || p.baseDesc,
      }));
    }
  } catch (error) {
    console.log('Database fetch failed, using local data:', error);
  }
  
  // 返回本地数据
  let products = localProducts;
  
  if (options?.category) {
    products = products.filter(p => p.category.slug === options.category);
  }
  if (options?.isFeatured) {
    products = products.filter(p => p.isFeatured);
  }
  
  return products.map(p => ({
    ...p,
    name: p.baseName,
    description: p.baseDesc,
  }));
}

// 获取单个商品
export async function getProductBySlugWithFallback(slug: string, language?: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        translations: language ? { where: { language } } : true,
      },
    });
    
    if (product) {
      return {
        ...product,
        name: product.translations?.[0]?.name || product.baseName,
        description: product.translations?.[0]?.description || product.baseDesc,
      };
    }
  } catch (error) {
    console.log('Database fetch failed, using local data:', error);
  }
  
  const localProduct = localProducts.find(p => p.slug === slug);
  if (localProduct) {
    return {
      ...localProduct,
      name: localProduct.baseName,
      description: localProduct.baseDesc,
    };
  }
  
  return null;
}
