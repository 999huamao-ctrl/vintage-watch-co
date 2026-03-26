import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

// 原始数据
const raw_data = `product_name product_url price brand_category case_specs dial_specs movement_specs power_reserve functions water_resistance main_image detail_image_1 detail_image_2 detail_image_3 detail_image_4 进货价 库存 SKU 重量 仓库 1:1 Superclone Audemars Piguet Black Ceramic 26579 True Moon Phase https://guowatches.com/product/11-superclone-audemars-piguet-black-ceramic-26579-true-moon-phase/ $899.00 Audemars Piguet 41mm diameter. 12.5mm thickness. black ceramic Grande Tapisserie black ceramic dial with applied gold hour markers and hands Automatic AP caliber 2325. decorated and modified to look like the original 40 hours Hours. minutes. seconds. date. and moon phase / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_18feffc9d3d3468e9f922558befd2e04mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_bec621dd4ac5486cafdbbedce6d6b779mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_23a111bb9c514401a5d1315427938eeamv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a66efffa83cd46f18409be66829a0393mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_8aefcb38526e427592bb2a16d49008famv2.jpg 1800 999 3723 800g guangzhou 1:1 Superclone Audemars Piguet Royal Oak Offshore Alinghi Polaris 26040ST.OO.D002CA.01 https://guowatches.com/product/11-superclone-audemars-piguet-royal-oak-offshore-alinghi-polaris-26040st-oo-d002ca-01/ $1,399.00 Audemars Piguet 44mm diameter. 13.5mm thickness. stainless steel Blue dial with applied gold hour markers and hands Automatic Cloned AP caliber 3120. COSC certified 40 hours Hours. minutes. seconds. date. and chronograph / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3de43c4a57f940feaafbcc325c4ceba1mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_8a7cda3afc1a4062b64a63858a6e93f6mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f428c7c2aa2a4d6ca172e577efb5c808mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_bc237f53a1924e9a9ba643527f4d75e6mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_60f68347846c410c91cf66794ae006cbmv2.jpg 1800 999 3724 800g guangzhou 1:1 Superclone Royal Oak Offshore 5407ST.OO.1220ST.01(silver AP tourbillon) https://guowatches.com/product/11-superclone-royal-oak-offshore-5407st-oo-1220st-01silver-ap-tourbillon/ $899.00 Audemars Piguet 42mm stainless steel Black with white applied hour markers and hands Audemars Piguet Calibre 3132 45 hours / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f37b249c3331452d9e2a825e92f977dcmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3b4ca2f1c57d4444a4f89ff63e866f2bf003.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_96669e6513e9490a8fbc2fdc3924ef4cmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_8bf203b8d0634848aabcc7084a66fb65mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_b2dcb6b745e945f08d0514b878ba2251mv2.jpg 1800 999 3725 800g guangzhou 1:1 Superclone Audemars Piguet Royal Oak (TOURBILLON EXTRA-THIN) https://guowatches.com/product/11-superclone-audemars-piguet-royal-oak-tourbillon-extra-thin/ $799.00 Audemars Piguet &nbsp;&nbsp; Solid 904L stainless steel case Bezel &nbsp; Brushed/polished bezel &nbsp;&nbsp;SWISS&nbsp; hand-winding tourbillon movement 40h &nbsp; Hours and minutes display / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f4a14d2079ae4564a74f659a1123c29fmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a7856b8306104b108bf7587a97dac242mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_7fc5a522fc5a46958011ae2f658814cfmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_809f85b116f443f69ca3c11b29967d72mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3c16d3474cce4f989e169774cdd0537fmv2.jpg 1800 999 3726 800g guangzhou 1:1 Superclone Royal Oak Offshore 5407ST.OO.1220ST.01 https://guowatches.com/product/11-superclone-royal-oak-offshore-5407st-oo-1220st-01/ $899.00 Audemars Piguet 42mm Rose gold Black with white applied hour markers and hands Audemars Piguet Calibre 3132 45 hours / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a5d95c2565e642a1bc9177a361302fdbmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_cbafeebe68254b969c9e9ee7cb2eafd1f003.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_eeff90cb052d4942bb8c1e5690b878a2mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_40e02638da354b70975398cf50b2c98fmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a9edfecea2764896b4a25c0f918ab563mv2.jpg 1800 999 3727 800g guangzhou 1:1 Superclone Audemars Piguet Royal Oak Offshore 18K Rose Gold 26406 https://guowatches.com/product/11-superclone-audemars-piguet-royal-oak-offshore-18k-rose-gold-26406/ $799.00 Audemars Piguet Crystal&nbsp;&nbsp;&nbsp;&nbsp; Scratch-proof sapphire crystal with the colorless anti-reflection coating (Swiss standard. single-sided. same as genuine) and hands (lumed with genuine Super-LumiNova) New Cyclops making the DW size look closer to the genuine! SWISS 3120 automatic chronograph movement at 28800vph; Decoration: Platinum plated movement plate and rotor which are made according to the genuine movement. the best looking AP Calibre 3126 Movement Clone at the moment. 40h / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_b0a2a9919a5d49c59cbceae0237b065amv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_c6a7ea0d84aa43f1ba974bc8a0e1c097mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_10e87af3070d4991bb615bf2e2389373mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_77d0c7909dd54d23ac15434c45be0f66mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_6c2a1098013544b6a538417a89feee81mv2.jpg 1800 999 3728 800g guangzhou 1:1 Superclone Audemars Piguet RO Ultra Thin 15202 https://guowatches.com/product/11-superclone-audemars-piguet-ro-ultra-thin-15202/ $799.00 Audemars Piguet &nbsp;Stainless Steel 904L Black Dial &nbsp;SWISS&nbsp;Audemars Piguet 3120 Automatic Movement Like Genuine 40h Hours. Minutes. Seconds and Date / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_88bc4c7a7dad4bedbda4175674f8f6a2mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_6648044ede7c4fc3b46bd148f0b222f9mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_7562b7525474434ca647589d34c63123mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_851c80c9ea5a4e84b37d8e3d34d1d999mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_0eb7b13c1ac74e398bb4dfc86e42d756mv2.jpg 1800 999 800g guangzhou Audemars Piguet Diver Chronograph 26703ST.OOO. 1:1 SUPERCLONE https://guowatches.com/product/audemars-piguet-diver-chronograph-26703st-ooo-11-superclone/ $799.00 Audemars Piguet Stainless Steel 904L Grande Tapisserie dial with applied hour markers and Royal Oak hands, date window at 3 o'clock, luminescent coating SWISS Audemars Piguet 3124 Automatic Movement 28800bph. SECONDS Running at 3@ 40h / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_82a6d7d580d74d699fd43b9b99a63e5bmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f7e8ed3b0fef4c15a300d083394bdef5mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_edae28147191445181e75a8e9712ddc3mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_1464481779c74c7ebc1ae8a557fc1309mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_bedcb988d74c499da024c6b2fb12dd4amv2.jpg 1800 999 800g guangzhou 1:1 Superclone Audemars Piguet Royal Oak Chronograph https://guowatches.com/product/11-superclone-audemars-piguet-royal-oak-chronograph/ $799.00 Audemars Piguet Complete with AP MArkings and Engravings.Scratch Proof Sapphire Crystals with Correct Date Cyclops and Double AR Coating 904L Stainless Steel Strap completed with AP Markings and Engravings as per the originals and AP Folding Clasp 42MM in Diameter x 16MM Thick Sapphire Crystals complete with AP markings and Engravings Exact Weight and Dimensions to the Authentic Watches Water Resistant and Waterproof up to 50 Meters Free Shipping on this item worldwide - For more information please contact usThe Images you see are of Actual Watches. You will get exactly the same watch you see in the Images with 3 Functional Sub Dials and Date Window.904 L Steel Case Complete with AP MArkings and Engravings.Scratch Proof Sapphire Crystals with Correct Date Cyclops and Double AR Coating 904L Stainless Steel Strap completed with AP Markings and Engravings as per the originals and AP Folding Clasp 42MM in Diameter x 16MM Thick Sapphire Crystals complete with AP markings and Engravings Exact Weight and Dimensions to the Authentic Watches Water Resistant and Waterproof up to 50 Meters Free Shipping on this item worldwide - For more information please contact usThe Images you see are of Actual Watches. You will get exactly the same watch you see in the Images re-aligned to resemble the 3126 Audemars Piguet Movement with Functional stopwatch feature like the Authentic Silver Toned ??Grande Tapisserie?? dial with 3 Functional Sub Dials and Date Window.904 L Steel Case Complete with AP MArkings and Engravings.Scratch Proof Sapphire Crystals with Correct Date Cyclops and Double AR Coating 904L Stainless Steel Strap completed with AP Markings and Engravings as per the originals and AP Folding Clasp 42MM in Diameter x 16MM Thick Sapphire Crystals complete with AP markings and Engravings Exact Weight and Dimensions to the Authentic Watches Water Resistant and Waterproof up to 50 Meters Free Shipping on this item worldwide - For more information please contact usThe Images you see are of Actual Watches. You will get exactly the same watch you see in the Images 40h / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_6123079821e24bff808c3bc68d8f981amv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3ca8b22f294d40e3b01db907c2c8c6eamv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_2f530006e2454a02a95559ff2bae581dmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_7d9b811db29b4abeb3ba1caed48a8f17mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_4d56f7cf99a24c759ed31cdfefae9eebmv2.jpg 1800 999 800g guangzhou Audemars Piguet RO 15400 1:1 Superclone https://guowatches.com/product/audemars-piguet-ro-15400-11-superclone/ $814.00 Audemars Piguet Stainless Steel 904L Blue Dial SWISS Audemars Piguet 3120 Automatic Movement Like Genuine 40h Hours. Minutes. Seconds and Date / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_e73b83d83eaf4e02af556cdb01c60f01mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_589aadae20494d27b320a304209faddfmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_40f9c91863ef4daab99352ceab81da2cmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_800bc0fd7d0840b6ada28cb1b47ad41bmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_0448c33fb6fe440cb5c65da106bad1c1mv2.jpg 1800 999 800g guangzhou 1:1 Superclone Audemars Piguet RO 15400( Rose gold black AP) https://guowatches.com/product/11-superclone-audemars-piguet-ro-15400-rose-gold-black-ap/ $899.00 Audemars Piguet &nbsp;Stainless Steel 904L Black Dial &nbsp;SWISS&nbsp;Audemars Piguet 3120 Automatic Movement Like Genuine 40h Hours. Minutes. Seconds and Date / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_25b32c416df149c8a259108a33a51fa6mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_e3bc25e1553349f5a879fb65a5543f5fmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_96a9be1b3bbd453c8c9b932a7c9bf045mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_d3b320dbc021419287457aa874cd42d0mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_e388101b54734760b4991b0642a8aff5mv2.jpg 1800 999 800g guangzhou 1:1 Superclone Audemars Piquet Royal Oak Offshore 26405 https://guowatches.com/product/11-superclone-audemars-piquet-royal-oak-offshore-26405/ $799.00 Audemars Piguet back. &nbsp; &nbsp; &nbsp; &nbsp; 904L Stainless steel&nbsp;&nbsp;Double AR??d cyclops at 3:00 &nbsp;&nbsp;&nbsp; Base Movement: SWISS 3120 automatic chronograph movement at 28800vph; Decoration: Platinum plated movement plate and rotor which are made according to the genuine movement. the best looking AP Calibre 3126 Movement Clone at the moment. 40h &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Hours. minutes. sub-seconds. date and chronograph / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_da2a4771fc6f4cc9b717ab8e6e64b4d1mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_642903b24a3942aeaed2b9fb3c73b7abmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_d72d7ba790b245208d6f843535250cf2mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_db28ca0a244b48f29449964d184d43e4mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_ac467ae542644e5da7f1bb189e19bd61mv2.jpg 1800 999 800g guangzhou Patek Philippe Nautilus 7118/1200R-010 35MM Rose Gold(1:1 Super Clone) https://guowatches.com/product/patek-philippe-nautilus-7118-1200r-010-35mm-rose-gold11-super-clone/ $799.00 Patek Philippe 3235 40h / https://guowatches.com/wp-content/uploads/2026/01/1月19日-31-7.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-3-8.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-36-6.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-32-7.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-33-7.jpg 1800 999 800g guangzhou Patek Philippe Nautilus 5711/1R-001 in Rose Gold Grey Dial(1:1 Super Clone) https://guowatches.com/product/patek-philippe-nautilus-5711-1r-001-in-rose-gold-grey-dial11-super-clone/ $1,199.00 Patek Philippe 3235 40h / https://guowatches.com/wp-content/uploads/2026/01/1月19日-34-6.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-31-6.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-36-5.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-33-6.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-37-5.jpg 1800 999 800g guangzhou Audemars Piguet Royal Jumbo Oak Extra Thin 1:1 Superclone https://guowatches.com/product/audemars-piguet-royal-jumbo-oak-extra-thin-11-superclone/ $849.00 Audemars Piguet Cover with Date Window at 3 O Clock - An updated 2018 Ultimate Version 40h / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_01ec6d7a122147be955521d2e41b884fmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_14bd044e5ad34e9eb14ff539bad9995emv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_73c1b65d47714cfcb4ae016c6246506bmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_21e2ee620e6542dc8eb59435ccf1482emv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_347c8eb26f074a24bbb6f54abd09bda4mv2.jpg 1800 999 800g guangzhou Audemars Piguet Royal Oak (TOURBILLON EXTRA-THIN) 1:1 Superclone https://guowatches.com/product/audemars-piguet-royal-oak-tourbillon-extra-thin-11-superclone/ $959.00 Audemars Piguet &nbsp;&nbsp; Solid 904L stainless steel case Bezel &nbsp; Brushed/polished bezel &nbsp;&nbsp;SWISS&nbsp; hand-winding tourbillon movement 40h &nbsp; Hours and minutes display / https://guowatches.com/wp-content/uploads/2026/01/4d39d6_dcaea82f941e4e969fd05c818baf22c6mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_4dd7ec6078a843d9bb9a20e18a25b6bbmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_14840b0712084df2834f59f659f556abmv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_63c360f939fb4de8a97f5a8c723a6135mv2.jpg https://guowatches.com/wp-content/uploads/2026/01/4d39d6_d20b9927f3d6433baa3886bd38b4b3d8mv2.jpg 1800 999 800g guangzhou Patek Philippe Nautilus 5712/R Grey Dial Leather Strap(1:1Super Clone) https://guowatches.com/product/patek-philippe-nautilus-5712-r-grey-dial-leather-strap11super-clone/ $1,199.00 Patek Philippe 3235 40h / https://guowatches.com/wp-content/uploads/2026/01/1月19日-33-5.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-35-4.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-38-3.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-3-6.jpg https://guowatches.com/wp-content/uploads/2026/01/1月19日-32-5.jpg 1800 999 800g guangzhou`;

