import { PrismaClient, UserRole, OrderStatus, PaymentStatus, POStatus } from "@prisma/client";

// 延迟初始化 PrismaClient，避免构建时出错
let prisma: PrismaClient;

if (typeof window === 'undefined') {
  // 服务端环境
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  prisma = globalForPrisma.prisma ?? new PrismaClient();

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} else {
  // 客户端环境 - 创建一个空的 mock（不应该被使用）
  prisma = new PrismaClient();
}

export { prisma };

// 重新导出类型
export type { UserRole, OrderStatus, PaymentStatus };
export { POStatus };

// ============== 用户管理 ==============

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  return prisma.user.create({
    data,
  });
}

export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    role: UserRole;
    isActive: boolean;
    lastLoginAt: Date;
  }>
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

// ============== 商品管理 ==============

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function createProduct(data: {
  name: string;
  nameZh?: string;
  nameDe?: string;
  nameFr?: string;
  nameEs?: string;
  nameIt?: string;
  nameJa?: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  descriptionZh?: string;
  image: string;
  images?: string[];
  stock?: number;
  caseSize?: string;
  movement?: string;
  strap?: string;
  waterResistance?: string;
}) {
  return prisma.product.create({
    data,
  });
}

export async function updateProduct(id: string, data: Partial<{
  name: string;
  nameZh?: string;
  nameDe?: string;
  nameFr?: string;
  nameEs?: string;
  nameIt?: string;
  nameJa?: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  descriptionZh?: string;
  image: string;
  images?: string[];
  stock?: number;
  isActive?: boolean;
  caseSize?: string;
  movement?: string;
  strap?: string;
  waterResistance?: string;
}>) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

// ============== 订单管理 ==============

export async function getOrders(filters?: { status?: OrderStatus; userId?: string }) {
  return prisma.order.findMany({
    where: filters,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createOrder(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod?: string;
  subtotal: number;
  shippingCost?: number;
  discount?: number;
  total: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}) {
  const { items, ...orderData } = data;
  
  return prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: items,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingInfo?: { trackingNumber: string; carrier: string }
) {
  const updateData: any = { status };
  
  if (trackingInfo) {
    updateData.trackingNumber = trackingInfo.trackingNumber;
    updateData.carrier = trackingInfo.carrier;
    updateData.shippedAt = new Date();
  }
  
  if (status === "DELIVERED") {
    updateData.deliveredAt = new Date();
  }
  
  return prisma.order.update({
    where: { id },
    data: updateData,
  });
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
  paymentTxHash?: string
) {
  return prisma.order.update({
    where: { id },
    data: {
      paymentStatus,
      paymentTxHash,
    },
  });
}

// ============== 库存管理 ==============

export async function adjustStock(
  productId: string,
  quantity: number,
  reason: string,
  referenceId?: string
) {
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      stock: {
        increment: quantity,
      },
    },
  });
  
  await prisma.inventoryLog.create({
    data: {
      productId,
      type: quantity > 0 ? "IN" : "OUT",
      quantity: Math.abs(quantity),
      reason,
      referenceId,
    },
  });

  return product;
}

export async function getInventoryLogs(productId?: string) {
  return prisma.inventoryLog.findMany({
    where: productId ? { productId } : undefined,
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ============== 供应链 ==============

export async function getSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createSupplier(data: {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}) {
  return prisma.supplier.create({
    data,
  });
}

export async function updateSupplier(id: string, data: Partial<{
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}>) {
  return prisma.supplier.update({
    where: { id },
    data,
  });
}

export async function deleteSupplier(id: string) {
  return prisma.supplier.delete({
    where: { id },
  });
}

export async function getPurchaseOrders() {
  return prisma.purchaseOrder.findMany({
    include: {
      supplier: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPurchaseOrder(data: {
  poNumber: string;
  supplierId: string;
  totalAmount: number;
  notes?: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}) {
  const { items, ...poData } = data;
  
  return prisma.purchaseOrder.create({
    data: {
      ...poData,
      items: {
        create: items,
      },
    },
    include: {
      supplier: true,
      items: true,
    },
  });
}

export async function updatePurchaseOrderStatus(id: string, status: POStatus) {
  const updateData: any = { status };
  
  if (status === "RECEIVED") {
    updateData.receivedAt = new Date();
  }
  
  return prisma.purchaseOrder.update({
    where: { id },
    data: updateData,
  });
}

// ============== 广告活动 ==============

export async function getAdCampaigns() {
  return prisma.adCampaign.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdCampaign(data: {
  name: string;
  platform: string;
  status: string;
  budget: number;
  startDate: Date;
  endDate?: Date;
  utmCampaign?: string;
}) {
  return prisma.adCampaign.create({
    data,
  });
}

export async function updateAdCampaign(id: string, data: Partial<{
  name: string;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  endDate?: Date;
}>) {
  return prisma.adCampaign.update({
    where: { id },
    data,
  });
}

export async function deleteAdCampaign(id: string) {
  return prisma.adCampaign.delete({
    where: { id },
  });
}

// ============== 运营数据 ==============

export async function getDailyReports(startDate?: Date, endDate?: Date) {
  return prisma.dailyReport.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function createDailyReport(data: {
  date: Date;
  revenue: number;
  orders: number;
  visitors: number;
  adSpend: number;
  newCustomers: number;
  note?: string;
}) {
  return prisma.dailyReport.upsert({
    where: { date: data.date },
    update: data,
    create: data,
  });
}

export async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [totalOrders, totalProducts, totalUsers, todayReport] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.dailyReport.findUnique({
      where: { date: today },
    }),
  ]);
  
  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });
  
  const lowStockProducts = await prisma.product.count({
    where: {
      stock: { lt: 10 },
      isActive: true,
    },
  });
  
  return {
    totalOrders,
    totalProducts,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    todayRevenue: todayReport?.revenue || 0,
    todayOrders: todayReport?.orders || 0,
  };
}

// ============== 钱包配置 ==============

export async function getWalletConfig() {
  return prisma.walletConfig.findFirst();
}

export async function updateWalletConfig(data: {
  l1Receiving: string;
  l2Operating: string;
  l3Profit: string;
  updatedBy: string;
}) {
  const existing = await prisma.walletConfig.findFirst();
  
  if (existing) {
    return prisma.walletConfig.update({
      where: { id: existing.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
  
  return prisma.walletConfig.create({
    data,
  });
}

// ============== 用户行为追踪 ==============

export async function trackUserActivity(data: {
  userId?: string;
  sessionId: string;
  action: string;
  productId?: string;
  metadata?: any;
  ip?: string;
  userAgent?: string;
}) {
  return prisma.userActivity.create({
    data,
  });
}

export async function getUserActivities(filters?: { userId?: string; sessionId?: string }) {
  return prisma.userActivity.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
