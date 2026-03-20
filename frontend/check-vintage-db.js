const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log(`数据库中有 ${count} 个产品`);
  
  if (count > 0) {
    const products = await prisma.product.findMany({ 
      take: 5,
      select: { id: true, name: true, price: true, brand: true, isActive: true }
    });
    console.log('\n前5个产品:');
    products.forEach(p => {
      console.log(`- ${p.name} (${p.id}): €${p.price}, 品牌: ${p.brand || 'N/A'}, 上架: ${p.isActive}`);
    });
  }
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
