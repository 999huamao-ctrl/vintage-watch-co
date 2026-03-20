const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 查询活跃产品
  const activeProducts = await prisma.product.findMany({
    where: { isActive: true }
  });
  
  console.log('活跃产品数量:', activeProducts.length);
  console.log('\n按品牌分组:');
  
  const byBrand = {};
  activeProducts.forEach(p => {
    const brand = p.brand || 'NULL';
    if (!byBrand[brand]) byBrand[brand] = [];
    byBrand[brand].push(p.name);
  });
  
  Object.entries(byBrand).forEach(([brand, names]) => {
    console.log(`\n${brand} (${names.length}个):`);
    names.forEach((n, i) => console.log(`  ${i+1}. ${n}`));
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
