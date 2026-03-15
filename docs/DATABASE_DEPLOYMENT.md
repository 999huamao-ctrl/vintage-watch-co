# 数据库部署指南

## 1. 选择数据库服务商

推荐选项（按优先级）：

### 选项1: Vercel Postgres（最简单）
- 与Vercel无缝集成
- 免费额度：256MB存储
- 价格：$0.30/月/GB
- 部署：一键在Vercel Dashboard创建

### 选项2: Supabase（功能最全）
- 免费额度：500MB存储，2GB传输
- 包含：数据库、Auth、Storage、Realtime
- 地区：可选新加坡（近中国）
- 价格：免费版足够起步

### 选项3: Neon（Serverless，最便宜）
- 免费额度：3GB存储
- 无连接数限制
- 价格：$0（免费版足够长期使用）

## 2. 部署步骤（以Supabase为例）

### 2.1 创建数据库
1. 访问 https://supabase.com
2. 注册/登录账号
3. 点击 "New Project"
4. 填写项目名称（如：horizon-watches）
5. 选择地区：Singapore ( Southeast Asia )
6. 设置数据库密码（保存好！）
7. 等待数据库创建完成（约1-2分钟）

### 2.2 获取连接字符串
1. 进入项目 → Settings → Database
2. 找到 "Connection string" 区域
3. 选择 "URI" 格式
4. 复制连接字符串（格式如下）：
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres
```

### 2.3 配置环境变量
在Vercel Dashboard：
1. 进入你的项目
2. Settings → Environment Variables
3. 添加变量：
   - Name: `DATABASE_URL`
   - Value: 刚才复制的连接字符串

### 2.4 部署数据库Schema

方法一：通过Supabase SQL Editor
1. 进入Supabase Dashboard → SQL Editor
2. 新建Query
3. 复制 `prisma/migrations/init.sql` 内容执行

方法二：通过Prisma Migrate（推荐）
```bash
# 本地执行
npx prisma migrate dev --name init

# 或者直接在Vercel部署后通过CLI执行
npx prisma migrate deploy
```

## 3. Prisma客户端配置

已创建 `/src/lib/db.ts`，包含：
- 用户管理
- 商品管理
- 订单管理
- 库存管理
- 供应链（采购单）
- 运营数据（日报、广告）
- 行为追踪
- 钱包配置

## 4. API路由清单

已创建以下API：

| 路径 | 方法 | 功能 |
|------|------|------|
| `/api/admin/dashboard` | GET | 仪表盘数据（订单数、收入、库存预警） |
| `/api/admin/products` | GET/POST/PUT/DELETE | 商品CRUD |
| `/api/admin/orders` | GET/PATCH | 订单列表、更新状态 |
| `/api/admin/wallet` | GET/POST | 钱包配置读写 |
| `/api/export` | GET | 数据导出（支持CSV/JSON） |

## 5. 环境变量清单

在Vercel中配置：

```
DATABASE_URL=postgresql://...
```

## 6. 初始化数据

部署后执行以下操作初始化：

1. **创建初始管理员账号**
   - 通过Supabase SQL Editor执行：
   ```sql
   INSERT INTO users (username, email, password, role) 
   VALUES ('superadmin', 'superadmin@horizonwatches.com', 'super123', 'SUPERADMIN');
   ```

2. **导入商品数据**
   - 使用 `/api/admin/products` POST接口批量导入
   - 或直接在Supabase Table Editor中导入CSV

3. **配置钱包地址**
   - 登录后台 → Settings
   - 设置3级钱包地址

## 7. 本地开发配置

创建 `.env.local` 文件：
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/horizon
```

安装依赖：
```bash
npm install @prisma/client
npm install -D prisma
```

生成Prisma客户端：
```bash
npx prisma generate
```

## 8. 生产环境检查清单

- [ ] 数据库已部署并可通过外网访问
- [ ] DATABASE_URL已配置在Vercel环境变量
- [ ] Prisma schema已迁移到生产数据库
- [ ] 初始管理员账号已创建
- [ ] 钱包地址已配置
- [ ] 商品数据已导入
- [ ] API测试通过

## 9. 备份策略

Supabase自动备份：
- 免费版：每日自动备份，保留7天
- 可在Dashboard中手动导出

建议额外备份：
- 每周导出一次完整数据
- 重要操作前手动备份

## 10. 监控

Supabase Dashboard提供：
- 数据库性能指标
- 连接数监控
- 存储使用情况
- API请求日志
