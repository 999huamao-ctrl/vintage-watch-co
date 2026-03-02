# Vintage Watch Co. - Next.js E-commerce

复古手表独立站 - Next.js + PayPal 自建方案

---

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **支付**: PayPal
- **状态管理**: Zustand (购物车)
- **部署**: Vercel (推荐)

---

## 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/checkout/       # PayPal API 路由
│   │   ├── checkout/           # 结账页面
│   │   ├── product/[id]/       # 产品详情页
│   │   ├── success/            # 支付成功页
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── Navbar.tsx          # 导航栏
│   │   ├── ProductCard.tsx     # 产品卡片
│   │   └── CartDrawer.tsx      # 购物车抽屉
│   └── lib/                    # 工具函数
│       ├── data.ts             # 产品数据
│       └── cart.ts             # 购物车状态
├── .env.local.example          # 环境变量示例
├── next.config.ts              # Next.js 配置
└── package.json
```

---

## PayPal 注册指南

### 1. 注册 PayPal 开发者账户

1. 访问 https://developer.paypal.com
2. 用你的 PayPal 账户登录（或注册新的）
3. 进入 Dashboard

### 2. 创建应用获取 API Keys

1. 点击 "Apps & Credentials"
2. 点击 "Create App"
3. 输入应用名称：Vintage Watch Co.
4. 选择 "Merchant" 类型
5. 复制 **Client ID** 和 **Secret**

### 3. 沙盒测试账户

PayPal 提供沙盒环境用于测试：
- 在 Dashboard 中创建沙盒商家账户
- 创建沙盒买家账户（带虚拟余额）
- 测试时不会产生真实扣款

---

## 本地开发

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 PayPal Sandbox 凭证：
```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_SECRET=your_sandbox_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 部署到 Vercel

### 1. 准备代码

确保代码已推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. 部署

1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 环境变量设置（使用 PayPal **生产环境**凭证）：
   - `PAYPAL_CLIENT_ID`: 你的 PayPal 生产 Client ID
   - `PAYPAL_SECRET`: 你的 PayPal 生产 Secret
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: 同上（这个是公开的）
   - `NEXT_PUBLIC_URL`: 部署后的域名（部署后更新）

5. 点击 "Deploy"

### 3. 切换到生产环境

在 PayPal Dashboard：
1. 创建生产环境应用
2. 复制生产环境的 Client ID 和 Secret
3. 更新 Vercel 环境变量
4. Redeploy 项目

---

## 费用说明

| 项目 | 费用 |
|------|------|
| Vercel 托管 | $0（免费额度足够）|
| PayPal 手续费 | 4.4% + €0.30 每笔交易 |
| 提现到国内银行 | 可能有汇率转换费 |

---

## 功能清单

- [x] 产品展示（首页 + 详情页）
- [x] 购物车（添加、删除、修改数量）
- [x] PayPal 结账
- [x] 运费计算（按国家）
- [x] 满 €79 免运费
- [x] 响应式设计
- [x] 静态生成（快速加载）

---

## 后续优化

- [ ] AI 客服集成（已有方案，待部署）
- [ ] 订单管理后台
- [ ] 库存管理
- [ ] 邮件通知（订单确认、发货通知）
- [ ] 多语言支持
- [ ] 真实产品图片替换占位图

---

## 费用对比

| 项目 | Shopify | Next.js + PayPal |
|------|---------|------------------|
| 月费 | $39+ | $0 (Vercel 免费) |
| 交易费 | 2% + 支付网关费 | PayPal 4.4% + €0.30 |
| 自定义 | 受限 | 完全自主 |
| 性能 | 一般 | 极快（静态生成） |

**自建方案优势**: 无月费，完全可控，性能更好。

---

## 需要帮助？

查看 `CHATBOT_SETUP.md` 集成 AI 客服系统。
