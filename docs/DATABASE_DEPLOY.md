# 数据库部署指南

## 快速开始（推荐）

### 方案1：Vercel Postgres（最简单）

```bash
# 1. 在 Vercel Dashboard 创建 Postgres 数据库
# Storage → Create Database → Postgres

# 2. 获取连接字符串
# 页面会自动显示 .env.local 内容

# 3. 设置环境变量
# 自动同步，无需手动配置
```

### 方案2：Supabase（免费额度高）

1. 访问 https://supabase.com
2. 创建项目，等待数据库初始化
3. Settings → Database → Connection String
4. 复制 `URI` 格式字符串

```bash
# .env.local
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

### 方案3：Neon（Serverless，按需付费）

1. 访问 https://neon.tech
2. 创建项目
3. Dashboard → Connection Details
4. 复制连接字符串

---

## 初始化数据库

```bash
cd /root/.openclaw/workspace/projects/watch-store/frontend

# 1. 安装 Prisma CLI
npm install -D prisma

# 2. 生成 Prisma Client
npx prisma generate

# 3. 推送 Schema 到数据库（开发环境）
npx prisma db push

# 4. 验证连接
npx prisma studio
```

---

## 生产环境部署

```bash
# 1. 生成迁移文件
npx prisma migrate dev --name init

# 2. 生产环境应用迁移
npx prisma migrate deploy

# 3. 验证
npx prisma migrate status
```

---

## 测试连接

创建测试脚本 `scripts/test-db.ts`：

```typescript
import { prisma } from '../src/lib/db';

async function test() {
  try {
    // 测试连接
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // 测试查询
    const productCount = await prisma.product.count();
    console.log(`📦 Products: ${productCount}`);
    
    const orderCount = await prisma.order.count();
    console.log(`📋 Orders: ${orderCount}`);
    
    console.log('✅ All tests passed');
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
```

运行：
```bash
npx ts-node scripts/test-db.ts
```

---

## 数据导入（初始商品）

```bash
# 从现有数据迁移
npx ts-node scripts/seed-products.ts
```

脚本示例：

```typescript
import { prisma } from '../src/lib/db';
import { products } from '../src/lib/data';

async function seed() {
  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.id,
        sku: p.id.toUpperCase().replace(/-/g, ''),
        baseName: p.name,
        baseDesc: p.description,
        price: p.price,
        comparePrice: p.compareAtPrice,
        stock: 100,
        images: p.images,
        categoryId: 'default-category', // 需要先创建
        translations: {
          create: [
            { language: 'de', name: p.name, description: p.description },
            { language: 'fr', name: p.name, description: p.description },
            { language: 'es', name: p.name, description: p.description },
            { language: 'it', name: p.name, description: p.description },
            { language: 'zh', name: p.name, description: p.description },
          ]
        }
      }
    });
  }
  console.log(`Seeded ${products.length} products`);
}

seed();
```

---

## 日常运维

### 备份数据库

```bash
# 导出数据
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 压缩备份
gzip backup_*.sql

# 自动备份脚本（添加到 cron）
# 0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/backup_$(date +\%Y\%m\%d).sql.gz
```

### 查看连接

```bash
# 在 Prisma Studio 中查看
npx prisma studio

# 或直接查询
npx prisma db execute --stdin <<EOF
SELECT * FROM "Order" LIMIT 5;
EOF
```

### 重置开发数据库

```bash
# 危险操作！仅开发环境
npx prisma migrate reset
```

---

## 监控查询

### 慢查询日志

在 Prisma Client 中启用：

```typescript
const prisma = new PrismaClient({
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
});
```

### 性能优化

```sql
-- 添加常用索引
CREATE INDEX CONCURRENTLY idx_order_created_at ON "Order"(createdAt);
CREATE INDEX CONCURRENTLY idx_order_status ON "Order"(status);
CREATE INDEX CONCURRENTLY idx_product_stock ON "Product"(stock) WHERE "isActive" = true;
CREATE INDEX CONCURRENTLY idx_inventory_product ON "InventoryLog"(productId, createdAt);
```

---

## 常见问题

### 连接超时

```bash
# 增加连接超时设置
DATABASE_URL="postgresql://...?connect_timeout=30&pool_timeout=30"
```

### SSL 问题

```bash
# 某些数据库需要禁用 SSL（不推荐生产环境）
DATABASE_URL="postgresql://...?sslmode=disable"
```

### 连接池耗尽

```typescript
// 使用连接池中间件
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });
```
