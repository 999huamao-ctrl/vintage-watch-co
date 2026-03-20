const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log('数据库共有', products.length, '个产品');
  products.forEach((p, i) => {
    console.log((i+1) + '. ' + p.name + ' - 上架:' + p.isActive + ' 库存:' + p.stock);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
