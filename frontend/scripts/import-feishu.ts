import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Feishu API configuration
const FEISHU_CONFIG = {
  appToken: 'HTRMbB99garcMfswhsncGrmxnLf',
  tableId: 'tbl2vGaFlotqlaO4',
};

interface FeishuRecord {
  record_id: string;
  fields: {
    product_name?: string;
    price?: number;
    brand_category?: string;
    case_specs?: string;
    dial_specs?: string;
    movement_specs?: string;
    power_reserve?: string;
    functions?: string;
    main_image?: { link: string; text: string } | string;
    detail_image_1?: { link: string; text: string } | string;
    detail_image_2?: { link: string; text: string } | string;
    detail_image_3?: { link: string; text: string } | string;
    detail_image_4?: { link: string; text: string } | string;
    stock?: string | number;
    weight?: string;
  };
}

interface ProductData {
  name: string;
  price: number;
  category: string;
  brand: string;
  movement?: string;
  caseMaterial?: string;
  dial?: string;
  functions?: string;
  powerReserve?: string;
  image: string;
  detailImage1?: string;
  detailImage2?: string;
  detailImage3?: string;
  detailImage4?: string;
  stock: number;
}

function extractImageUrl(field: any): string | undefined {
  if (!field) return undefined;
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field.link) return field.link;
  return undefined;
}

function extractCaseSize(caseSpecs: string): number {
  const match = caseSpecs?.match(/(\d+(?:\.\d+)?)\s*mm/i);
  return match ? parseFloat(match[1]) : 42;
}

function determineGender(caseSpecs: string): string {
  const size = extractCaseSize(caseSpecs);
  return size < 35 ? 'Women' : 'Men';
}

async function fetchFeishuRecords(accessToken: string): Promise<FeishuRecord[]> {
  const records: FeishuRecord[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${FEISHU_CONFIG.tableId}/records`);
    url.searchParams.append('page_size', '500');
    if (pageToken) url.searchParams.append('page_token', pageToken);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    if (data.code !== 0) {
      throw new Error(`Feishu API error: ${data.msg || JSON.stringify(data)}`);
    }

    records.push(...(data.data?.items || []));
    pageToken = data.data?.page_token;
  } while (pageToken);

  return records;
}

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }),
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Failed to get access token: ${data.msg}`);
  }
  return data.tenant_access_token;
}

function transformRecord(record: FeishuRecord): ProductData | null {
  const f = record.fields;
  
  if (!f.product_name || !f.price) {
    return null;
  }

  const caseSize = extractCaseSize(f.case_specs || '');
  
  return {
    name: f.product_name,
    price: Math.round(f.price * 0.92 * 100) / 100, // USD to EUR
    category: determineGender(f.case_specs || ''),
    brand: f.brand_category || 'Unknown',
    movement: f.movement_specs,
    caseMaterial: f.case_specs,
    dial: f.dial_specs,
    functions: f.functions,
    powerReserve: f.power_reserve,
    image: extractImageUrl(f.main_image) || '',
    detailImage1: extractImageUrl(f.detail_image_1),
    detailImage2: extractImageUrl(f.detail_image_2),
    detailImage3: extractImageUrl(f.detail_image_3),
    detailImage4: extractImageUrl(f.detail_image_4),
    stock: parseInt(f.stock as string) || 999,
  };
}

async function main() {
  console.log('🚀 Starting product import...\n');

  // Step 1: Get Feishu access token
  console.log('1️⃣ Getting Feishu access token...');
  const accessToken = await getAccessToken();
  console.log('✅ Access token obtained\n');

  // Step 2: Fetch records from Feishu
  console.log('2️⃣ Fetching records from Feishu...');
  const records = await fetchFeishuRecords(accessToken);
  console.log(`✅ Fetched ${records.length} records\n`);

  // Step 3: Transform records
  console.log('3️⃣ Transforming records...');
  const products: ProductData[] = [];
  for (const record of records) {
    const product = transformRecord(record);
    if (product) {
      products.push(product);
    }
  }
  console.log(`✅ Valid products: ${products.length} (${records.length - products.length} skipped)\n`);

  // Step 4: Clear old products (disable foreign key checks first)
  console.log('4️⃣ Clearing old products...');
  const deleted = await prisma.product.deleteMany({});
  console.log(`✅ Deleted ${deleted.count} old products\n`);

  // Step 5: Insert new products
  console.log('5️⃣ Inserting new products...');
  let inserted = 0;
  for (const product of products) {
    try {
      await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          category: product.category,
          brand: product.brand,
          image: product.image,
          stock: product.stock,
          movement: product.movement,
          caseMaterial: product.caseMaterial,
          dial: product.dial,
          functions: product.functions,
          powerReserve: product.powerReserve,
          detailImage1: product.detailImage1,
          detailImage2: product.detailImage2,
          detailImage3: product.detailImage3,
          detailImage4: product.detailImage4,
          isActive: true,
        },
      });
      inserted++;
      if (inserted % 50 === 0) {
        console.log(`   Progress: ${inserted}/${products.length}`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to insert: ${product.name}`, error);
    }
  }
  console.log(`✅ Inserted ${inserted} products\n`);

  // Step 6: Verify
  const count = await prisma.product.count();
  console.log(`📊 Final product count in database: ${count}`);
  console.log(`🎉 Import completed successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
