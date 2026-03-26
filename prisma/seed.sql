-- ============================================
-- Horizon Watches 数据库初始化脚本
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

-- 3. 导入商品数据
INSERT INTO "products" ("id", "name", "price", "category", "description", "image", "images", "stock", "isActive", "caseSize", "movement", "strap", "waterResistance", "createdAt", "updatedAt")
VALUES 
-- The Heritage 42
(gen_random_uuid(), 'The Heritage 42', 79.00, 'Wristwatch', 'A timeless vintage dress watch featuring a 42mm case, automatic movement, and genuine leather strap. Perfect for the modern gentleman who appreciates classic design. Specifications: Case Size: 42mm, Movement: Automatic mechanical, Strap: Genuine leather, Water Resistance: 3ATM, Crystal: Mineral glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/heritage-42.jpg', ARRAY['/images/products/heritage-42.jpg'], 100, true, '42mm', 'Automatic mechanical', 'Genuine leather', '3ATM', NOW(), NOW()),

-- The Classic Chrono
(gen_random_uuid(), 'The Classic Chrono', 89.00, 'Wristwatch', 'A sophisticated vintage chronograph featuring precise quartz movement and stainless steel construction. The perfect blend of retro style and modern reliability. Specifications: Case Size: 40mm, Movement: Quartz chronograph, Strap: Stainless steel bracelet, Water Resistance: 5ATM, Crystal: Mineral glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/classic-chrono.jpg', ARRAY['/images/products/classic-chrono.jpg'], 100, true, '40mm', 'Quartz chronograph', 'Stainless steel bracelet', '5ATM', NOW(), NOW()),

-- The Minimalist
(gen_random_uuid(), 'The Minimalist', 69.00, 'Wristwatch', 'Embrace timeless simplicity with this elegant minimalist watch. Clean lines, refined details, and a comfortable mesh band make it the perfect everyday companion. Specifications: Case Size: 38mm, Movement: Japanese quartz, Strap: Milanese mesh steel, Water Resistance: 3ATM, Crystal: Mineral glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/minimalist.jpg', ARRAY['/images/products/minimalist.jpg'], 100, true, '38mm', 'Japanese quartz', 'Milanese mesh steel', '3ATM', NOW(), NOW()),

-- GMT Pepsi
(gen_random_uuid(), 'GMT Pepsi', 129.00, 'Wristwatch', 'Professional dual-time zone watch with iconic red and blue bezel. Features a reliable automatic movement and stainless steel bracelet. Perfect for travelers and watch enthusiasts. Specifications: Case Size: 40mm, Movement: Automatic GMT, Strap: Stainless steel oyster, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/gmt-pepsi.jpg', ARRAY['/images/products/gmt-pepsi.jpg'], 50, true, '40mm', 'Automatic GMT', 'Stainless steel oyster', '10ATM', NOW(), NOW()),

-- Submariner Black
(gen_random_uuid(), 'Submariner Black', 149.00, 'Wristwatch', 'Professional dive watch with unidirectional rotating bezel and exceptional water resistance. A true classic that combines functionality with timeless design. Specifications: Case Size: 41mm, Movement: Automatic diver, Strap: Stainless steel oyster, Water Resistance: 30ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/submariner-black.jpg', ARRAY['/images/products/submariner-black.jpg'], 50, true, '41mm', 'Automatic diver', 'Stainless steel oyster', '30ATM', NOW(), NOW()),

-- Daytona Black
(gen_random_uuid(), 'Daytona Black', 169.00, 'Wristwatch', 'Legendary chronograph designed for motorsport enthusiasts. Features a tachymetric scale and three sub-dials for precise timing. A symbol of speed and elegance. Specifications: Case Size: 40mm, Movement: Automatic chronograph, Strap: Stainless steel oyster, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/daytona-black.jpg', ARRAY['/images/products/daytona-black.jpg'], 30, true, '40mm', 'Automatic chronograph', 'Stainless steel oyster', '10ATM', NOW(), NOW()),

-- Datejust 41 Blue
(gen_random_uuid(), 'Datejust 41 Blue', 139.00, 'Wristwatch', 'Elegant dress watch with iconic date window and cyclops lens. The blue dial adds a touch of sophistication to this timeless classic. Specifications: Case Size: 41mm, Movement: Automatic date, Strap: Stainless steel jubilee, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/datejust-41-blue.jpg', ARRAY['/images/products/datejust-41-blue.jpg'], 40, true, '41mm', 'Automatic date', 'Stainless steel jubilee', '10ATM', NOW(), NOW()),

