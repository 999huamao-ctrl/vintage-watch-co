import { PrismaClient } from '@prisma/client';

// 防止开发环境热重载创建多个实例
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// ==================== 用户管理 ====================

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { orders: { take: 5, orderBy: { createdAt: 'desc' } } }
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  role?: 'SUPERADMIN' | 'ADMIN' | 'SUPPLY' | 'LOGISTICS' | 'CUSTOMER';
  language?: string;
  country?: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password, // 应该已经哈希
      role: data.role || 'CUSTOMER',
      language: data.language || 'en',
      country: data.country,
    }
  });
}

// ==================== 商品管理 ====================

export async function getProducts(options?: {
  category?: string;
  language?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
}) {
  const where: any = {};
  
  if (options?.category) {
    where.category = { slug: options.category };
  }
  if (options?.isActive !== undefined) {
    where.isActive = options.isActive;
  }
  if (options?.isFeatured) {
    where.isFeatured = true;
  }
  if (options?.search) {
    where.OR = [
      { baseName: { contains: options.search, mode: 'insensitive' } },
      { sku: { contains: options.search, mode: 'insensitive' } },
    ];
  }
  
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      translations: options?.language 
        ? { where: { language: options.language } }
        : true,
      _count: { select: { orderItems: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return products.map(p => ({
    ...p,
    name: p.translations[0]?.name || p.baseName,
    description: p.translations[0]?.description || p.baseDesc,
  }));
}

export async function getProductBySlug(slug: string, language?: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      translations: language 
        ? { where: { language } }
        : true,
      supplierItems: {
        include: { supplier: true }
      }
    }
  });
  
  if (!product) return null;
  
  return {
    ...product,
    name: product.translations[0]?.name || product.baseName,
    description: product.translations[0]?.description || product.baseDesc,
  };
}

export async function updateProductStock(productId: string, quantity: number, reason: string, referenceId?: string) {
  return prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } }
    }),
    prisma.inventoryLog.create({
      data: {
        productId,
        type: quantity > 0 ? 'ADJUSTMENT' : 'SALE',
        quantity,
        reason,
        referenceId
      }
    })
  ]);
}

// ==================== 订单管理 ====================

export async function createOrder(data: {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerAddress: string;
  customerCity: string;
  customerPostal: string;
  customerCountry: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: 'USDT' | 'PAYPAL' | 'CREDIT_CARD';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  // 生成订单号
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderNumber = `ORD-${dateStr}-${random}`;
  
  // 获取商品信息并计算价格
  const productIds = data.items.map(i => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });
  
  let subtotal = 0;
  const orderItems = data.items.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    const price = product.price;
    subtotal += Number(price) * item.quantity;
    return {
      productId: item.productId,
      name: product.baseName,
      price: price,
      costPrice: product.costPrice,
      quantity: item.quantity
    };
  });
  
  // 运费计算（满100欧免邮）
  const shippingThreshold = 100;
  const shippingRate = 8;
  const shipping = subtotal >= shippingThreshold ? 0 : shippingRate;
  const total = subtotal + shipping;
  
  return prisma.order.create({
    data: {
      orderNumber,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      customerCity: data.customerCity,
      customerPostal: data.customerPostal,
      customerCountry: data.customerCountry,
      subtotal,
      shipping,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'PENDING',
      status: 'PENDING',
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      items: {
        create: orderItems
      }
    },
    include: { items: { include: { product: true } } }
  });
}

export async function getOrders(options?: {
  status?: string;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  customerEmail?: string;
  page?: number;
  limit?: number;
}) {
  const where: any = {};
  
  if (options?.status) where.status = options.status;
  if (options?.paymentStatus) where.paymentStatus = options.paymentStatus;
  if (options?.customerEmail) where.customerEmail = options.customerEmail;
  if (options?.startDate || options?.endDate) {
    where.createdAt = {};
    if (options.startDate) where.createdAt.gte = options.startDate;
    if (options.endDate) where.createdAt.lte = options.endDate;
  }
  
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;
  
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);
  
  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  note?: string,
  additionalData?: { trackingNumber?: string; carrier?: string }
) {
  const data: any = { status };
  if (additionalData?.trackingNumber) data.trackingNumber = additionalData.trackingNumber;
  if (additionalData?.carrier) data.carrier = additionalData.carrier;
  if (status === 'SHIPPED') data.shippedAt = new Date();
  if (status === 'DELIVERED') data.deliveredAt = new Date();

  return prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: status as any,
        note
      }
    })
  ]);
}

export async function confirmPayment(orderId: string, txid?: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'PAID',
      status: 'PAID',
      txid,
      paidAt: new Date()
    }
  });
}

// ==================== 供应链 ====================

