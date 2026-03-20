const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. 把所有品牌为NULL的产品下架
  const nullBrandResult = await prisma.product.updateMany({
    where: { brand: null },
    data: { isActive: false }
  });
  console.log(`已下架 ${nullBrandResult.count} 个品牌为NULL的产品`);
  
  // 2. 只保留14个Rolex产品中的前... 等等，14个新产品
  // 用户要15个，那保留全部14个Rolex + 1个其他的？
  // 目前新产品正好是14个，那就是这14个
  
  // 检查最终结果
  const activeCount = await prisma.product.count({ where: { isActive: true } });
  console.log(`\n现在共有 ${activeCount} 个上架产品`);
  
  const active = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  });
  
  console.log('\n上架产品列表:');
  active.forEach((p, i) => {
    console.log(`${i+1}. ${p.name}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
