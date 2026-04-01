# GitHub Secrets 配置指南

## 需要配置的 Secrets

请前往 GitHub 仓库设置页面添加以下 Secrets：

**路径：** `https://github.com/999huamao-ctrl/vintage-watch-co/settings/secrets/actions`

---

## 必需 Secrets

### 1. VERCEL_TOKEN
**获取方式：**
1. 访问 https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 输入 Token 名称（如：github-actions）
4. 点击 "Create"
5. 复制生成的 Token（以 `vercel_` 开头）

**填入值：** 复制的 Token 字符串

---

### 2. VERCEL_ORG_ID
**填入值：**
```
team_C3KGpCIdnxaNdAmrQkl6GBnK
```

---

### 3. VERCEL_PROJECT_ID
**填入值：**
```
prj_ceyPxYNG4BVzUC6vAAQQPX8mAy5o
```

---

### 4. DATABASE_URL
**填入值：**
```
postgresql://neondb_owner:npg_TPmMDniR7Ow9@ep-spring-river-aloa79ru.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

### 5. NEXTAUTH_SECRET
**填入值（随机生成的密钥）：**
```
generate-a-random-secret-key-here-min-32-chars
```
> 你可以使用 `openssl rand -base64 32` 生成

---

### 6. NEXTAUTH_URL
**填入值：**
```
https://horizonoo.cc
```

---

## 可选 Secrets（如果使用 Creem 支付）

### 7. CREEM_API_KEY
**填入值：** 你的 Creem API Key

### 8. CREEM_WEBHOOK_SECRET
**填入值：** 你的 Creem Webhook Secret

---

## 配置完成后

1. 添加完所有 Secrets 后，GitHub Actions 会在下次代码推送时自动部署
2. 或者你可以手动触发部署：
   - 访问 `https://github.com/999huamao-ctrl/vintage-watch-co/actions`
   - 点击 "Deploy to Vercel"
   - 点击 "Run workflow"

---

## 验证部署

部署成功后，访问商品详情页查看多图功能：
https://horizonoo.cc/products/rec2745Y6KhfPt

应显示：
- 左右箭头切换图片
- 图片计数器 (1/5)
- 底部缩略图
