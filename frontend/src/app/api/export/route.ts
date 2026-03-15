import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 静态导出时跳过此路由
export const dynamic = 'error';

// 简单的 CSV 转换函数
function toCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(h => {
    const val = obj[h];
    // 处理包含逗号或引号的值
    if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val ?? '';
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}

// 权限检查（简化版，实际应使用 JWT/session）
async function checkAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  // 实际应该验证 token 并返回用户信息
  // 这里简化处理
  return { role: 'ADMIN' };
}

// ==================== 订单导出 ====================

export async function GET(request: NextRequest) {
  const auth = await checkAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const type = searchParams.get('type') || 'orders';
  
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const status = searchParams.get('status');
  
  try {
    let data: any[] = [];
    let filename = '';
    
    switch (type) {
      case 'orders':
        data = await exportOrders({ startDate, endDate, status });
        filename = `orders_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'products':
        data = await exportProducts();
        filename = `products_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'inventory':
        data = await exportInventory({ startDate, endDate });
        filename = `inventory_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'customers':
        data = await exportCustomers();
        filename = `customers_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'daily-stats':
        data = await exportDailyStats({ startDate, endDate });
        filename = `daily_stats_${new Date().toISOString().split('T')[0]}`;
        break;
      default:
        return NextResponse.json({ error: 'Unknown export type' }, { status: 400 });
    }
    
    if (format === 'csv') {
      const csv = toCSV(data);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    }
    
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

async function exportOrders(filters: { startDate?: string | null; endDate?: string | null; status?: string | null }) {
  const where: any = {};
  
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: { product: { select: { sku: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return orders.map((order: any) => ({
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString(),
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerCountry: order.customerCountry,
    items: order.items.map((i: any) => `${i.name} x${i.quantity}`).join('; '),
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    trackingNumber: order.trackingNumber || '',
    carrier: order.carrier || '',
    utmSource: order.utmSource || '',
    utmCampaign: order.utmCampaign || '',
  }));
}

async function exportProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      supplierItems: {
        include: { supplier: true }
      }
    }
  });
  
  return products.map((p: any) => ({
    sku: p.sku,
    name: p.baseName,
    category: p.category.name,
    price: p.price,
    comparePrice: p.comparePrice || '',
    costPrice: p.costPrice || '',
    stock: p.stock,
    lowStockAlert: p.lowStockAlert,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    supplier: p.supplierItems[0]?.supplier.name || '',
    supplierCost: p.supplierItems[0]?.costPrice || '',
  }));
}

async function exportInventory(filters: { startDate?: string | null; endDate?: string | null }) {
  const where: any = {};
  
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }
  
  const logs = await prisma.inventoryLog.findMany({
    where,
    include: { product: { select: { sku: true, baseName: true } } },
    orderBy: { createdAt: 'desc' }
  });
  
  return logs.map((log: any) => ({
    date: log.createdAt.toISOString(),
    sku: log.product.sku,
    productName: log.product.baseName,
    type: log.type,
    quantity: log.quantity,
    reason: log.reason,
    referenceId: log.referenceId || '',
  }));
}

async function exportCustomers() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
        select: { total: true }
      }
    }
  });
  
  return users.map((u: any) => ({
    email: u.email,
    role: u.role,
    country: u.country || '',
    language: u.language,
    totalOrders: u.orders.length,
    totalSpent: u.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0),
    createdAt: u.createdAt.toISOString(),
  }));
}

async function exportDailyStats(filters: { startDate?: string | null; endDate?: string | null }) {
  const where: any = {};
  
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }
  
  const stats = await prisma.dailyStats.findMany({
    where,
    orderBy: { date: 'asc' }
  });
  
  return stats.map((s: any) => ({
    date: s.date.toISOString().split('T')[0],
    visitors: s.visitors,
    pageViews: s.pageViews,
    orders: s.orders,
    revenue: s.revenue,
    adSpend: s.adSpend,
    conversionRate: s.conversionRate,
    aov: s.aov,
    roas: s.roas,
  }));
}
