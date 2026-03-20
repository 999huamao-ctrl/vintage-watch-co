const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  { id: 'prod_001', name: 'Rolex Submariner Style', nameZh: '劳力士潜航者风格', price: 189, originalPrice: 299, brand: 'Rolex', category: 'Submariner', image: '/products/image1.webp', detailImage1: '/products/image2.jpeg', stock: 15, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Black', movement: 'Automatic', powerReserve: '72 hours', functions: 'Date' },
  { id: 'prod_002', name: 'Rolex Datejust Style', nameZh: '劳力士日志型风格', price: 169, originalPrice: 259, brand: 'Rolex', category: 'Datejust', image: '/products/image3.jpeg', detailImage1: '/products/image4.jpeg', stock: 12, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Blue', movement: 'Automatic', powerReserve: '70 hours', functions: 'Date' },
  { id: 'prod_003', name: 'Rolex Daytona Style', nameZh: '劳力士迪通拿风格', price: 199, originalPrice: 329, brand: 'Rolex', category: 'Daytona', image: '/products/image5.jpeg', detailImage1: '/products/image6.webp', stock: 8, isActive: true, caseMaterial: 'Stainless Steel', dial: 'White', movement: 'Automatic Chronograph', powerReserve: '72 hours', functions: 'Chronograph, Tachymeter' },
  { id: 'prod_004', name: 'Rolex GMT-Master Style', nameZh: '劳力士格林尼治风格', price: 179, originalPrice: 289, brand: 'Rolex', category: 'GMT-Master', image: '/products/image7.jpeg', detailImage1: '/products/image8.jpeg', stock: 10, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Black', movement: 'Automatic GMT', powerReserve: '70 hours', functions: 'GMT, Date' },
  { id: 'prod_005', name: 'Rolex Explorer Style', nameZh: '劳力士探险家风格', price: 159, originalPrice: 249, brand: 'Rolex', category: 'Explorer', image: '/products/image9.jpeg', detailImage1: '/products/image10.jpeg', stock: 20, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Black', movement: 'Automatic', powerReserve: '72 hours', functions: 'Hour, Minute, Second' },
  { id: 'prod_006', name: 'Rolex Yacht-Master Style', nameZh: '劳力士游艇名仕风格', price: 189, originalPrice: 299, brand: 'Rolex', category: 'Yacht-Master', image: '/products/image11.jpeg', detailImage1: '/products/image12.jpeg', stock: 10, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Blue', movement: 'Automatic', powerReserve: '70 hours', functions: 'Date' },
  { id: 'prod_007', name: 'Rolex Day-Date Style', nameZh: '劳力士星期日历风格', price: 209, originalPrice: 349, brand: 'Rolex', category: 'Day-Date', image: '/products/image13.jpeg', detailImage1: '/products/image14.jpeg', stock: 6, isActive: true, caseMaterial: 'Gold Plated', dial: 'Champagne', movement: 'Automatic', powerReserve: '72 hours', functions: 'Day, Date' },
  { id: 'prod_008', name: 'Rolex Milgauss Style', nameZh: '劳力士格磁型风格', price: 175, originalPrice: 279, brand: 'Rolex', category: 'Milgauss', image: '/products/image15.jpeg', detailImage1: '/products/image16.jpeg', stock: 14, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Black', movement: 'Automatic', powerReserve: '72 hours', functions: 'Hour, Minute, Second' },
  { id: 'prod_009', name: 'Rolex Air-King Style', nameZh: '劳力士空中霸王风格', price: 149, originalPrice: 229, brand: 'Rolex', category: 'Air-King', image: '/products/image17.jpeg', detailImage1: '/products/image18.jpeg', stock: 18, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Black', movement: 'Automatic', powerReserve: '72 hours', functions: 'Hour, Minute, Second' },
  { id: 'prod_010', name: 'Rolex Sea-Dweller Style', nameZh: '劳力士海使型风格', price: 219, originalPrice: 359, brand: 'Rolex', category: 'Sea-Dweller', image: '/products/image19.jpeg', detailImage1: '/products/image20.jpeg', stock: 7, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Black', movement: 'Automatic', powerReserve: '70 hours', functions: 'Date' },
  { id: 'prod_011', name: 'Rolex Sky-Dweller Style', nameZh: '劳力士纵航者风格', price: 249, originalPrice: 399, brand: 'Rolex', category: 'Sky-Dweller', image: '/products/image21.jpeg', detailImage1: '/products/image22.jpeg', stock: 5, isActive: true, caseMaterial: 'Gold Plated', dial: 'Champagne', movement: 'Automatic Annual Calendar', powerReserve: '72 hours', functions: 'Annual Calendar, GMT' },
  { id: 'prod_012', name: 'Rolex Cellini Style', nameZh: '劳力士切利尼风格', price: 199, originalPrice: 319, brand: 'Rolex', category: 'Cellini', image: '/products/image23.jpeg', detailImage1: '/products/image24.jpeg', stock: 9, isActive: true, caseMaterial: 'Gold Plated', dial: 'White', movement: 'Manual', powerReserve: '48 hours', functions: 'Hour, Minute' },
  { id: 'prod_013', name: 'Rolex Lady-Datejust Style', nameZh: '劳力士女装日志型风格', price: 159, originalPrice: 249, brand: 'Rolex', category: 'Lady-Datejust', image: '/products/image25.jpeg', detailImage1: '/products/image26.jpeg', stock: 22, isActive: true, caseMaterial: 'Stainless Steel', dial: 'Pink', movement: 'Automatic', powerReserve: '55 hours', functions: 'Date' },
  { id: 'prod_014', name: 'Rolex Pearlmaster Style', nameZh: '劳力士珍珠淑女型风格', price: 229, originalPrice: 369, brand: 'Rolex', category: 'Pearlmaster', image: '/products/image27.jpeg', detailImage1: '/products/image28.jpeg', stock: 4, isActive: true, caseMaterial: 'Rose Gold', dial: 'Mother of Pearl', movement: 'Automatic', powerReserve: '55 hours', functions: 'Date' }
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p
    });
    console.log('✅', p.name);
  }
  console.log('\n🎉 共导入', products.length, '个产品');
}

main().catch(console.error).finally(() => prisma.$disconnect());
