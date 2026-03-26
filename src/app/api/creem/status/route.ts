import { NextResponse } from 'next/server';
import { CREEM_CONFIG } from '@/lib/creem';

// 检查 CREEM 配置状态（供前端使用）
export async function GET() {
  const isConfigured = !!CREEM_CONFIG.API_KEY;
  
  return NextResponse.json({
    configured: isConfigured,
    apiBase: CREEM_CONFIG.API_BASE,
  });
}