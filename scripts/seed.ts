import { PrismaClient, UserRole, OrderStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始填充默认数据...");

  // 1. 创建管理员用户
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@horizonwatches.com",
      password: adminPassword,
      role: UserRole.SUPERADMIN,
      isActive: true,
    },
  });
  console.log("✅ 管理员用户创建完成:", admin.username);

  // 2. 创建产品
  const products = [
    {
      id: "prod-001",
      name: "Rolex Submariner Black",
      nameZh: "劳力士潜航者黑水鬼",
      description: "Classic diving watch with black dial and bezel. Features 40mm case, automatic movement, 300m water resistance.",
      descriptionZh: "经典潜水腕表，黑色表盘和表圈。40mm表壳，自动机械机芯，300米防水。",
      price: 12999.00,
      originalPrice: 15999.00,
      category: "Submariner",
      image: "/products/submariner-black.jpg",
      images: ["/products/submariner-black.jpg"],
      stock: 15,
      isActive: true,
      caseSize: "40mm",
      movement: "Automatic",
      strap: "Oyster Bracelet",
      waterResistance: "300m",
    },
    {
      id: "prod-002",
      name: "Rolex Submariner Green",
      nameZh: "劳力士潜航者绿水鬼",
      description: "Iconic green bezel Submariner. The most recognizable luxury dive watch in the world.",
      descriptionZh: "标志性绿色表圈潜航者。全球最具辨识度的 luxury 潜水腕表。",
      price: 13999.00,
      originalPrice: 16999.00,
      category: "Submariner",
      image: "/products/submariner-green.jpg",
      images: ["/products/submariner-green.jpg"],
      stock: 8,
      isActive: true,
      caseSize: "40mm",
      movement: "Automatic",
      strap: "Oyster Bracelet",
      waterResistance: "300m",
    },
    {
      id: "prod-003",
      name: "Rolex Daytona Black",
      nameZh: "劳力士迪通拿黑盘",
      description: "Legendary chronograph with black dial. The ultimate racing watch.",
      descriptionZh: "传奇计时码表，黑色表盘。终极赛车腕表。",
      price: 18999.00,
      originalPrice: 22999.00,
      category: "Daytona",
      image: "/products/daytona-black.jpg",
      images: ["/products/daytona-black.jpg"],
      stock: 5,
      isActive: true,
      caseSize: "40mm",
      movement: "Automatic Chronograph",
      strap: "Oyster Bracelet",
      waterResistance: "100m",
    },
    {
      id: "prod-004",
      name: "Rolex GMT-Master II Pepsi",
      nameZh: "劳力士格林尼治可乐圈",
      description: "Dual timezone watch with iconic red-blue bezel. Perfect for travelers.",
      descriptionZh: "双时区腕表，标志性红蓝表圈。旅行者的完美选择。",
      price: 15999.00,
      originalPrice: 19999.00,
      category: "GMT-Master",
      image: "/products/gmt-pepsi.jpg",
      images: ["/products/gmt-pepsi.jpg"],
      stock: 12,
      isActive: true,
      caseSize: "40mm",
      movement: "Automatic GMT",
      strap: "Jubilee Bracelet",
      waterResistance: "100m",
    },
    {
      id: "prod-005",
      name: "Rolex Datejust Blue",
      nameZh: "劳力士日志型蓝盘",
      description: "Elegant dress watch with blue dial. The classic choice for any occasion.",
      descriptionZh: "优雅正装腕表，蓝色表盘。任何场合的经典选择。",
      price: 9999.00,
      originalPrice: 12999.00,
      category: "Datejust",
      image: "/products/datejust-blue.jpg",
      images: ["/products/datejust-blue.jpg"],
      stock: 20,
      isActive: true,
      caseSize: "41mm",
      movement: "Automatic",
      strap: "Jubilee Bracelet",
      waterResistance: "100m",
    },
    {
      id: "prod-006",
      name: "Rolex Day-Date Gold",
      nameZh: "劳力士星期日历型金表",
      description: "The President's watch. 18k gold with day and date display.",
      descriptionZh: "总统腕表。18k金材质，星期和日期显示。",
      price: 24999.00,
      originalPrice: 29999.00,
      category: "Day-Date",
      image: "/products/daydate-gold.jpg",
      images: ["/products/daydate-gold.jpg"],
      stock: 3,
      isActive: true,
      caseSize: "40mm",
      movement: "Automatic",
      strap: "President Bracelet",
      waterResistance: "100m",
    },
    {
      id: "prod-007",
      name: "Rolex Explorer",
      nameZh: "劳力士探险家",
      description: "Built for explorers. Clean black dial with luminous markers.",
      descriptionZh: "为探险家打造。简洁黑色表盘，夜光时标。",
      price: 8999.00,
      originalPrice: 10999.00,
      category: "Explorer",
      image: "/products/explorer.jpg",
      images: ["/products/explorer.jpg"],
      stock: 18,
      isActive: true,
      caseSize: "39mm",
      movement: "Automatic",
      strap: "Oyster Bracelet",
      waterResistance: "100m",
    },
    {
      id: "prod-008",
      name: "Rolex Yacht-Master",
      nameZh: "劳力士游艇名仕",
      description: "Nautical elegance. Platinum bezel with blue dial.",
      descriptionZh: "航海优雅。铂金表圈配蓝色表盘。",
      price: 16999.00,
      originalPrice: 19999.00,
      category: "Yacht-Master",
      image: "/products/yachtmaster.jpg",
      images: ["/products/yachtmaster.jpg"],
      stock: 6,
      isActive: true,
      caseSize: "40mm",
      movement: "Automatic",
      strap: "Oysterflex",
      waterResistance: "100m",
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: prod,
    });
  }
  console.log("✅ 产品创建完成:", products.length, "个");

  // 3. 创建示例订单
  const sampleOrders = [
    {
      orderNumber: "HW-2025-001",
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      customerName: "John Smith",
      customerEmail: "john@example.com",
      customerPhone: "+44 7700 900001",
      shippingAddress: "123 Oxford Street",
      shippingCity: "London",
      shippingZip: "W1D 1BS",
      shippingCountry: "UK",
      subtotal: 12999.00,
      shippingCost: 0,
      discount: 0,
      total: 12999.00,
      items: {
        create: [
          {
            productId: "prod-001",
            quantity: 1,
            price: 12999.00,
          },
        ],
      },
    },
    {
      orderNumber: "HW-2025-002",
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      customerName: "Marie Dubois",
      customerEmail: "marie@example.fr",
      customerPhone: "+33 6 12 34 56 78",
      shippingAddress: "45 Rue de Rivoli",
      shippingCity: "Paris",
      shippingZip: "75001",
      shippingCountry: "France",
      subtotal: 13999.00,
      shippingCost: 0,
      discount: 500,
      total: 13499.00,
      items: {
        create: [
          {
            productId: "prod-002",
            quantity: 1,
            price: 13999.00,
          },
        ],
      },
    },
    {
      orderNumber: "HW-2025-003",
      status: OrderStatus.SHIPPED,
      paymentStatus: PaymentStatus.PAID,
      customerName: "Hans Mueller",
      customerEmail: "hans@example.de",
      customerPhone: "+49 170 1234567",
      shippingAddress: "Alexanderplatz 7",
      shippingCity: "Berlin",
      shippingZip: "10178",
      shippingCountry: "Germany",
      trackingNumber: "TRK-123456789",
      carrier: "DHL Express",
      subtotal: 18999.00,
      shippingCost: 0,
      discount: 0,
      total: 18999.00,
      items: {
        create: [
          {
            productId: "prod-003",
            quantity: 1,
            price: 18999.00,
          },
        ],
      },
    },
  ];

  for (const orderData of sampleOrders) {
    await prisma.order.create({
      data: orderData,
    });
  }
  console.log("✅ 示例订单创建完成:", sampleOrders.length, "个");

  // 4. 创建钱包配置
  await prisma.walletConfig.create({
    data: {
      id: "default",
      l1Receiving: "TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c",
      l2Operating: "TCWgr2qGcheRsD7kceoFpJfMg59fFrJGCq",
      l3Profit: "TUyTqV47pd7o3Bg6Uhw5XJ9rwkdgi6tsKb",
      updatedBy: admin.id,
    },
  });
  console.log("✅ 钱包配置创建完成");

  // 5. 创建供应商
  const supplier = await prisma.supplier.create({
    data: {
      name: "Guangzhou Watch Factory",
      contactName: "Mr. Chen",
      email: "chen@watchfactory.com",
      phone: "+86 138 0000 0000",
      address: "Guangzhou, China",
      notes: "Main supplier for Rolex replicas",
      isActive: true,
    },
  });
  console.log("✅ 供应商创建完成:", supplier.name);

  // 6. 创建采购单
  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber: "PO-2025-001",
      supplierId: supplier.id,
      status: "RECEIVED",
      totalAmount: 50000.00,
      notes: "Initial stock order",
      items: {
        create: [
          { productName: "Rolex Submariner Black", quantity: 20, unitPrice: 200, totalPrice: 4000 },
          { productName: "Rolex Submariner Green", quantity: 15, unitPrice: 220, totalPrice: 3300 },
          { productName: "Rolex Daytona Black", quantity: 10, unitPrice: 350, totalPrice: 3500 },
        ],
      },
    },
  });
  console.log("✅ 采购单创建完成:", po.poNumber);

  console.log("\n🎉 所有默认数据填充完成！");
}

main()
  .catch((e) => {
    console.error("❌ 填充失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
