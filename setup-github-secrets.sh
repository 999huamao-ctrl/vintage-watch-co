#!/bin/bash

# =====================================================
# GitHub Secrets 自动配置脚本
# 运行方式：bash setup-github-secrets.sh
# =====================================================

echo "========================================"
echo "GitHub Secrets 自动配置工具"
echo "========================================"
echo ""

# 提示输入 Tokens
echo "请输入 Vercel Token（以 vercel_ 开头）："
read -s VERCEL_TOKEN
echo ""

echo "请输入 GitHub Personal Access Token（以 ghp_ 开头）："
read -s GITHUB_TOKEN
echo ""

# 验证输入
if [[ -z "$VERCEL_TOKEN" ]] || [[ -z "$GITHUB_TOKEN" ]]; then
    echo "错误：Token 不能为空"
    exit 1
fi

# 仓库信息
REPO="999huamao-ctrl/vintage-watch-co"
API_URL="https://api.github.com/repos/$REPO/actions/secrets"

# 获取仓库公钥（用于加密 secrets）
echo "正在获取仓库公钥..."
PUBLIC_KEY_INFO=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "$API_URL/public-key")

PUBLIC_KEY=$(echo "$PUBLIC_KEY_INFO" | grep -o '"key": "[^"]*"' | cut -d'"' -f4)
KEY_ID=$(echo "$PUBLIC_KEY_INFO" | grep -o '"key_id": "[^"]*"' | cut -d'"' -f4)

if [[ -z "$PUBLIC_KEY" ]] || [[ -z "$KEY_ID" ]]; then
    echo "错误：无法获取仓库公钥，请检查 GitHub Token 是否有 repo 权限"
    exit 1
fi

echo "✓ 公钥获取成功"

# 加密函数
encrypt_secret() {
    local secret="$1"
    local key="$2"
    
    # 使用 openssl 加密
    echo -n "$secret" | openssl pkeyutl -encrypt -pkeyopt rsa_padding_mode:oaep -pubin -inkey <(echo "$key" | base64 -d 2>/dev/null || echo "$key") 2>/dev/null | base64 -w 0
}

# 创建 secret 的函数
create_secret() {
    local name="$1"
    local value="$2"
    
    # 使用简单的 base64 编码（GitHub API 接受 base64 编码的 plain text）
    ENCRYPTED_VALUE=$(echo -n "$value" | base64 -w 0)
    
    RESPONSE=$(curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Content-Type: application/json" \
        -d "{\"encrypted_value\":\"$ENCRYPTED_VALUE\",\"key_id\":\"$KEY_ID\"}" \
        "$API_URL/$name" 2>&1)
    
    if echo "$RESPONSE" | grep -q "201\\|204\\|200"; then
        echo "✓ $name 配置成功"
        return 0
    else
        echo "✗ $name 配置失败: $RESPONSE"
        return 1
    fi
}

echo ""
echo "正在配置 Secrets..."
echo ""

# 配置各个 Secrets
create_secret "VERCEL_TOKEN" "$VERCEL_TOKEN"
create_secret "VERCEL_ORG_ID" "team_C3KGpCIdnxaNdAmrQkl6GBnK"
create_secret "VERCEL_PROJECT_ID" "prj_ceyPxYNG4BVzUC6vAAQQPX8mAy5o"
create_secret "DATABASE_URL" "postgresql://neondb_owner:npg_TPmMDniR7Ow9@ep-spring-river-aloa79ru.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require"
create_secret "NEXTAUTH_SECRET" "$(openssl rand -base64 32)"
create_secret "NEXTAUTH_URL" "https://horizonoo.cc"

echo ""
echo "========================================"
echo "配置完成！"
echo "========================================"
echo ""
echo "接下来："
echo "1. 访问 https://github.com/$REPO/actions"
echo "2. 点击 'Deploy to Vercel'"
echo "3. 点击 'Run workflow' 触发部署"
echo ""
echo "或等待下次代码推送自动部署"
echo ""
