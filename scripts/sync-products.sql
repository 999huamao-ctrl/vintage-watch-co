-- 插入7个缺失的商品到数据库
-- 在 Supabase SQL Editor 中执行

INSERT INTO "Product" (id, name, "nameZh", description, "descriptionZh", price, "originalPrice", category, image, images, stock, "isActive", "caseSize", movement, strap, "waterResistance", "createdAt", "updatedAt") VALUES
('prod_009', 'Rolex Pearlmaster Style', '劳力士珍珠淑女型风格', 'Luxury women watch with precious stone setting', '奢华女士腕表，宝石镶嵌', 199.00, 319.00, 'Pearlmaster', '/products/image17.jpeg', ARRAY['/products/image17.jpeg', '/products/image18.jpeg'], 5, true, '29mm', 'Automatic', 'Pearlmaster Bracelet', '100m', NOW(), NOW()),

('prod_010', 'Rolex Air-King Style', '劳力士空中霸王风格', 'Aviation-inspired watch with bold dial', '航空灵感腕表，醒目表盘', 159.00, 239.00, 'Air-King', '/products/image19.jpeg', ARRAY['/products/image19.jpeg', '/products/image20.jpeg'], 14, true, '40mm', 'Automatic', 'Oyster Bracelet', '100m', NOW(), NOW()),

('prod_011', 'Rolex Sea-Dweller Style', '劳力士海使型风格', 'Professional diving watch with helium escape valve', '专业潜水腕表，排氦阀门', 209.00, 339.00, 'Sea-Dweller', '/products/image21.jpeg', ARRAY['/products/image21.jpeg', '/products/image22.jpeg'], 4, true, '43mm', 'Automatic', 'Oyster Bracelet', '1220m', NOW(), NOW()),

('prod_012', 'Rolex Milgauss Style', '劳力士格磁型风格', 'Anti-magnetic watch with lightning bolt seconds hand', '防磁腕表，闪电形状秒针', 179.00, 279.00, 'Milgauss', '/products/image23.jpeg', ARRAY['/products/image23.jpeg', '/products/image24.jpeg'], 9, true, '40mm', 'Automatic', 'Oyster Bracelet', '100m', NOW(), NOW()),

('prod_013', 'Rolex Cellini Style', '劳力士切利尼风格', 'Dress watch with leather strap and moonphase', '正装腕表，皮表带，月相显示', 189.00, 299.00, 'Cellini', '/products/image25.jpeg', ARRAY['/products/image25.jpeg', '/products/image26.jpeg'], 7, true, '39mm', 'Automatic', 'Leather', '50m', NOW(), NOW()),

('prod_014', 'Rolex Sky-Dweller Style', '劳力士纵航者风格', 'Annual calendar watch with dual time zone', '年历腕表，双时区显示', 219.00, 359.00, 'Sky-Dweller', '/products/image27.jpeg', ARRAY['/products/image27.jpeg', '/products/image28.jpeg'], 3, true, '42mm', 'Automatic Annual Calendar', 'Oyster Bracelet', '100m', NOW(), NOW()),

('prod_015', 'TEST PRODUCT - DO NOT BUY', '测试商品 - 请勿购买', 'This is a test product for development purposes only. Do not purchase.', '这是仅供开发测试使用的商品。请勿购买。', 1.00, 1.00, 'Test', '/products/image1.webp', ARRAY['/products/image1.webp'], 999, true, '40mm', 'Quartz', 'Test', '0m', NOW(), NOW());
