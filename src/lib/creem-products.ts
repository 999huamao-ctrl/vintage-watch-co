// CREEM 产品 ID 映射
// 在 CREEM Dashboard 创建产品后，把 Product ID 填入这里

export const creemProductIds: Record<string, string> = {
  // 格式: '产品slug': 'creem_product_id'
  // 示例: 'daytona-black': 'prod_xxxxx'
  
  // 待填充 - 创建产品后填入
  'daytona-black': 'prod_44KtpfXU9DBcfWXnExykkS',           // Daytona Black Steel
  'submariner-black': '',        // Submariner Black
  'submariner-green': '',        // Submariner Green
  'submariner-no-date': '',      // Submariner No-Date
  'datejust-blue': '',           // Datejust Blue
  'datejust-silver': '',         // Datejust Silver
  'datejust-green': '',          // Datejust Green
  'datejust-gold': '',           // Datejust Gold
  'gmt-master-ii': '',           // GMT Master II
  'yacht-master': '',            // Yacht-Master
  'explorer-i': '',              // Explorer I
  'explorer-ii': '',             // Explorer II
  'air-king': '',                // Air-King
  'milgauss': '',                // Milgauss
  'sea-dweller': '',             // Sea-Dweller
};

// 获取 CREEM Product ID
export function getCreemProductId(productSlug: string): string | undefined {
  return creemProductIds[productSlug] || undefined;
}

// 检查是否已配置
export function isCreemProductConfigured(productSlug: string): boolean {
  return !!creemProductIds[productSlug];
}