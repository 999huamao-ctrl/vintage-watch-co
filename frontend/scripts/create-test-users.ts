import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('创建测试账号...');

  // 创建各种角色的测试账号
  const testUsers = [
    { username: 'superadmin', password: 'super123', role: UserRole.SUPERADMIN },
    { username: 'admin', password: 'admin123', role: UserRole.ADMIN },
    { username: 'supply', password: 'supply123', role: UserRole.SUPPLY },
    { username: 'logistics', password: 'logistics123', role: UserRole.LOGISTICS },
  ];

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        password: hashedPassword,
        role: userData.role,
        isActive: true,
      },
      create: {
        username: userData.username,
        email: `${userData.username}@horizonwatches.com`,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
      },
    });
    
    console.log(`✅ ${userData.username} (${userData.role}) - 密码: ${userData.password}`);
  }

  console.log('\n测试账号创建完成！');
}

main()
  .catch((e) => {
    console.error('错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
