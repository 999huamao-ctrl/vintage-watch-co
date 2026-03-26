const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 检查WhatsAppLink表
    const count = await prisma.whatsAppLink.count();
    console.log('WhatsAppLink表存在，共有', count, '条记录');
    
    if (count > 0) {
      const links = await prisma.whatsAppLink.findMany();
      console.log('\n链接列表:');
      links.forEach(l => console.log(`- ${l.name}: ${l.url} (活跃:${l.isActive})`));
    } else {
      console.log('\n没有WA链接数据，需要创建');
    }
  } catch (e) {
    console.error('错误:', e.message);
    if (e.message.includes('does not exist')) {
      console.log('\nWhatsAppLink表不存在，需要同步数据库schema');
    }
  }
}

main().finally(() => prisma.$disconnect());
