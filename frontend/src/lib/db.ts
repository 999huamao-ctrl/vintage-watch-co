// 数据库服务层 - 当前使用内存存储，部署后切换到Prisma
// import { PrismaClient, UserRole, OrderStatus, PaymentStatus } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 临时类型定义
export type UserRole = "SUPERADMIN" | "ADMIN" | "SUPPLY" | "LOGISTICS" | "CUSTOMER";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

// 内存存储（部署数据库后移除）
const memoryStorage = {
  users: [] as any[],
  products: [] as any[],
  orders: [] as any[],
  inventoryLogs: [] as any[],
  suppliers: [] as any[],
  purchaseOrders: [] as any[],
  adCampaigns: [] as any[],
  dailyReports: [] as any[],
  userActivities: [] as any[],
  walletConfig: null as any,
};

// ============== 用户管理 ==============

export async function getUsers() {
  return memoryStorage.users;
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const user = { id: Date.now().toString(), ...data, createdAt: new Date() };
  memoryStorage.users.push(user);
  return user;
}

export async function updateUser(id: string, data: Partial<{
  email: string;
  role: UserRole;
  isActive: boolean;
}>) {
  const user = memoryStorage.users.find(u => u.id === id);
  if (user) Object.assign(user, data);
  return user;
}

export async function deleteUser(id: string) {
  memoryStorage.users = memoryStorage.users.filter(u => u.id !== id);
  return { success: true };
}

// ============== 商品管理 ==============

export async function getProducts() {
  return memoryStorage.products;
}

export async function getProductById(id: string) {
  return memoryStorage.products.find(p => p.id === id);
}

export async function createProduct(data: any) {
  const product = { id: Date.now().toString(), ...data, createdAt: new Date() };
  memoryStorage.products.push(product);
  return product;
}

export async function updateProduct(id: string, data: any) {
  const product = memoryStorage.products.find(p => p.id === id);
  if (product) Object.assign(product, data);
  return product;
}

export async function deleteProduct(id: string) {
  memoryStorage.products = memoryStorage.products.filter(p => p.id !== id);
  return { success: true };
}

// ============== 订单管理 ==============

export async function getOrders(filters?: any) {
  return memoryStorage.orders;
}

export async function getOrderById(id: string) {
  return memoryStorage.orders.find(o => o.id === id);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingInfo?: { trackingNumber: string; carrier: string }
) {
  const order = memoryStorage.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    if (trackingInfo) {
      order.trackingNumber = trackingInfo.trackingNumber;
      order.carrier = trackingInfo.carrier;
      order.shippedAt = new Date();
    }
  }
  return order;
}

// ============== 库存管理 ==============

export async function adjustStock(
  productId: string,
  quantity: number,
  reason: string,
  referenceId?: string
) {
  const product = memoryStorage.products.find(p => p.id === productId);
  if (product) {
    product.stock = (product.stock || 0) + quantity;
  }
  
  memoryStorage.inventoryLogs.push({
    id: Date.now().toString(),
    productId,
    type: quantity > 0 ? "IN" : "OUT",
    quantity: Math.abs(quantity),
    reason,
    referenceId,
    createdAt: new Date(),
  });

  return product;
}

export async function getInventoryLogs(productId?: string) {
  return memoryStorage.inventoryLogs.filter(l => !productId || l.productId === productId);
}

// ============== 供应链 ==============

export async function getSuppliers() {
  return memoryStorage.suppliers;
}

export async function createPurchaseOrder(data: any) {
  const po = { id: Date.now().toString(), ...data, createdAt: new Date() };
  memoryStorage.purchaseOrders.push(po);
  return po;
}

export async function receivePurchaseOrder(poId: string) {
  const po = memoryStorage.purchaseOrders.find(p => p.id === poId);
  if (po) {
    po.status = "RECEIVED";
    po.receivedAt = new Date();
  }
  return po;
}

// ============== 运营数据 ==============

export async function getDashboardStats() {
  return {
    totalOrders: memoryStorage.orders.length,
    todayOrders: 0,
    pendingOrders: memoryStorage.orders.filter(o => ["PENDING", "CONFIRMED", "PROCESSING"].includes(o.status)).length,
    totalRevenue: memoryStorage.orders.reduce((sum, o) => sum + (o.total || 0), 0),
    todayRevenue: 0,
    lowStockProducts: memoryStorage.products.filter(p => (p.stock || 0) <= 10),
  };
}

export async function createDailyReport(data: any) {
  const report = { id: Date.now().toString(), ...data };
  memoryStorage.dailyReports.push(report);
  return report;
}

export async function getDailyReports(startDate: Date, endDate: Date) {
  return memoryStorage.dailyReports.filter(r => r.date >= startDate && r.date <= endDate);
}

// ============== 客户行为追踪 ==============

export async function trackActivity(data: {
  sessionId: string;
  action: string;
  productId?: string;
  userId?: string;
  metadata?: any;
  ip?: string;
  userAgent?: string;
}) {
  const activity = { id: Date.now().toString(), ...data, createdAt: new Date() };
  memoryStorage.userActivities.push(activity);
  return activity;
}

// ============== 钱包配置 ==============

export async function getWalletConfig() {
  return memoryStorage.walletConfig;
}

export async function updateWalletConfig(
  data: {
    l1Receiving: string;
    l2Operating: string;
    l3Profit: string;
  },
  updatedBy: string
) {
  memoryStorage.walletConfig = {
    id: "1",
    ...data,
    updatedBy,
    updatedAt: new Date(),
  };
  return memoryStorage.walletConfig;
}
