-- 商品数据同步脚本
-- 执行前请确保已连接到正确的数据库
-- 共15个商品（含1个测试商品）

-- 清空现有商品数据（谨慎操作！如需保留请先备份）
-- DELETE FROM products;

-- 插入15个商品
INSERT INTO products (
  id, name, "nameZh", description, "descriptionZh", price, "originalPrice", 
  category, image, images, stock, "isActive", "caseSize", movement, strap, "waterResistance",
  "createdAt", "updatedAt"
) VALUES 
-- prod_001: Rolex Submariner Style
('prod_001', 'Rolex Submariner Style', '劳力士潜航者风格', 
 'Classic diving watch with automatic movement and water resistance', 
 '经典潜水腕表，自动机械机芯，防水设计',
 189.00, 299.00, 'Submariner', '/products/image1.webp', 
 ARRAY['/products/image1.webp', '/products/image2.jpeg']::text[], 
 15, true, '40mm', 'Automatic', 'Oyster Bracelet', '300m',
 NOW(), NOW()),

-- prod_002: Rolex Datejust Style
('prod_002', 'Rolex Datejust Style', '劳力士日志型风格',
 'Elegant dress watch with date function and fluted bezel',
 '优雅正装腕表，日期功能，三角坑纹表圈',
 169.00, 259.00, 'Datejust', '/products/image3.jpeg',
 ARRAY['/products/image3.jpeg', '/products/image4.jpeg']::text[],
 12, true, '36mm', 'Automatic', 'Jubilee Bracelet', '100m',
 NOW(), NOW()),

-- prod_003: Rolex Daytona Style
('prod_003', 'Rolex Daytona Style', '劳力士迪通拿风格',
 'Chronograph sports watch with tachymeter bezel',
 '计时码表运动腕表，测速表圈',
 199.00, 329.00, 'Daytona', '/products/image5.jpeg',
 ARRAY['/products/image5.jpeg', '/products/image6.webp']::text[],
 8, true, '40mm', 'Automatic Chronograph', 'Oyster Bracelet', '100m',
 NOW(), NOW()),

-- prod_004: Rolex GMT-Master Style
('prod_004', 'Rolex GMT-Master Style', '劳力士格林尼治风格',
 'Dual time zone watch with rotating 24-hour bezel',
 '双时区腕表，旋转24小时表圈',
 179.00, 289.00, 'GMT-Master', '/products/image7.jpeg',
 ARRAY['/products/image7.jpeg', '/products/image8.jpeg']::text[],
 10, true, '40mm', 'Automatic GMT', 'Jubilee Bracelet', '100m',
 NOW(), NOW()),

-- prod_005: Rolex Explorer Style
('prod_005', 'Rolex Explorer Style', '劳力士探险家风格',
 'Adventure watch with luminous markers and rugged design',
 '探险腕表，夜光时标，坚固设计',
 159.00, 249.00, 'Explorer', '/products/image9.jpeg',
 ARRAY['/products/image9.jpeg', '/products/image10.jpeg']::text[],
 20, true, '39mm', 'Automatic', 'Oyster Bracelet', '100m',
 NOW(), NOW()),

-- prod_006: Rolex Yacht-Master Style
('prod_006', 'Rolex Yacht-Master Style', '劳力士游艇名仕风格',
 'Nautical watch with rotatable bezel and regatta countdown',
 '航海腕表，旋转表圈，帆船赛倒计时',
 189.00, 299.00, 'Yacht-Master', '/products/image11.jpeg',
 ARRAY['/products/image11.jpeg', '/products/image12.jpeg']::text[],
 6, true, '40mm', 'Automatic', 'Oysterflex', '100m',
 NOW(), NOW()),

-- prod_007: Rolex Oyster Perpetual Style
('prod_007', 'Rolex Oyster Perpetual Style', '劳力士蚝式恒动风格',
 'Classic time-only watch with clean dial design',
 '经典三针腕表，简洁表盘设计',
 149.00, 229.00, 'Oyster Perpetual', '/products/image13.jpeg',
 ARRAY['/products/image13.jpeg', '/products/image14.jpeg']::text[],
 25, true, '36mm', 'Automatic', 'Oyster Bracelet', '100m',
 NOW(), NOW()),

-- prod_008: Rolex Lady-Datejust Style
('prod_008', 'Rolex Lady-Datejust Style', '劳力士女装日志型风格',
 'Elegant women watch with diamond markers',
 '优雅女士腕表，钻石时标',
 169.00, 269.00, 'Lady-Datejust', '/products/image15.jpeg',
 ARRAY['/products/image15.jpeg', '/products/image16.jpeg']::text[],
 18, true, '28mm', 'Automatic', 'Jubilee Bracelet', '100m',
 NOW(), NOW()),

