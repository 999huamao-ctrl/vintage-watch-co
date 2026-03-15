-- Create enum types
CREATE TYPE role_enum AS ENUM ('SUPERADMIN', 'ADMIN', 'SUPPLY', 'LOGISTICS', 'CUSTOMER');
CREATE TYPE order_status_enum AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- Create User table
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role_enum DEFAULT 'CUSTOMER',
    language TEXT DEFAULT 'en',
    country TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Session table
CREATE TABLE "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table
CREATE TABLE "Category" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Create Product table
CREATE TABLE "Product" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    "baseName" TEXT NOT NULL,
    "baseDesc" TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    "comparePrice" DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    images TEXT[],
    "categoryId" TEXT NOT NULL REFERENCES "Category"(id),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ProductTranslation table
CREATE TABLE "ProductTranslation" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    UNIQUE("productId", language)
);

-- Create Order table
CREATE TABLE "Order" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "userId" TEXT REFERENCES "User"(id),
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerCity" TEXT NOT NULL,
    "customerPostal" TEXT NOT NULL,
    "customerCountry" TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    txid TEXT,
    status order_status_enum DEFAULT 'PENDING',
    "trackingNumber" TEXT,
    "shippedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create OrderItem table
CREATE TABLE "OrderItem" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "productId" TEXT NOT NULL REFERENCES "Product"(id),
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL
);

-- Create indexes
CREATE INDEX idx_session_user ON "Session"("userId");
CREATE INDEX idx_session_token ON "Session"(token);
CREATE INDEX idx_product_category ON "Product"("categoryId");
CREATE INDEX idx_product_slug ON "Product"(slug);
CREATE INDEX idx_product_sku ON "Product"(sku);
CREATE INDEX idx_product_active ON "Product"("isActive");
CREATE INDEX idx_translation_product ON "ProductTranslation"("productId");
CREATE INDEX idx_order_user ON "Order"("userId");
CREATE INDEX idx_order_number ON "Order"("orderNumber");
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_item_order ON "OrderItem"("orderId");
CREATE INDEX idx_order_item_product ON "OrderItem"("productId");
