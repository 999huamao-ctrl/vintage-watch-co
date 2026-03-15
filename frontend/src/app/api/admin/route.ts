import { NextRequest, NextResponse } from 'next/server';
import { prisma, getDashboardStats, getOrders, updateOrderStatus, confirmPayment } from '@/lib/db';

// SSR 模式下使用动态渲染
export const dynamic = 'force-dynamic';

// ==================== 仪表盘数据 ====================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';
  
  try {
    switch (action) {
      case 'dashboard':
        return NextResponse.json(await getDashboardStats());
        
      case 'orders':
        const status = searchParams.get('status') || undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        return NextResponse.json(await getOrders({ status, page, limit }));
        
      case 'inventory':
        return NextResponse.json(await getInventoryAlert());
        
      case 'stats':
        const days = parseInt(searchParams.get('days') || '30');
        return NextResponse.json(await getSalesStats(days));
        
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ==================== 订单操作 ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, orderId, data } = body;
    
    switch (action) {
      case 'updateStatus':
        const { status, note, trackingNumber, carrier } = data;
        const updated = await updateOrderStatus(
          orderId, 
          status, 
          note,
          { trackingNumber, carrier }
        );
        return NextResponse.json({ success: true, order: updated });
        
      case 'confirmPayment':
        const { txid } = data;
        const order = await confirmPayment(orderId, txid);
        return NextResponse.json({ success: true, order });
        
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ==================== 辅助函数 ====================

async function getInventoryAlert() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: { lte: prisma.product.fields.lowStockAlert }
    },
    include: {
      category: true,
      supplierItems: {
        include: { supplier: true }
      }
    },
    orderBy: { stock: 'asc' }
  });
  
  return products.map((p: any) => ({
    id: p.id,
    sku: p.sku,
    name: p.baseName,
    stock: p.stock,
    lowStockAlert: p.lowStockAlert,
    category: p.category.name,
    supplier: p.supplierItems[0]?.supplier.name || 'N/A',
    supplierContact: p.supplierItems[0]?.supplier.email || ''
  }));
}

async function getSalesStats(days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  const [ordersByDay, topProducts, revenueByCountry] = await Promise.all([
    // 每日订单趋势
    prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM "Order"
      WHERE created_at >= ${startDate}
        AND status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    
    // 热销商品
    prisma.$queryRaw`
      SELECT 
        p.sku,
        p."baseName" as name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM "OrderItem" oi
      JOIN "Product" p ON p.id = oi."productId"
      JOIN "Order" o ON o.id = oi."orderId"
      WHERE o.created_at >= ${startDate}
        AND o.status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY p.id, p.sku, p."baseName"
      ORDER BY total_sold DESC
      LIMIT 10
    `,
    
    // 按国家统计
    prisma.$queryRaw`
      SELECT 
        customer_country as country,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM "Order"
      WHERE created_at >= ${startDate}
        AND status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY customer_country
      ORDER BY revenue DESC
    `
  ]);
  
  // 计算汇总
  const summary = await prisma.order.aggregate({
    where: {
      createdAt: { gte: startDate },
      status: { notIn: ['CANCELLED', 'REFUNDED'] }
    },
    _count: { id: true },
    _sum: { total: true }
  });
  
  return {
    period: `Last ${days} days`,
    summary: {
      totalOrders: summary._count.id,
      totalRevenue: Number(summary._sum.total || 0),
      avgOrderValue: summary._count.id > 0 
        ? Number(summary._sum.total || 0) / summary._count.id 
        : 0
    },
    ordersByDay,
    topProducts,
    revenueByCountry
  };
}