// USD 到 EUR 汇率
const USD_TO_EUR_RATE = 0.92;

// 提取表径尺寸 (mm)
function extractCaseSize(caseSpecs) {
    if (!caseSpecs) return null;
    const match = caseSpecs.match(/(\d+)\s*mm/i);
    return match ? parseInt(match[1]) : null;
}

// 判断分类：35mm以下→Women，其他→Men
function getCategory(caseSize) {
    if (caseSize && caseSize < 35) return 'Women';
    return 'Men';
}

// 转换USD到EUR
function convertUsdToEur(usdPrice) {
    return new Decimal(usdPrice).times(USD_TO_EUR_RATE).toDecimalPlaces(2);
}

// 解析价格字符串 (如 "$899.00" -> 899.00)
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[$,]/g, '');
    return parseFloat(cleaned) || 0;
}

// 解析原始数据
function parseProducts() {
    const lines = raw_data.trim().split('\n');
    const headers = lines[0].split(' ');
    
    console.log('字段列表:');
    headers.forEach((h, i) => console.log(`  ${i}: ${h}`));
    console.log(`\n总产品数: ${lines.length - 1}\n`);
    
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // 使用正则表达式解析空格分隔的数据，但要注意URL和图片链接中的空格
        // 更简单的方法：按字段逐个解析
        const parts = line.split(' ');
        
        // 找到价格位置 (格式: $xxx.xx)
        let priceIdx = -1;
        for (let j = 0; j < parts.length; j++) {
            if (parts[j].startsWith('$')) {
                priceIdx = j;
                break;
            }
        }
        
        if (priceIdx === -1) {
            console.log(`跳过第 ${i} 行: 未找到价格`);
            continue;
        }
        
        // 品牌是价格后的第一个字段
        const brand = parts[priceIdx + 1] + ' ' + parts[priceIdx + 2];
        
        // 产品名称是价格前的所有内容（去掉URL）
        const urlEndIdx = priceIdx - 1;
        let urlStartIdx = -1;
        for (let j = priceIdx - 1; j >= 0; j--) {
            if (parts[j].startsWith('http')) {
                urlStartIdx = j;
                break;
            }
        }
        
        const productName = parts.slice(0, urlStartIdx).join(' ');
        const productUrl = parts.slice(urlStartIdx, urlEndIdx + 1).join(' ');
        const priceStr = parts[priceIdx];
        
        // 找到图片URL (以 http 开头且包含 guowatches.com)
        const imageUrls = [];
        for (const part of parts) {
            if (part.startsWith('https://guowatches.com') || part.startsWith('http://guowatches.com')) {
                imageUrls.push(part);
            }
        }
        
        // 找到库存数字 (在价格后的某个位置通常是 999 或类似的数字)
        let stock = 999;
        let costPrice = 1800; // 进货价
        
        // 根据行内容提取case_specs等字段（在行中间部分）
        const lineAfterBrand = parts.slice(priceIdx + 3).join(' ');
        
        // 提取表壳规格（通常在品牌后的文本中，直到遇到机芯相关词汇）
        let caseSpecs = '';
        let dialSpecs = '';
        let movementSpecs = '';
        let powerReserve = '';
        let functions = '';
        let waterResistance = '';
        
        // 简单解析：提取case size
        const caseSizeMatch = line.match(/(\d+)\s*mm/i);
        const caseSize = caseSizeMatch ? caseSizeMatch[1] + 'mm' : '';
        
        // 提取材质
        let caseMaterial = 'Stainless Steel';
        if (line.toLowerCase().includes('ceramic')) caseMaterial = 'Ceramic';
        else if (line.toLowerCase().includes('rose gold')) caseMaterial = 'Rose Gold';
        else if (line.toLowerCase().includes('gold')) caseMaterial = 'Gold';
        
        // 提取机芯
        const movementMatch = line.match(/(caliber|calibre|movement)[\s:]*(\w+[\s\w]*)/i);
        movementSpecs = movementMatch ? movementMatch[2] : 'Automatic';
        
        // 提取动力储存
        const powerMatch = line.match(/(\d+)\s*(hours|h)/i);
        powerReserve = powerMatch ? powerMatch[1] + ' hours' : '';
        
        // 提取表盘描述
        const dialMatch = line.match(/(black|blue|white|grey|gray|silver)\s*(dial|tapisserie)/i);
        dialSpecs = dialMatch ? dialMatch[0] : '';
        
        // 提取防水深度
        const waterMatch = line.match(/(\d+)\s*meters/i);
        waterResistance = waterMatch ? waterMatch[1] + ' meters' : '50 meters';
        
        const priceUsd = parsePrice(priceStr);
        const priceEur = convertUsdToEur(priceUsd);
        const originalPriceEur = new Decimal(priceUsd).toDecimalPlaces(2);
        const caseSizeNum = extractCaseSize(caseSpecs || line);
        const category = getCategory(caseSizeNum);
        
        // 构建描述
        const description = [
            caseSpecs,
            dialSpecs,
            `Movement: ${movementSpecs}`,
            powerReserve ? `Power Reserve: ${powerReserve}` : '',
            waterResistance ? `Water Resistance: ${waterResistance}` : ''
        ].filter(Boolean).join('. ');
        
        const product = {
            name: productName.replace(/&nbsp;/g, ' ').trim(),
            price: priceEur,
            originalPrice: originalPriceEur,
            category,
            stock,
            brand: brand.trim(),
            image: imageUrls[0] || '',
            detailImage1: imageUrls[1] || null,
            detailImage2: imageUrls[2] || null,
            detailImage3: imageUrls[3] || null,
            detailImage4: imageUrls[4] || null,
            dial: dialSpecs,
            caseMaterial,
            movement: movementSpecs,
            powerReserve,
            functions,
            isActive: true
        };
        
        products.push(product);
        console.log(`解析产品 ${i}: ${product.name.substring(0, 50)}... | 价格: €${priceEur} | 分类: ${category}`);
    }
    
    return products;
}

