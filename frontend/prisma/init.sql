-- ============================================
-- Horizon Watches 数据库初始化脚本
-- ============================================

-- 创建用户表
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS "Category" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建商品表
CREATE TABLE IF NOT EXISTS "Product" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    sku TEXT UNIQUE,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    images TEXT[],
    category_id TEXT REFERENCES "Category"(id),
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS "Order" (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'PENDING',
    payment_status TEXT DEFAULT 'PENDING',
    shipping_status TEXT DEFAULT 'PENDING',
    tracking_number TEXT,
    notes TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建库存流水表
CREATE TABLE IF NOT EXISTS "InventoryLog" (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES "Product"(id),
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    before_stock INTEGER,
    after_stock INTEGER,
    reference_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建客户行为追踪表
CREATE TABLE IF NOT EXISTS "CustomerEvent" (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    session_id TEXT,
    user_id TEXT REFERENCES "User"(id),
    product_id TEXT REFERENCES "Product"(id),
    order_id TEXT REFERENCES "Order"(id),
    metadata JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 插入初始数据
-- ============================================

-- 插入管理员账号（密码: admin123）
INSERT INTO "User" (id, email, password, name, role) VALUES
('admin_001', 'admin@horizonwatches.com', '$2b$10$YourHashedPasswordHere', 'Super Admin', 'SUPERADMIN')
ON CONFLICT (email) DO NOTHING;

-- 插入分类
INSERT INTO "Category" (id, name, slug, description, "order") VALUES
('cat_001', 'Men', 'men', 'Premium watches for men', 1),
('cat_002', 'Women', 'women', 'Elegant watches for women', 2),
('cat_003', 'Sale', 'sale', 'Special offers and discounts', 3)
ON CONFLICT (slug) DO NOTHING;

-- 插入商品（劳力士风格手表）
INSERT INTO "Product" (id, name, slug, description, price, original_price, sku, stock, images, category_id, specifications, is_active, is_featured) VALUES
('prod_001', 'Rolex Submariner Style', 'rolex-submariner', 
'Classic diving watch with automatic movement and water resistance', 
189.00, 299.00, 'ROL-SUB-001', 15, 
ARRAY['/products/image1.webp', '/products/image2.jpeg'], 
'cat_001', 
'{"dialSize": "40mm", "movement": "Automatic", "waterResistance": "300m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, true),

('prod_002', 'Rolex Datejust Style', 'rolex-datejust', 
'Elegant dress watch with date function and fluted bezel', 
169.00, 259.00, 'ROL-DAT-001', 12, 
ARRAY['/products/image3.jpeg', '/products/image4.jpeg'], 
'cat_001', 
'{"dialSize": "36mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Jubilee Bracelet"}'::jsonb, 
true, true),

('prod_003', 'Rolex Daytona Style', 'rolex-daytona', 
'Chronograph sports watch with tachymeter bezel', 
199.00, 329.00, 'ROL-DAY-001', 8, 
ARRAY['/products/image5.jpeg', '/products/image6.webp'], 
'cat_001', 
'{"dialSize": "40mm", "movement": "Automatic Chronograph", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, true),

('prod_004', 'Rolex GMT-Master Style', 'rolex-gmt-master', 
'Dual time zone watch with rotating 24-hour bezel', 
179.00, 289.00, 'ROL-GMT-001', 10, 
ARRAY['/products/image7.jpeg', '/products/image8.jpeg'], 
'cat_001', 
'{"dialSize": "40mm", "movement": "Automatic GMT", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Jubilee Bracelet"}'::jsonb, 
true, false),

('prod_005', 'Rolex Explorer Style', 'rolex-explorer', 
'Adventure watch with luminous markers and rugged design', 
159.00, 249.00, 'ROL-EXP-001', 20, 
ARRAY['/products/image9.jpeg', '/products/image10.jpeg'], 
'cat_001', 
'{"dialSize": "39mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, false),

('prod_006', 'Rolex Yacht-Master Style', 'rolex-yacht-master', 
'Nautical watch with rotatable bezel and regatta countdown', 
189.00, 299.00, 'ROL-YAC-001', 6, 
ARRAY['/products/image11.jpeg', '/products/image12.jpeg'], 
'cat_001', 
'{"dialSize": "40mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Oysterflex"}'::jsonb, 
true, false),

('prod_007', 'Rolex Oyster Perpetual Style', 'rolex-oyster-perpetual', 
'Classic time-only watch with clean dial design', 
149.00, 229.00, 'ROL-OP-001', 25, 
ARRAY['/products/image13.jpeg', '/products/image14.jpeg'], 
'cat_001', 
'{"dialSize": "36mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, false),

('prod_008', 'Rolex Lady-Datejust Style', 'rolex-lady-datejust', 
'Elegant women watch with diamond markers', 
169.00, 269.00, 'ROL-LDY-001', 18, 
ARRAY['/products/image15.jpeg', '/products/image16.jpeg'], 
'cat_002', 
'{"dialSize": "28mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel & Gold", "strap": "Jubilee Bracelet"}'::jsonb, 
true, true),

('prod_009', 'Rolex Pearlmaster Style', 'rolex-pearlmaster', 
'Luxury women watch with precious stone setting', 
199.00, 319.00, 'ROL-PM-001', 5, 
ARRAY['/products/image17.jpeg', '/products/image18.jpeg'], 
'cat_002', 
'{"dialSize": "29mm", "movement": "Automatic", "waterResistance": "100m", "material": "18K Gold", "strap": "Pearlmaster Bracelet"}'::jsonb, 
true, true),

('prod_010', 'Rolex Air-King Style', 'rolex-air-king', 
'Aviation-inspired watch with bold dial', 
159.00, 239.00, 'ROL-AK-001', 14, 
ARRAY['/products/image19.jpeg', '/products/image20.jpeg'], 
'cat_001', 
'{"dialSize": "40mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, false),

('prod_011', 'Rolex Sea-Dweller Style', 'rolex-sea-dweller', 
'Professional diving watch with helium escape valve', 
209.00, 339.00, 'ROL-SD-001', 4, 
ARRAY['/products/image21.jpeg', '/products/image22.jpeg'], 
'cat_001', 
'{"dialSize": "43mm", "movement": "Automatic", "waterResistance": "1220m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, false),

('prod_012', 'Rolex Milgauss Style', 'rolex-milgauss', 
'Anti-magnetic watch with lightning bolt seconds hand', 
179.00, 279.00, 'ROL-MG-001', 9, 
ARRAY['/products/image23.jpeg', '/products/image24.jpeg'], 
'cat_001', 
'{"dialSize": "40mm", "movement": "Automatic", "waterResistance": "100m", "material": "Stainless Steel", "strap": "Oyster Bracelet"}'::jsonb, 
true, false),

('prod_013', 'Rolex Cellini Style', 'rolex-cellini', 
'Dress watch with leather strap and moonphase', 
189.00, 299.00, 'ROL-CEL-001', 7, 
ARRAY['/products/image25.jpeg', '/products/image26.jpeg'], 
'cat_001', 
'{"dialSize": "39mm", "movement": "Automatic", "waterResistance": "50m", "material": "18K Gold", "strap": "Leather"}'::jsonb, 
true, false),

('prod_014', 'Rolex Sky-Dweller Style', 'rolex-sky-dweller', 
'Annual calendar watch with dual time zone', 
219.00, 359.00, 'ROL-SD-002', 3, 
ARRAY['/products/image27.jpeg', '/products/image28.jpeg'], 
'cat_001', 
'{"dialSize": "42mm", "movement": "Automatic Annual Calendar", "waterResistance": "100m", "material": "Stainless Steel & Gold", "strap": "Oyster Bracelet"}'::jsonb, 
true, false);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"(category_id);
CREATE INDEX IF NOT EXISTS idx_product_slug ON "Product"(slug);
CREATE INDEX IF NOT EXISTS idx_product_active ON "Product"(is_active);
CREATE INDEX IF NOT EXISTS idx_product_featured ON "Product"(is_featured);
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);
CREATE INDEX IF NOT EXISTS idx_order_created ON "Order"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON "InventoryLog"(product_id);
CREATE INDEX IF NOT EXISTS idx_event_type ON "CustomerEvent"(event_type);
CREATE INDEX IF NOT EXISTS idx_event_created ON "CustomerEvent"(created_at DESC);

-- 插入 Prisma 迁移记录（避免重复迁移）
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    id TEXT PRIMARY KEY,
    checksum TEXT NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE,
    migration_name TEXT NOT NULL,
    logs TEXT,
    rolled_back_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    applied_steps_count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count)
VALUES (
    'init_migration_' || extract(epoch from now())::text,
    'manual_init',
    CURRENT_TIMESTAMP,
    'init',
    1
) ON CONFLICT DO NOTHING;

-- 完成
SELECT 'Database initialized successfully!' as status;
