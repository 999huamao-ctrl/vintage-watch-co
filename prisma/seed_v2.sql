-- ============================================
-- Horizon Watches 数据库初始化脚本 v2
-- 修正：使用正确的 ID、价格和图片路径
-- ============================================

-- 1. 创建默认管理员用户
-- 密码: admin123 (bcrypt hash)
INSERT INTO "users" ("id", "username", "email", "password", "role", "createdAt", "updatedAt", "isActive")
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@horizonwatches.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'SUPERADMIN',
  NOW(),
  NOW(),
  true
) ON CONFLICT ("username") DO NOTHING;

-- 2. 创建默认钱包配置
INSERT INTO "wallet_config" ("id", "l1Receiving", "l2Operating", "l3Profit", "updatedAt", "updatedBy")
VALUES (
  gen_random_uuid(),
  'TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c',
  'TCWgr2qGcheRsD7kceoFpJfMg59fFrJGCq',
  'TUyTqV47pd7o3Bg6Uhw5XJ9rwkdgi6tsKb',
  NOW(),
  'admin'
) ON CONFLICT DO NOTHING;

-- 3. 清空现有商品数据并重新导入（修正版）
TRUNCATE TABLE "products" CASCADE;

INSERT INTO "products" ("id", "name", "price", "originalPrice", "category", "description", "image", "images", "stock", "isActive", "caseSize", "movement", "strap", "waterResistance", "createdAt", "updatedAt")
VALUES 
-- Daytona Black
('daytona-black', 'Daytona Black Steel', 1350.00, 3500.00, 'Men', 'Iconic chronograph with 4131 automatic movement. 904L stainless steel case, sapphire crystal, 100m water resistance. The ultimate racing chronograph.', '/products/laoli/image1.webp', ARRAY['/products/laoli/image1.webp', '/products/laoli/image2.jpeg', '/products/laoli/image3.jpeg'], 50, true, '40mm', '4131 Automatic', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Submariner Black
('submariner-black', 'Submariner Black', 1165.00, 2500.00, 'Men', 'Legendary dive watch with 3235 automatic movement. 300m water resistance, ceramic bezel, date function. The reference among divers'' watches.', '/products/laoli/image4.jpeg', ARRAY['/products/laoli/image4.jpeg', '/products/laoli/image5.jpeg', '/products/laoli/image6.webp'], 50, true, '41mm', '3235 Automatic', '904L Stainless Steel', '300M', NOW(), NOW()),

-- Submariner Green
('submariner-green', 'Submariner Green', 1165.00, 2800.00, 'Men', 'Stunning green bezel and dial with 3235 automatic movement. 300m water resistance, iconic design that commands attention.', '/products/laoli/image7.jpeg', ARRAY['/products/laoli/image7.jpeg', '/products/laoli/image8.jpeg', '/products/laoli/image9.jpeg'], 50, true, '41mm', '3235 Automatic', '904L Stainless Steel', '300M', NOW(), NOW()),

-- Submariner No-Date
('submariner-no-date', 'Submariner No-Date', 1165.00, 2200.00, 'Men', 'Pure, clean design with 3230 automatic movement. No date window for perfect symmetry. 300m water resistance, timeless elegance.', '/products/laoli/image10.jpeg', ARRAY['/products/laoli/image10.jpeg', '/products/laoli/image11.jpeg', '/products/laoli/image12.jpeg'], 50, true, '41mm', '3230 Automatic', '904L Stainless Steel', '300M', NOW(), NOW()),

-- GMT Pepsi
('gmt-pepsi', 'GMT-Master II Pepsi', 1440.00, 3500.00, 'Men', 'Dual-time zone with iconic red-blue ceramic bezel. 3285 automatic GMT movement, perfect for international travelers.', '/products/laoli/image13.jpeg', ARRAY['/products/laoli/image13.jpeg', '/products/laoli/image14.jpeg', '/products/laoli/image15.jpeg'], 50, true, '40mm', '3285 Automatic GMT', '904L Stainless Steel', '100M', NOW(), NOW()),

-- GMT Batman
('gmt-batman', 'GMT-Master II Batman', 1440.00, 3500.00, 'Men', 'Black-blue ceramic bezel dual-time watch. 3285 automatic GMT movement, sleek design for the modern explorer.', '/products/laoli/image16.jpeg', ARRAY['/products/laoli/image16.jpeg', '/products/laoli/image17.jpeg', '/products/laoli/image18.jpeg'], 50, true, '40mm', '3285 Automatic GMT', '904L Stainless Steel', '100M', NOW(), NOW()),

-- GMT Sprite
('gmt-sprite', 'GMT-Master II Sprite', 1440.00, 3200.00, 'Men', 'Unique black-green ceramic bezel with left-handed crown. 3285 automatic GMT movement, stand out from the crowd.', '/products/laoli/image19.jpeg', ARRAY['/products/laoli/image19.jpeg', '/products/laoli/image20.jpeg', '/products/laoli/image21.jpeg'], 50, true, '40mm', '3285 Automatic GMT', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Datejust 41 Blue
('datejust-41-blue', 'Datejust 41 Blue', 1440.00, 3000.00, 'Men', '41mm dress watch with stunning blue sunburst dial. 3235 automatic movement, fluted bezel, refined sophistication.', '/products/laoli/image22.jpeg', ARRAY['/products/laoli/image22.jpeg', '/products/laoli/image23.jpeg', '/products/laoli/image24.jpeg'], 50, true, '41mm', '3235 Automatic', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Datejust 36 Blue
('datejust-36-blue', 'Datejust 36 Blue', 1260.00, 2800.00, 'Men', '36mm classic size with blue sunburst dial. 3235 automatic movement, perfect proportions for elegant wrists.', '/products/laoli/image25.jpeg', ARRAY['/products/laoli/image25.jpeg', '/products/laoli/image26.jpeg', '/products/laoli/image27.jpeg'], 50, true, '36mm', '3235 Automatic', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Explorer 36
('explorer-36', 'Explorer 36', 1360.00, 2800.00, 'Men', '36mm field watch with iconic 3-6-9 Arabic numerals. 3230 automatic movement, built for exploration.', '/products/laoli/image28.jpeg', ARRAY['/products/laoli/image28.jpeg', '/products/laoli/image29.jpeg', '/products/laoli/image30.jpeg'], 50, true, '36mm', '3230 Automatic', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Explorer II White
('explorer-ii-white', 'Explorer II White', 1360.00, 3200.00, 'Men', '42mm white dial with orange 24-hour hand. 3285 automatic GMT movement, designed for cave exploration.', '/products/laoli/image31.jpeg', ARRAY['/products/laoli/image31.jpeg', '/products/laoli/image32.jpeg', '/products/laoli/image33.jpeg'], 50, true, '42mm', '3285 Automatic GMT', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Sea-Dweller Red
('sea-dweller-red', 'Sea-Dweller Single Red', 1165.00, 3500.00, 'Men', '43mm professional deep dive watch with single red line. 3235 automatic movement, 1220m water resistance.', '/products/laoli/image34.webp', ARRAY['/products/laoli/image34.webp', '/products/laoli/image35.jpeg', '/products/laoli/image36.jpeg'], 50, true, '43mm', '3235 Automatic', '904L Stainless Steel', '1220M', NOW(), NOW()),

-- Sky-Dweller Blue
('sky-dweller-blue', 'Sky-Dweller Blue', 1660.00, 3800.00, 'Men', '42mm annual calendar with dual-time display. 9001 automatic movement, most sophisticated complication.', '/products/laoli/image37.jpeg', ARRAY['/products/laoli/image37.jpeg', '/products/laoli/image38.jpeg', '/products/laoli/image39.jpeg'], 50, true, '42mm', '9001 Automatic', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Oyster Perpetual 41 Turquoise
('oyster-perpetual-turquoise', 'Oyster Perpetual 41 Turquoise', 1360.00, 2200.00, 'Unisex', '41mm vibrant turquoise dial, 3230 automatic movement. Colorful expression of timeless oyster design.', '/products/laoli/image40.jpeg', ARRAY['/products/laoli/image40.jpeg', '/products/laoli/image41.jpeg', '/products/laoli/image42.jpeg'], 50, true, '41mm', '3230 Automatic', '904L Stainless Steel', '100M', NOW(), NOW()),

-- Test Product
('test-product-1euro', 'TEST PRODUCT - DO NOT BUY', 1.00, 99.00, 'Test', 'Internal testing product for payment flow verification. Not for sale to customers.', '/products/laoli/image1.webp', ARRAY['/products/laoli/image1.webp'], 999, true, 'Test', 'Test', 'Test', 'Test', NOW(), NOW());

-- 4. 创建示例订单（用于测试）
INSERT INTO "orders" ("id", "orderNumber", "status", "customerName", "customerEmail", "customerPhone", "shippingAddress", "shippingCity", "shippingZip", "shippingCountry", "paymentMethod", "paymentStatus", "subtotal", "shippingCost", "discount", "total", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
  'PENDING',
  'John Doe',
  'john@example.com',
  '+49 123 456789',
  '123 Main Street',
  'Berlin',
  '10115',
  'Germany',
  'USDT',
  'PENDING',
  1350.00,
  0,
  0,
  1350.00,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "orders" LIMIT 1);

-- 完成
SELECT 'Database initialization completed with correct prices!' AS status;
