import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('数据库中的用户:');
  users.forEach(u => console.log('-', u.username, '|', u.role, '|', u.isActive ? '激活' : '禁用'));
}
main().finally(() => prisma.$disconnect());