-- prod_009: Rolex Pearlmaster Style
('prod_009', 'Rolex Pearlmaster Style', '劳力士珍珠淑女型风格',
 'Luxury women watch with precious stone setting',
 '奢华女士腕表，宝石镶嵌',
 199.00, 319.00, 'Pearlmaster', '/products/image17.jpeg',
 ARRAY['/products/image17.jpeg', '/products/image18.jpeg']::text[],
 5, true, '29mm', 'Automatic', 'Pearlmaster Bracelet', '100m',
 NOW(), NOW()),

-- prod_010: Rolex Air-King Style
('prod_010', 'Rolex Air-King Style', '劳力士空中霸王风格',
 'Aviation-inspired watch with bold dial',
 '航空灵感腕表，醒目表盘',
 159.00, 239.00, 'Air-King', '/products/image19.jpeg',
 ARRAY['/products/image19.jpeg', '/products/image20.jpeg']::text[],
 14, true, '40mm', 'Automatic', 'Oyster Bracelet', '100m',
 NOW(), NOW()),

-- prod_011: Rolex Sea-Dweller Style
('prod_011', 'Rolex Sea-Dweller Style', '劳力士海使型风格',
 'Professional diving watch with helium escape valve',
 '专业潜水腕表，排氦阀门',
 209.00, 339.00, 'Sea-Dweller', '/products/image21.jpeg',
 ARRAY['/products/image21.jpeg', '/products/image22.jpeg']::text[],
 4, true, '43mm', 'Automatic', 'Oyster Bracelet', '1220m',
 NOW(), NOW()),

-- prod_012: Rolex Milgauss Style
('prod_012', 'Rolex Milgauss Style', '劳力士格磁型风格',
 'Anti-magnetic watch with lightning bolt seconds hand',
 '防磁腕表，闪电形状秒针',
 179.00, 279.00, 'Milgauss', '/products/image23.jpeg',
 ARRAY['/products/image23.jpeg', '/products/image24.jpeg']::text[],
 9, true, '40mm', 'Automatic', 'Oyster Bracelet', '100m',
 NOW(), NOW()),

-- prod_013: Rolex Cellini Style
('prod_013', 'Rolex Cellini Style', '劳力士切利尼风格',
 'Dress watch with leather strap and moonphase',
 '正装腕表，皮表带，月相显示',
 189.00, 299.00, 'Cellini', '/products/image25.jpeg',
 ARRAY['/products/image25.jpeg', '/products/image26.jpeg']::text[],
 7, true, '39mm', 'Automatic', 'Leather', '50m',
 NOW(), NOW()),

-- prod_014: Rolex Sky-Dweller Style
('prod_014', 'Rolex Sky-Dweller Style', '劳力士纵航者风格',
 'Annual calendar watch with dual time zone',
 '年历腕表，双时区显示',
 219.00, 359.00, 'Sky-Dweller', '/products/image27.jpeg',
 ARRAY['/products/image27.jpeg', '/products/image28.jpeg']::text[],
 3, true, '42mm', 'Automatic Annual Calendar', 'Oyster Bracelet', '100m',
 NOW(), NOW()),

-- prod_015: TEST PRODUCT
('prod_015', 'TEST PRODUCT - DO NOT BUY', '测试商品 - 请勿购买',
 'This is a test product for development purposes only. Do not purchase.',
 '这是仅供开发测试使用的商品。请勿购买。',
 1.00, 1.00, 'Test', '/products/image1.webp',
 ARRAY['/products/image1.webp']::text[],
 999, true, '40mm', 'Quartz', 'Test', '0m',
 NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "nameZh" = EXCLUDED."nameZh",
  description = EXCLUDED.description,
  "descriptionZh" = EXCLUDED."descriptionZh",
  price = EXCLUDED.price,
  "originalPrice" = EXCLUDED."originalPrice",
  category = EXCLUDED.category,
  image = EXCLUDED.image,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  "isActive" = EXCLUDED."isActive",
  "caseSize" = EXCLUDED."caseSize",
  movement = EXCLUDED.movement,
  strap = EXCLUDED.strap,
  "waterResistance" = EXCLUDED."waterResistance",
  "updatedAt" = NOW();

-- 验证结果
SELECT COUNT(*) as total_products FROM products;
