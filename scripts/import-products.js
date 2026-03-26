const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const prisma = new PrismaClient();

// 解析 CSV 文件
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return csv.parse(content, {
    columns: true,
    skip_empty_lines: true,
  });
}

// 从 HTML 描述中提取规格信息
function extractSpecs(description) {
  const specs = {
    caseSize: '',
    movement: '',
    strap: '',
    waterResistance: ''
  };
  
  // 尝试提取 Case Size
  const caseMatch = description.match(/Case Size:\s*(\d+mm)/i);
  if (caseMatch) specs.caseSize = caseMatch[1];
  
  // 尝试提取 Movement
  const movementMatch = description.match(/Movement:\s*([^<]+)/i);
  if (movementMatch) specs.movement = movementMatch[1].trim();
  
  // 尝试提取 Strap
  const strapMatch = description.match(/Strap:\s*([^<]+)/i);
  if (strapMatch) specs.strap = strapMatch[1].trim();
  
  // 尝试提取 Water Resistance
  const waterMatch = description.match(/Water Resistance:\s*(\d+ATM)/i);
  if (waterMatch) specs.waterResistance = waterMatch[1];
  
  return specs;
}

// 清理 HTML 标签
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function importProducts() {
  try {
    const csvPath = path.join(__dirname, '..', 'shopify_products.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found:', csvPath);
      process.exit(1);
    }
    
    console.log('📖 Reading CSV file...');
    const records = parseCSV(csvPath);
    console.log(`Found ${records.length} products in CSV`);
    
    // 先清空现有商品（可选）
    console.log('🗑️  Clearing existing products...');
    await prisma.orderItem.deleteMany({});
    await prisma.inventoryLog.deleteMany({});
    await prisma.product.deleteMany({});
    
    console.log('📦 Importing products...');
    
    for (const record of records) {
      const specs = extractSpecs(record['Body (HTML)'] || '');
      const description = stripHtml(record['Body (HTML)'] || '');
      
      // 提取价格
      const price = parseFloat(record['Variant Price']) || 0;
      const originalPrice = record['Variant Compare At Price'] 
        ? parseFloat(record['Variant Compare At Price']) 
        : null;
      
      // 提取库存
      const stock = parseInt(record['Variant Inventory Qty']) || 100;
      
      // 构建产品数据
      const productData = {
        name: record.Title,
        price: price,
        originalPrice: originalPrice,
        category: record.Type || 'Wristwatch',
        description: description,
        image: record['Image Src'] || '/images/placeholder.jpg',
        images: record['Image Src'] ? [record['Image Src']] : [],
        stock: stock,
        isActive: record.Published === 'TRUE',
        caseSize: specs.caseSize,
        movement: specs.movement,
        strap: specs.strap,
        waterResistance: specs.waterResistance,
      };
      
      await prisma.product.create({
        data: productData,
      });
      
      console.log(`✅ Imported: ${productData.name} - €${productData.price}`);
    }
    
    console.log('\n🎉 Import completed successfully!');
    console.log(`Total products imported: ${records.length}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行导入
importProducts();
