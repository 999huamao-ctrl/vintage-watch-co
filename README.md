# 白牌手表欧洲独立站

## 项目信息

- **项目名称**：Vintage Watch Co.
- **负责人**：STAR
- **AI 助手**：Kimi Claw
- **创建日期**：2026-03-03
- **技术栈**：Next.js + PayPal（自建）

---

## 商业模式

| 项目 | 内容 |
|------|------|
| 产品 | 白牌手表（复古经典款，无品牌标识） |
| 目标市场 | 欧洲（首发） |
| 销售渠道 | Next.js 自建独立站 |
| 支付 | PayPal（支持个人注册） |
| 物流 | 欧洲专线（已确认渠道） |
| 客服 | AI 自动化 + 人工兜底 |

---

## 项目结构

```
watch-store/
├── frontend/               # Next.js 网站
│   ├── src/
│   │   ├── app/           # 页面路由
│   │   ├── components/    # React 组件
│   │   └── lib/           # 数据 & 购物车
│   └── README.md          # 部署指南
├── products/              # 产品占位图
├── CHATBOT_SETUP.md       # AI 客服部署指南
├── LEGAL_PAGES.md         # 法律页面文案
└── README.md              # 本文件
```

---

## 3 款产品

| 产品 | 名称 | 风格 | 定价 |
|------|------|------|------|
| 1 | The Heritage 42 | 复古正装表，42mm，自动机械，皮表带 | €79 |
| 2 | The Classic Chrono | 复古计时码表，40mm，石英，钢带 | €89 |
| 3 | The Minimalist | 极简表盘，38mm，日本石英，米兰钢带 | €69 |

---

## 物流费用参考

| 国家 | 运费 | 时效 |
|------|------|------|
| 🇬🇧 英国 | €8 | 9-10天 |
| 🇩🇪 德国 | €6 | 9-10天 |
| 🇫🇷 法国 | €6 | 9-10天 |
| 🇮🇹 意大利 | €7 | 9-12天 |
| 🇪🇸 西班牙 | €7 | 9-10天 |

**满 €79 免运费**

---

## PayPal 注册步骤

1. 访问 https://developer.paypal.com
2. 注册/登录 PayPal 账户
3. 创建应用获取 Client ID 和 Secret
4. 配置环境变量

**手续费**: 4.4% + €0.30/笔

---

## 快速开始

```bash
cd frontend
npm install
cp .env.local.example .env.local
# 编辑 .env.local，填入 PayPal 凭证
npm run dev
```

---

## 部署

查看 `frontend/README.md` 获取 Vercel 部署指南。

---

## 已完成 ✅

- [x] Next.js 项目搭建
- [x] 3 款产品页面
- [x] 购物车功能
- [x] PayPal 支付集成
- [x] 运费计算
- [x] AI 客服系统（部署指南）
- [x] 法律页面文案

## 待完成 📋

- [ ] 注册 PayPal 获取 API Keys
- [ ] 部署到 Vercel
- [ ] 替换产品占位图为真实图片
- [ ] 部署 AI 客服
- [ ] 配置邮件通知

---

## 联系方式

- **邮箱**：999huamao@gmail.com
- **物流**：欧洲专线（敏感货可发）

---

*项目由 STAR 和 Kimi Claw 共同搭建。*
Deployed to Vercel.