export async function createPurchaseOrder(data: {
  supplierId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  shippingMethod?: string;
}) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const poNumber = `PO-${dateStr}-${random}`;
  
  const totalAmount = data.items.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice), 0
  );
  
  return prisma.purchaseOrder.create({
    data: {
      poNumber,
      supplierId: data.supplierId,
      status: 'DRAFT',
      totalAmount,
      shippingMethod: data.shippingMethod,
      items: {
        create: data.items
      }
    },
    include: {
      supplier: true,
      items: true
    }
  });
}

export async function receivePurchaseOrder(poId: string, receivedItems: { itemId: string; receivedQty: number }[]) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: poId },
    include: { items: true }
  });
  
  if (!po) throw new Error('Purchase order not found');
  
  const updates = receivedItems.map(async (received) => {
    const item = po.items.find(i => i.id === received.itemId);
    if (!item) return;
    
    // 更新采购明细
    await prisma.purchaseOrderItem.update({
      where: { id: received.itemId },
      data: { receivedQty: received.receivedQty }
    });
    
    // 增加库存
    if (received.receivedQty > 0) {
      await updateProductStock(
        item.productId,
        received.receivedQty,
        `Purchase Order ${po.poNumber}`,
        po.id
      );
    }
  });
  
  await Promise.all(updates);
  
  // 检查是否全部收货
  const updatedItems = await prisma.purchaseOrderItem.findMany({
    where: { purchaseOrderId: poId }
  });
  const allReceived = updatedItems.every(i => i.receivedQty >= i.quantity);
  
  return prisma.purchaseOrder.update({
    where: { id: poId },
    data: {
      status: allReceived ? 'RECEIVED' : 'SHIPPED',
      receivedAt: allReceived ? new Date() : undefined
    }
  });
}

// ==================== 运营数据 ====================

export async function recordDailyStats(date: Date, data: {
  visitors?: number;
  pageViews?: number;
  orders?: number;
  revenue?: number;
  adSpend?: number;
}) {
  const existing = await prisma.dailyStats.findUnique({
    where: { date }
  });
  
  if (existing) {
    return prisma.dailyStats.update({
      where: { date },
      data: {
        visitors: { increment: data.visitors || 0 },
        pageViews: { increment: data.pageViews || 0 },
        orders: { increment: data.orders || 0 },
        revenue: { increment: data.revenue || 0 },
        adSpend: { increment: data.adSpend || 0 },
      }
    });
  }
  
  return prisma.dailyStats.create({
    data: {
      date,
      visitors: data.visitors || 0,
      pageViews: data.pageViews || 0,
      orders: data.orders || 0,
      revenue: data.revenue || 0,
      adSpend: data.adSpend || 0,
    }
  });
}

export async function getDailyStats(startDate: Date, endDate: Date) {
  return prisma.dailyStats.findMany({
    where: {
      date: { gte: startDate, lte: endDate }
    },
    orderBy: { date: 'asc' }
  });
}

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [
    todayStats,
    yesterdayStats,
    monthStats,
    pendingOrders,
    lowStockProducts,
    recentOrders
  ] = await Promise.all([
    // 今日
    prisma.order.aggregate({
      where: { createdAt: { gte: today }, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _count: { id: true },
      _sum: { total: true }
    }),
    // 昨日
    prisma.order.aggregate({
      where: { 
        createdAt: { gte: yesterday, lt: today }, 
        status: { notIn: ['CANCELLED', 'REFUNDED'] } 
      },
      _count: { id: true },
      _sum: { total: true }
    }),
    // 本月
    prisma.order.aggregate({
      where: { createdAt: { gte: thisMonth }, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _count: { id: true },
      _sum: { total: true }
    }),
    // 待处理订单
    prisma.order.count({ where: { status: { in: ['PAID', 'CONFIRMED'] } } }),
    // 低库存商品
    prisma.product.count({ where: { stock: { lte: prisma.product.fields.lowStockAlert }, isActive: true } }),
    // 最近订单
    prisma.order.findMany({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true }
    })
  ]);
  
  return {
    today: {
      orders: todayStats._count.id,
      revenue: todayStats._sum.total || 0
    },
    yesterday: {
      orders: yesterdayStats._count.id,
      revenue: yesterdayStats._sum.total || 0
    },
    thisMonth: {
      orders: monthStats._count.id,
      revenue: monthStats._sum.total || 0
    },
    pendingOrders,
    lowStockProducts,
    recentOrders
  };
}

// ==================== 客户行为追踪 ====================

export async function trackEvent(data: {
  eventType: string;
  userId?: string;
  sessionId: string;
  productId?: string;
  url?: string;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  return prisma.customerBehavior.create({
    data: {
      eventType: data.eventType,
      userId: data.userId,
      sessionId: data.sessionId,
      productId: data.productId,
      url: data.url,
      referrer: data.referrer,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      country: data.country,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    }
  });
}
