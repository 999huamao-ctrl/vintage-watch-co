# Shopify 店铺搭建指南

## 1. 注册 Shopify 账户

1. 访问 https://www.shopify.com
2. 点击 "Start free trial"
3. 使用邮箱注册（建议：999huamao@gmail.com）
4. 选择 "I'm selling physical products"
5. 跳过预设，选择 "I'll set this up later"

## 2. 基础设置

### 店铺信息
- **店铺名称**：Vintage Watch Co.（可修改）
- **地址**：填写你的实际地址（用于税费计算）

### 货币设置
- Settings → Store details → Store currency
- 选择 **EUR (€)** 作为主要货币

### 时区设置
- Settings → Store details → Time zone
- 选择 **Europe/Berlin** 或你的目标市场时区

## 3. 安装主题

推荐主题（免费）：
- **Dawn** - 简洁现代，加载快
- **Craft** - 适合复古风格

安装步骤：
1. Online Store → Themes
2. 点击 "Add theme" → "Visit theme store"
3. 搜索 Dawn，点击 "Add to theme library"
4. 发布后点击 "Customize"

## 4. 导入产品

### 4.1 上传产品图片
1. Settings → Files
2. 上传 `products/` 文件夹中的 3 张图片
3. 复制每张图片的 URL

### 4.2 导入产品数据
1. Products → Import
2. 上传 `shopify_products.csv`
3. 等待导入完成
4. 编辑每个产品，添加图片 URL

## 5. 配置支付

### Stripe（推荐）
1. Settings → Payments
2. 点击 "Add payment method"
3. 搜索 Stripe，点击 "Activate"
4. 连接你的 Stripe 账户（需提前注册）

### PayPal（备用）
1. 同样在 Payments 页面
2. 激活 PayPal
3. 连接你的 PayPal 商家账户

## 6. 配置运费

1. Settings → Shipping and delivery
2. 创建新的运费配置文件："European Shipping"
3. 添加运费区域：

### Zone 1: UK & Ireland
- 国家：United Kingdom, Ireland
- 运费：€8.00（或满 €79 免运费）

### Zone 2: Western Europe
- 国家：Germany, France, Netherlands, Belgium, Austria
- 运费：€6.00（或满 €79 免运费）

### Zone 3: Southern Europe
- 国家：Italy, Spain, Portugal
- 运费：€7.00（或满 €79 免运费）

### Zone 4: Northern Europe
- 国家：Sweden, Denmark, Finland, Norway
- 运费：€10.00

## 7. 设置税费

1. Settings → Taxes and duties
2. 激活 "Collect VAT"（针对欧洲国家）
3. 设置欧盟 VAT 税率（通常 19-25%，根据目的地国家）

## 8. 测试订单

1. 在店铺前台添加产品到购物车
2. 进入结账流程
3. 使用测试信用卡（Stripe 提供测试卡号）：
   - 卡号：4242 4242 4242 4242
   - 日期：任意未来日期
   - CVC：任意 3 位数
4. 确认订单能正常完成

## 9. 发布店铺

1. Online Store → Preferences
2. 添加店铺标题和描述（SEO）
3. 设置密码保护为 OFF
4. 点击 "Save"

## 10. 域名设置（可选）

1. Settings → Domains
2. 购买新域名或连接已有域名
3. 推荐域名格式：vintagewatchco.com / .eu

---

## 下一步：AI 客服系统

店铺上线后，部署 AI 客服系统：
- 查看 `chatbot/` 文件夹中的部署指南
- 或使用 Tidio/Crisp 等第三方聊天工具快速集成

---

## 重要提醒

⚠️ **测试期间**：
- 保持店铺密码保护（Settings → Online Store → Preferences）
- 使用 Shopify 提供的测试模式
- 确认支付流程正常后再开放访问

⚠️ **法律合规**：
- 添加 Privacy Policy 页面
- 添加 Terms of Service 页面
- 添加 Returns & Refunds 页面
- 确保 GDPR 合规（欧盟客户数据保护）