// 主函数
async function main() {
    try {
        console.log('=== 开始导入手表产品数据 ===\n');
        
        // 解析产品数据
        const products = parseProducts();
        console.log(`\n共解析 ${products.length} 款产品\n`);
        
        // 导入数据库
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        
        for (const product of products) {
            try {
                // 检查产品是否已存在（根据名称）
                const existing = await prisma.product.findFirst({
                    where: { name: product.name }
                });
                
                if (existing) {
                    console.log(`产品已存在，更新: ${product.name.substring(0, 50)}...`);
                    await prisma.product.update({
                        where: { id: existing.id },
                        data: product
                    });
                } else {
                    console.log(`创建新产品: ${product.name.substring(0, 50)}...`);
                    await prisma.product.create({ data: product });
                }
                successCount++;
            } catch (err) {
                errorCount++;
                errors.push({ name: product.name, error: err.message });
                console.error(`导入失败: ${product.name.substring(0, 50)}... - ${err.message}`);
            }
        }
        
        console.log('\n=== 导入完成 ===');
        console.log(`成功: ${successCount} 款`);
        console.log(`失败: ${errorCount} 款`);
        
        if (errors.length > 0) {
            console.log('\n错误详情:');
            errors.forEach((e, i) => console.log(`  ${i + 1}. ${e.name.substring(0, 50)}... - ${e.error}`));
        }
        
    } catch (error) {
        console.error('导入过程中发生错误:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
