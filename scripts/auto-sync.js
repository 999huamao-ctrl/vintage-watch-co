const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const missingProducts = [
  {
    id: 'prod_009',
    name: 'Rolex Pearlmaster Style',
    nameZh: '劳力士珍珠淑女型风格',
    description: 'Luxury women watch with precious stone setting',
    descriptionZh: '奢华女士腕表，宝石镶嵌',
    price: 199.00,
    originalPrice: 319.00,
    category: 'Pearlmaster',
    image: '/products/image17.jpeg',
    images: ['/products/image17.jpeg', '/products/image18.jpeg'],
    stock: 5,
    isActive: true,
    caseSize: '29mm',
    movement: 'Automatic',
    strap: 'Pearlmaster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_010',
    name: 'Rolex Air-King Style',
    nameZh: '劳力士空中霸王风格',
    description: 'Aviation-inspired watch with bold dial',
    descriptionZh: '航空灵感腕表，醒目表盘',
    price: 159.00,
    originalPrice: 239.00,
    category: 'Air-King',
    image: '/products/image19.jpeg',
    images: ['/products/image19.jpeg', '/products/image20.jpeg'],
    stock: 14,
    isActive: true,
    caseSize: '40mm',
    movement: 'Automatic',
    strap: 'Oyster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_011',
    name: 'Rolex Sea-Dweller Style',
    nameZh: '劳力士海使型风格',
    description: 'Professional diving watch with helium escape valve',
    descriptionZh: '专业潜水腕表，排氦阀门',
    price: 209.00,
    originalPrice: 339.00,
    category: 'Sea-Dweller',
    image: '/products/image21.jpeg',
    images: ['/products/image21.jpeg', '/products/image22.jpeg'],
    stock: 4,
    isActive: true,
    caseSize: '43mm',
    movement: 'Automatic',
    strap: 'Oyster Bracelet',
    waterResistance: '1220m',
  },
  {
    id: 'prod_012',
    name: 'Rolex Milgauss Style',
    nameZh: '劳力士格磁型风格',
    description: 'Anti-magnetic watch with lightning bolt seconds hand',
    descriptionZh: '防磁腕表，闪电形状秒针',
    price: 179.00,
    originalPrice: 279.00,
    category: 'Milgauss',
    image: '/products/image23.jpeg',
    images: ['/products/image23.jpeg', '/products/image24.jpeg'],
    stock: 9,
    isActive: true,
    caseSize: '40mm',
    movement: 'Automatic',
    strap: 'Oyster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_013',
    name: 'Rolex Cellini Style',
    nameZh: '劳力士切利尼风格',
    description: 'Dress watch with leather strap and moonphase',
    descriptionZh: '正装腕表，皮表带，月相显示',
    price: 189.00,
    originalPrice: 299.00,
    category: 'Cellini',
    image: '/products/image25.jpeg',
    images: ['/products/image25.jpeg', '/products/image26.jpeg'],
    stock: 7,
    isActive: true,
    caseSize: '39mm',
    movement: 'Automatic',
    strap: 'Leather',
    waterResistance: '50m',
  },
  {
    id: 'prod_014',
    name: 'Rolex Sky-Dweller Style',
    nameZh: '劳力士纵航者风格',
    description: 'Annual calendar watch with dual time zone',
    descriptionZh: '年历腕表，双时区显示',
    price: 219.00,
    originalPrice: 359.00,
    category: 'Sky-Dweller',
    image: '/products/image27.jpeg',
    images: ['/products/image27.jpeg', '/products/image28.jpeg'],
    stock: 3,
    isActive: true,
    caseSize: '42mm',
    movement: 'Automatic Annual Calendar',
    strap: 'Oyster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_015',
    name: 'TEST PRODUCT - DO NOT BUY',
    nameZh: '测试商品 - 请勿购买',
    description: 'This is a test product for development purposes only. Do not purchase.',
    descriptionZh: '这是仅供开发测试使用的商品。请勿购买。',
    price: 1.00,
    originalPrice: 1.00,
    category: 'Test',
    image: '/products/image1.webp',
    images: ['/products/image1.webp'],
    stock: 999,
    isActive: true,
    caseSize: '40mm',
    movement: 'Quartz',
    strap: 'Test',
    waterResistance: '0m',
  },
];

async function syncProducts() {
  console.log('开始同步 7 个缺失的商品...\n');
  
  for (const product of missingProducts) {
    try {
      await prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product,
      });
      console.log(`✅ ${product.name}`);
    } catch (err) {
      console.error(`❌ ${product.name}:`, err.message);
    }
  }
  
  console.log('\n同步完成！');
  
  // 查询总数
  const count = await prisma.product.count();
  console.log(`数据库中共有 ${count} 个商品`);
}

syncProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
