// CREEM API 配置文件
// 需要在 Vercel 环境变量中设置 CREEM_API_KEY

export const CREEM_CONFIG = {
  API_BASE: process.env.CREEM_API_BASE || 'https://api.creem.io',
  API_KEY: process.env.CREEM_API_KEY || '',
  WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET || '',
};

// 检查 CREEM 是否已配置
export function isCreemConfigured(): boolean {
  return !!CREEM_CONFIG.API_KEY;
}