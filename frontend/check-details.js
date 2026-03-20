const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 检查前15个产品的详细信息
  const products = await prisma.product.findMany({ take: 15 });
  
  console.log('前15个产品详情:\n');
  products.forEach((p, i) => {
    console.log(`${i+1}. ${p.name}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   图片: ${p.image || 'NULL'}`);
    console.log(`   品牌: ${p.brand || 'NULL'}`);
    console.log(`   分类: ${p.category || 'NULL'}`);
    console.log(`   上架: ${p.isActive}`);
    console.log('');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
