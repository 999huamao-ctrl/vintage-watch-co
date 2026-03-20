const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count({ where: { isActive: true } });
  console.log('活跃产品数:', count);
  
  const products = await prisma.product.findMany({ 
    where: { isActive: true },
    take: 3,
    select: { id: true, name: true, brand: true, image: true }
  });
  
  console.log('\n前3个产品:');
  products.forEach(p => console.log('-', p.name, '|', p.brand, '|', p.image ? '有图' : '无图'));
}

main().catch(e => console.error(e.message)).finally(() => prisma.$disconnect());
