import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany();
  console.log('数据库产品数量:', products.length);
  console.log('产品列表:');
  products.forEach(p => console.log('-', p.name, '|', p.price, '| 库存:', p.stock));
  
  const orders = await prisma.order.findMany();
  console.log('\n订单数量:', orders.length);
}
main().finally(() => prisma.$disconnect());
