# Horizon Watches 运营手册 v3.1
**生成时间**: 2026-03-23  **版本**: v3.1

---

## 1. 系统访问信息

### 1.1 网站地址
| 项目 | 访问地址 |
|------|----------|
| **主站 (客户访问)** | https://www.horizonoo.cc |
| **管理后台** | https://www.horizonoo.cc/admin |

### 1.2 后台登录
1. 访问 https://www.horizonoo.cc/admin
2. 输入用户名和密码
3. 根据角色权限进入对应仪表盘

**注意**: 首次登录请使用分配的账号密码，登录后建议修改密码

---

## 2. 角色权限说明

| 角色 | 功能权限 |
|------|----------|
| **SUPERADMIN** | 全权限 (含钱包设置、用户管理) |
| **ADMIN** | 商品管理、订单管理、库存管理 |
| **SUPPLY** | 仅库存管理 (修改库存数量) |
| **LOGISTICS** | 仅订单发货 (更新物流信息) |

---

## 3. 商品数据导入指南

### 3.1 支持的导入方式

**方式1: 后台手动添加**
- 适合少量商品 (1-5个)
- 进入后台 → Products → Add Product
- 逐个填写商品信息

**方式2: CSV批量导入**
- 适合批量商品更新
- 发送表格给技术团队导入
- 或直接在后台使用导入功能

### 3.2 CSV表格格式要求

**必需字段** (缺少则无法导入):

| 字段名 | 说明 | 示例 |
|--------|------|------|
| **name** | 商品名称 (英文) | Rolex Submariner Style |
| **price** | 售价 (€) | 189.00 |
| **category** | 分类 | Men / Women |
| **stock** | 库存数量 | 15 |
| **image** | 主图URL | /products/image1.webp |

**可选字段**:

| 字段名 | 说明 | 示例 |
|--------|------|------|
| **nameZh** | 中文名称 | 劳力士潜航者风格 |
| **nameDe** | 德语名称 | Rolex Submariner Stil |
| **nameFr** | 法语名称 | Style Rolex Submariner |
| **nameEs** | 西班牙语名称 | Estilo Rolex Submariner |
| **nameIt** | 意大利语名称 | Stile Rolex Submariner |
| **nameJa** | 日语名称 | ロレックス サブマリーナ スタイル |
| **originalPrice** | 原价/划线价 (€) | 299.00 |
| **description** | 商品描述 | Classic diving watch with automatic movement... |
| **detailImage1** | 细节图1 URL | /products/detail1.webp |
| **detailImage2** | 细节图2 URL | /products/detail2.webp |
| **detailImage3** | 细节图3 URL | /products/detail3.webp |
| **detailImage4** | 细节图4 URL | /products/detail4.webp |
| **caseSize** | 表壳尺寸 | 40mm |
| **movement** | 机芯类型 | Automatic |
| **strap** | 表带材质 | Stainless Steel |
| **waterResistance** | 防水等级 | 300m |
| **brand** | 品牌名称 | Vintage Watch Co. |
| **isActive** | 是否上架 | true / false |

### 3.3 示例表格格式

```csv
name,nameZh,price,originalPrice,category,stock,image,caseSize,movement,strap,waterResistance
Rolex Submariner Style,劳力士潜航者风格,189.00,299.00,Men,15,/products/submariner.webp,40mm,Automatic,Stainless Steel,300m
Rolex Datejust Style,劳力士日志型风格,169.00,259.00,Men,12,/products/datejust.webp,36mm,Automatic,Jubilee Bracelet,100m
Rolex Lady-Datejust Style,劳力士女装日志型风格,169.00,269.00,Women,18,/products/lady-datejust.webp,28mm,Automatic,Jubilee Bracelet,100m
```

### 3.4 常见问题

**Q: 图片URL怎么填?**
A: 图片需要先上传到图床或CDN，填入完整的图片访问地址。格式如:
- 相对路径: `/products/image1.webp`
- 完整URL: `https://cdn.horizonoo.cc/products/image1.webp`

**Q: 价格格式有什么要求?**
A: 使用数字格式，不要加货币符号。例如:
- ✅ 正确: `189.00` 或 `189`
- ❌ 错误: `€189.00` 或 `189€`

**Q: 如何下架商品?**
A: 将 `isActive` 字段设为 `false`，或直接在后台关闭商品

**Q: 更新现有商品数据?**
A: 在表格中保留商品的 `id` 字段，系统会根据id更新对应商品。如没有id字段，则会创建新商品

---

## 4. 快速操作指南

### 4.1 更新商品库存 (SUPPLY角色)
1. 登录后台 → Products
2. 找到需要更新的商品
3. 点击 Edit
4. 修改 Stock 数量
5. 点击 Save

### 4.2 处理订单发货 (LOGISTICS角色)
1. 登录后台 → Orders
2. 找到 PAID 状态的订单
3. 点击订单查看详情
4. 更新状态为 SHIPPED
5. 填写 Tracking Number (物流单号)
6. 填写 Carrier (承运商)
7. 点击 Update

### 4.3 添加新商品 (ADMIN角色)
1. 登录后台 → Products
2. 点击 Add Product
3. 填写所有商品信息
4. 点击 Save

---

## 5. 注意事项

1. **商品名称**: 建议使用英文，多语言版本填入对应字段
2. **分类**: 目前仅支持 `Men` 或 `Women`
3. **库存**: 设为0时商品不会下架，但会显示"缺货"
4. **图片**: 建议尺寸 800x800px 以上，格式 webp 或 jpg
5. **价格**: 建议同时填写 `price` 和 `originalPrice` 以显示折扣效果

---

## 6. 技术支持

如有问题请联系技术团队:
- 系统故障/Bug 报告
- 数据导入协助
- 功能使用咨询

---

**文档版本**: v3.1  
**更新日期**: 2026-03-23  
**更新内容**: 新增商品CSV导入格式说明，更新后台访问地址
