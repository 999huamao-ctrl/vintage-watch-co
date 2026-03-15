-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 创建用户角色枚举类型
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'ADMIN', 'SUPPLY', 'LOGISTICS', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 创建商品表
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255),
    name_de VARCHAR(255),
    name_fr VARCHAR(255),
    name_es VARCHAR(255),
    name_it VARCHAR(255),
    name_ja VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    description_zh TEXT,
    image VARCHAR(500) NOT NULL,
    images TEXT[],
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    case_size VARCHAR(50),
    movement VARCHAR(100),
    strap VARCHAR(100),
    water_resistance VARCHAR(50)
);

-- 创建订单状态枚举
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 创建支付状态枚举
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_zip VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'USDT',
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_tx_hash VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    tracking_number VARCHAR(255),
    carrier VARCHAR(100),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订单项表
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- 创建供应商表
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建采购单状态枚举
DO $$ BEGIN
    CREATE TYPE po_status AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'SHIPPED', 'RECEIVED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 创建采购单表
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(255) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    status VARCHAR(50) DEFAULT 'DRAFT',
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    received_at TIMESTAMP WITH TIME ZONE
);

-- 创建采购单项表
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- 创建库存流水表
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    type VARCHAR(50) NOT NULL, -- IN, OUT, ADJUST
    quantity INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    reference_id VARCHAR(255),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建广告活动表
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    budget DECIMAL(10,2) NOT NULL,
    spend DECIMAL(10,2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    utm_campaign VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建运营日报表
CREATE TABLE IF NOT EXISTS daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    revenue DECIMAL(10,2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    ad_spend DECIMAL(10,2) DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户行为追踪表
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    product_id VARCHAR(255),
    metadata JSONB,
    ip VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建钱包配置表
CREATE TABLE IF NOT EXISTS wallet_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    l1_receiving VARCHAR(255) NOT NULL,
    l2_operating VARCHAR(255) NOT NULL,
    l3_profit VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(255) NOT NULL
);

-- 插入默认超级管理员账号
INSERT INTO users (username, email, password, role) 
VALUES ('superadmin', 'superadmin@horizonwatches.com', 'super123', 'SUPERADMIN')
ON CONFLICT (username) DO NOTHING;

-- 插入默认管理员账号
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@horizonwatches.com', 'admin123', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 插入供应链账号
INSERT INTO users (username, email, password, role) 
VALUES ('supply', 'supply@horizonwatches.com', 'supply123', 'SUPPLY')
ON CONFLICT (username) DO NOTHING;

-- 插入物流账号
INSERT INTO users (username, email, password, role) 
VALUES ('logistics', 'logistics@horizonwatches.com', 'logistics123', 'LOGISTICS')
ON CONFLICT (username) DO NOTHING;

-- 插入默认钱包配置
INSERT INTO wallet_config (l1_receiving, l2_operating, l3_profit, updated_by)
VALUES (
    'TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c',
    'TCWgr2qGcheRsD7kceoFpJfMg59fFrJGCq',
    'TUyTqV47pd7o3Bg6Uhw5XJ9rwkdgi6tsKb',
    'system'
)
ON CONFLICT DO NOTHING;

-- 创建更新触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为用户表添加自动更新触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为商品表添加自动更新触发器
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为订单表添加自动更新触发器
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
