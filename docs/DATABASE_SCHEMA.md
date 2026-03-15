# 数据库架构文档 v1.0

## 概述

完整电商数据库架构，支持：
- **用户系统** - 多角色权限管理
- **商品系统** - 多语言、库存、供应链
- **订单系统** - 全流程追踪
- **供应链** - 采购、供应商、库存
- **运营数据** - 广告、转化、日报
- **客户行为** - 埋点追踪

---

## 模块详解

### 1. 用户与权限 (User & Role)

| 角色 | 权限 |
|------|------|
| SUPERADMIN | 全部权限，包括危险操作 |
| ADMIN | 商品、订单、运营数据查看 |
| SUPPLY | 商品、库存、采购单管理 |
| LOGISTICS | 订单处理、发货、物流 |
| CUSTOMER | 购物、查看自己的订单 |

**关键表：**
- `User` - 用户基础信息
- `Session` - 登录会话

---

### 2. 商品管理 (Product)

**关键表：**
- `Category` - 分类
- `Product` - 商品主表
- `ProductTranslation` - 多语言翻译
- `CartItem` - 购物车

**商品字段说明：**
```
price          - 售价（欧元）
comparePrice   - 划线价（促销用）
costPrice      - 成本价（供应链用，计算利润）
stock          - 当前库存
lowStockAlert  - 低库存预警阈值
```

---

### 3. 订单系统 (Order)

**订单状态流转：**
```
PENDING → PAID → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
   ↓
CANCELLED / REFUNDED
```

**关键表：**
- `Order` - 订单主表
- `OrderItem` - 订单商品快照
- `OrderStatusHistory` - 状态变更日志

**核心字段：**
```
orderNumber    - 人类可读单号：ORD-20240315-A1B2
paymentMethod  - USDT / PAYPAL / CREDIT_CARD
paymentStatus  - 支付状态
txid           - 区块链交易ID
utmSource      - 流量来源（facebook/google等）
```

---

### 4. 供应链 (Supply Chain)

**关键表：**
- `Supplier` - 供应商信息
- `SupplierProduct` - 供应商-商品关联
- `PurchaseOrder` - 采购单 (PO)
- `PurchaseOrderItem` - 采购明细
- `InventoryLog` - 库存流水

**采购单状态：**
```
DRAFT → SENT → CONFIRMED → SHIPPED → RECEIVED
```

**库存流水类型：**
- PURCHASE - 采购入库
- SALE - 销售出库
- RETURN - 退货入库
- ADJUSTMENT - 库存调整
- STOCKTAKE - 盘点

---

### 5. 运营数据 (Marketing)

**关键表：**
- `MarketingCampaign` - 广告投放计划
- `DailyStats` - 每日数据汇总
- `CustomerBehavior` - 用户行为埋点

**日报字段说明：**
```
visitors       - 独立访客数
pageViews      - 页面浏览量
orders         - 订单数
revenue        - 销售额
adSpend        - 广告花费
conversionRate - 转化率 (orders/visitors)
aov            - 客单价 (revenue/orders)
roas           - 广告回报率 (revenue/adSpend)
```

---

## 核心数据查询示例

### 1. 今日销售额
```sql
SELECT 
  COUNT(*) as orders,
  SUM(total) as revenue,
  AVG(total) as aov
FROM "Order"
WHERE DATE(createdAt) = CURRENT_DATE
  AND status NOT IN ('CANCELLED', 'REFUNDED');
```

### 2. 商品库存预警
```sql
SELECT 
  p.sku,
  p."baseName",
  p.stock,
  p."lowStockAlert",
  s.name as supplier
FROM "Product" p
LEFT JOIN "SupplierProduct" sp ON sp."productId" = p.id
LEFT JOIN "Supplier" s ON s.id = sp."supplierId"
WHERE p.stock <= p."lowStockAlert"
  AND p."isActive" = true;
```

### 3. 广告ROI计算
```sql
SELECT 
  c.name,
  c."utmCampaign",
  c.spend,
  COUNT(o.id) as orders,
  COALESCE(SUM(o.total), 0) as revenue,
  CASE 
    WHEN c.spend > 0 THEN COALESCE(SUM(o.total), 0) / c.spend 
    ELSE 0 
  END as roas
FROM "MarketingCampaign" c
LEFT JOIN "Order" o ON o."utmCampaign" = c."utmCampaign"
WHERE c."isActive" = true
GROUP BY c.id;
```

### 4. 利润分析
```sql
SELECT 
  DATE(o.createdAt) as date,
  SUM(oi.quantity * (oi.price - COALESCE(oi."costPrice", 0))) as gross_profit,
  SUM(o.total) as revenue,
  CASE 
    WHEN SUM(o.total) > 0 
    THEN SUM(oi.quantity * (oi.price - COALESCE(oi."costPrice", 0))) / SUM(o.total) * 100
    ELSE 0 
  END as margin_percent
FROM "Order" o
JOIN "OrderItem" oi ON oi."orderId" = o.id
WHERE o.status = 'DELIVERED'
GROUP BY DATE(o.createdAt)
ORDER BY date DESC;
```

---

## 数据导出接口

### CSV 导出

所有管理接口支持 CSV 导出：

| 端点 | 说明 |
|------|------|
| `/api/export/orders` | 订单导出（支持日期范围、状态筛选） |
| `/api/export/products` | 商品导出（含库存、成本） |
| `/api/export/customers` | 客户导出 |
| `/api/export/inventory` | 库存流水导出 |
| `/api/export/daily-stats` | 日报数据导出 |

### 导出参数
```
?format=csv|json
?startDate=2024-03-01
?endDate=2024-03-15
?status=PAID,SHIPPED
```

---

## 数据库部署

### 1. 选择数据库服务

**推荐（免费/低成本）：**
- **Vercel Postgres** - 与 Next.js 深度集成，免费额度足够初期
- **Supabase** - 免费 tier 含 500MB，有管理后台
- **Neon** - Serverless Postgres，按需付费
- **Railway** - 简单易用，$5/月起

### 2. 环境变量配置

```bash
# .env.local
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# 可选：连接池（生产环境推荐）
DATABASE_URL_POOLED="postgresql://user:pass@pooler-host:5432/dbname?sslmode=require"
```

### 3. 初始化命令

```bash
# 安装依赖
npm install @prisma/client
npm install -D prisma

# 生成客户端
npx prisma generate

# 推送Schema到数据库（开发环境）
npx prisma db push

# 生产环境迁移
npx prisma migrate deploy

# 启动Studio（可视化数据库管理）
npx prisma studio
```

---

## 备份策略

### 自动备份（推荐）

使用数据库服务商的自动备份功能：
- Vercel Postgres: 每日自动备份
- Supabase: 每日备份，保留7天

### 手动导出

```bash
# 导出整个数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 只导出数据（不含结构）
pg_dump --data-only $DATABASE_URL > data_backup.sql
```

---

## 扩展计划

| 阶段 | 功能 |
|------|------|
| v1.0 | 用户、商品、订单、基础供应链 |
| v1.1 | 广告数据自动同步（Facebook/Google API） |
| v1.2 | 库存预警、自动补货建议 |
| v1.3 | 客户分层、RFM分析 |
| v1.4 | 多仓库支持 |
| v1.5 | 供应商门户（让供应商自己更新库存） |
