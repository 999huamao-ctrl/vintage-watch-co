# CREEM 支付平台配置指南

## 1. 注册 CREEM 账号

访问: https://creem.io

### 注册步骤:
1. 点击 "Get Started" 或 "Sign Up"
2. 输入邮箱地址（建议使用运营邮箱）
3. 设置密码
4. 验证邮箱

## 2. 完成 KYC 验证

进入 Dashboard 后，需要完成商户验证：

### 所需资料:
- 公司名称（可用个人姓名）
- 网站地址: `https://horizon-watch.vercel.app`
- 联系信息
- 银行账户（用于收款）

## 3. 获取 API Key

1. 进入 Dashboard → Settings → API Keys
2. 点击 "Create New API Key"
3. 复制生成的 API Key（以 `creem_` 开头）

## 4. 配置 Webhook

1. 进入 Dashboard → Webhooks
2. 点击 "Add Endpoint"
3. 配置:
   - **Endpoint URL**: `https://horizon-watch.vercel.app/api/creem/webhook`
   - **Events**: 
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `refund.created`
4. 复制 Webhook Secret

## 5. Vercel 环境变量配置

进入 https://vercel.com/dashboard → 项目 → Settings → Environment Variables

添加以下变量:

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `CREEM_API_KEY` | 从 Dashboard 复制的 API Key | Production |
| `CREEM_WEBHOOK_SECRET` | 从 Webhook 设置复制的 Secret | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://horizon-watch.vercel.app` | Production |

## 6. 重新部署

添加环境变量后，需要重新部署才能生效：

```bash
cd /root/.openclaw/workspace/projects/watch-store/frontend
npx vercel --prod
```

## 7. 测试支付

1. 访问网站，添加商品到购物车
2. 进入结账页
3. 选择 "Credit Card" 支付方式
4. 填写测试信息:
   - 邮箱: 任意有效邮箱
   - 卡号: 使用 CREEM 提供的测试卡号（在 Dashboard → Test Mode 查看）
5. 完成支付流程

## 8. 生产环境切换

测试通过后:
1. 在 CREEM Dashboard 开启 Production Mode
2. 确保 webhook 和生产环境 URL 匹配
3. 测试真实支付

## 注意事项

### 费率
- 标准费率: 3.9% + $0.30
- 无月费、无设置费

### 结算周期
- 通常 T+7 结算到银行账户
- 支持 Stripe 账户、PayPal、银行转账

### 税务
- CREEM 作为 Merchant of Record 自动处理欧洲 VAT
- 无需额外税务申报

## 联系方式

如遇到问题:
- CREEM 支持: support@creem.io
- 文档: https://docs.creem.io