-- GMT Batman
(gen_random_uuid(), 'GMT Batman', 139.00, 'Wristwatch', 'Sophisticated dual-time zone watch with distinctive black and blue ceramic bezel. Perfect for international travelers who appreciate refined aesthetics. Specifications: Case Size: 40mm, Movement: Automatic GMT, Strap: Stainless steel oyster, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/gmt-batman.jpg', ARRAY['/images/products/gmt-batman.jpg'], 40, true, '40mm', 'Automatic GMT', 'Stainless steel oyster', '10ATM', NOW(), NOW()),

-- Explorer II White
(gen_random_uuid(), 'Explorer II White', 129.00, 'Wristwatch', 'Adventure-ready watch with 24-hour hand and fixed bezel. Designed for explorers and those who venture into the unknown. Clean white dial for optimal readability. Specifications: Case Size: 42mm, Movement: Automatic GMT, Strap: Stainless steel oyster, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/explorer-ii-white.jpg', ARRAY['/images/products/explorer-ii-white.jpg'], 35, true, '42mm', 'Automatic GMT', 'Stainless steel oyster', '10ATM', NOW(), NOW()),

-- Sea-Dweller Red
(gen_random_uuid(), 'Sea-Dweller Red', 179.00, 'Wristwatch', 'Ultimate professional dive watch with helium escape valve and exceptional depth rating. The red lettering on the dial pays tribute to vintage models. Specifications: Case Size: 43mm, Movement: Automatic diver, Strap: Stainless steel oyster, Water Resistance: 122ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/sea-dweller-red.jpg', ARRAY['/images/products/sea-dweller-red.jpg'], 25, true, '43mm', 'Automatic diver', 'Stainless steel oyster', '122ATM', NOW(), NOW()),

-- Sky-Dweller Blue
(gen_random_uuid(), 'Sky-Dweller Blue', 189.00, 'Wristwatch', 'Sophisticated annual calendar watch with dual time zone and month display. The fluted bezel adds a touch of luxury to this complex timepiece. Specifications: Case Size: 42mm, Movement: Automatic annual calendar, Strap: Stainless steel oyster, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/sky-dweller-blue.jpg', ARRAY['/images/products/sky-dweller-blue.jpg'], 20, true, '42mm', 'Automatic annual calendar', 'Stainless steel oyster', '10ATM', NOW(), NOW()),

-- Submariner Green
(gen_random_uuid(), 'Submariner Green', 159.00, 'Wristwatch', 'Stunning dive watch with vibrant green sunburst dial and matching ceramic bezel. A modern classic that stands out from the crowd. Specifications: Case Size: 41mm, Movement: Automatic diver, Strap: Stainless steel oyster, Water Resistance: 30ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/submariner-green.jpg', ARRAY['/images/products/submariner-green.jpg'], 30, true, '41mm', 'Automatic diver', 'Stainless steel oyster', '30ATM', NOW(), NOW()),

-- GMT Sprite
(gen_random_uuid(), 'GMT Sprite', 149.00, 'Wristwatch', 'Bold dual-time zone watch with striking black and green ceramic bezel. Left-hand crown option adds unique character to this versatile timepiece. Specifications: Case Size: 40mm, Movement: Automatic GMT, Strap: Stainless steel oyster, Water Resistance: 10ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/gmt-sprite.jpg', ARRAY['/images/products/gmt-sprite.jpg'], 35, true, '40mm', 'Automatic GMT', 'Stainless steel oyster', '10ATM', NOW(), NOW()),

-- Submariner No Date
(gen_random_uuid(), 'Submariner No Date', 139.00, 'Wristwatch', 'Pure and symmetrical dive watch without date window. The clean dial design showcases the timeless elegance of the original submariner. Specifications: Case Size: 41mm, Movement: Automatic diver, Strap: Stainless steel oyster, Water Resistance: 30ATM, Crystal: Sapphire glass. Shipping: Free shipping to UK, Germany, France, Italy, Spain and 12 other European countries. Delivery in 9-12 business days.', '/images/products/submariner-no-date.jpg', ARRAY['/images/products/submariner-no-date.jpg'], 45, true, '41mm', 'Automatic diver', 'Stainless steel oyster', '30ATM', NOW(), NOW())

ON CONFLICT DO NOTHING;

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
  79.00,
  0,
  0,
  79.00,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "orders" LIMIT 1);

-- 完成
SELECT 'Database initialization completed!' AS status;
