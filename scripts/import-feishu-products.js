const { PrismaClient } = require('@prisma/client');

const productsData = [
  {
    product_name: "1:1 Superclone Audemars Piguet Black Ceramic 26579 True Moon Phase",
    price: "$899.00",
    brand_category: "Audemars Piguet",
    case_specs: "41mm diameter. 12.5mm thickness. black ceramic",
    dial_specs: "Grande Tapisserie black ceramic dial with applied gold hour markers and hands",
    movement_specs: "Automatic AP caliber 2325. decorated and modified to look like the original",
    functions: "Hours. minutes. seconds. date. and moon phase",
    power_reserve: "40 hours",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_18feffc9d3d3468e9f922558befd2e04mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_bec621dd4ac5486cafdbbedce6d6b779mv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_23a111bb9c514401a5d1315427938eeamv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a66efffa83cd46f18409be66829a0393mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_8aefcb38526e427592bb2a16d49008famv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piguet Royal Oak Offshore Alinghi Polaris 26040ST.OO.D002CA.01",
    price: "$1,399.00",
    brand_category: "Audemars Piguet",
    case_specs: "44mm diameter. 13.5mm thickness. stainless steel",
    dial_specs: "Blue dial with applied gold hour markers and hands",
    movement_specs: "Automatic Cloned AP caliber 3120. COSC certified",
    functions: "Hours. minutes. seconds. date. and chronograph",
    power_reserve: "40 hours",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3de43c4a57f940feaafbcc325c4ceba1mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_8a7cda3afc1a4062b64a63858a6e93f6mv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f428c7c2aa2a4d6ca172e577efb5c808mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_bc237f53a1924e9a9ba643527f4d75e6mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_60f68347846c410c91cf66794ae006cbmv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Royal Oak Offshore 5407ST.OO.1220ST.01(silver AP tourbillon)",
    price: "$899.00",
    brand_category: "Audemars Piguet",
    case_specs: "42mm stainless steel",
    dial_specs: "Black with white applied hour markers and hands",
    movement_specs: "Audemars Piguet Calibre 3132",
    functions: "",
    power_reserve: "45 hours",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f37b249c3331452d9e2a825e92f977dcmv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3b4ca2f1c57d4444a4f89ff63e866f2bf003.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_96669e6513e9490a8fbc2fdc3924ef4cmv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_8bf203b8d0634848aabcc7084a66fb65mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_b2dcb6b745e945f08d0514b878ba2251mv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piguet Royal Oak (TOURBILLON EXTRA-THIN)",
    price: "$799.00",
    brand_category: "Audemars Piguet",
    case_specs: "Solid 904L stainless steel case",
    dial_specs: "Bezel Brushed/polished bezel",
    movement_specs: "SWISS hand-winding tourbillon movement",
    functions: "Hours and minutes display",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f4a14d2079ae4564a74f659a1123c29fmv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a7856b8306104b108bf7587a97dac242mv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_7fc5a522fc5a46958011ae2f658814cfmv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_809f85b116f443f69ca3c11b29967d72mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3c16d3474cce4f989e169774cdd0537fmv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Royal Oak Offshore 5407ST.OO.1220ST.01",
    price: "$899.00",
    brand_category: "Audemars Piguet",
    case_specs: "42mm Rose gold",
    dial_specs: "Black with white applied hour markers and hands",
    movement_specs: "Audemars Piguet Calibre 3132",
    functions: "",
    power_reserve: "45 hours",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a5d95c2565e642a1bc9177a361302fdbmv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_cbafeebe68254b969c9e9ee7cb2eafd1f003.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_eeff90cb052d4942bb8c1e5690b878a2mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_40e02638da354b70975398cf50b2c98fmv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_a9edfecea2764896b4a25c0f918ab563mv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piguet Royal Oak Offshore 18K Rose Gold 26406",
    price: "$799.00",
    brand_category: "Audemars Piguet",
    case_specs: "Scratch-proof sapphire crystal with the colorless anti-reflection coating",
    dial_specs: "and hands lumed with genuine Super-LumiNova New Cyclops",
    movement_specs: "SWISS 3120 automatic chronograph movement at 28800vph; Decoration: Platinum plated movement plate",
    functions: "",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_b0a2a9919a5d49c59cbceae0237b065amv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_c6a7ea0d84aa43f1ba974bc8a0e1c097mv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_10e87af3070d4991bb615bf2e2389373mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_77d0c7909dd54d23ac15434c45be0f66mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_6c2a1098013544b6a538417a89feee81mv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piguet RO Ultra Thin 15202",
    price: "$799.00",
    brand_category: "Audemars Piguet",
    case_specs: "Stainless Steel 904L",
    dial_specs: "Black Dial",
    movement_specs: "SWISS Audemars Piguet 3120 Automatic Movement Like Genuine",
    functions: "Hours. Minutes. Seconds and Date",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_88bc4c7a7dad4bedbda4175674f8f6a2mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_6648044ede7c4fc3b46bd148f0b222f9mv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_7562b7525474434ca647589d34c63123mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_851c80c9ea5a4e84b37d8e3d34d1d999mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_0eb7b13c1ac74e398bb4dfc86e42d756mv2.jpg",
    stock: 999
  },
  {
    product_name: "Audemars Piguet Diver Chronograph 26703ST.OOO. 1:1 SUPERCLONE",
    price: "$799.00",
    brand_category: "Audemars Piguet",
    case_specs: "Stainless Steel 904L",
    dial_specs: "Grande Tapisserie dial with applied hour markers and Royal Oak hands, date window at 3 o'clock, luminescent coating",
    movement_specs: "SWISS Audemars Piguet 3124 Automatic Movement 28800bph. SECONDS Running at 3@",
    functions: "Hours. Minutes. Seconds. Date and Chronograph with SECONDS Running at 3@ Like Genuine",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_82a6d7d580d74d699fd43b9b99a63e5bmv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_f7e8ed3b0fef4c15a300d083394bdef5mv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_edae28147191445181e75a8e9712ddc3mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_1464481779c74c7ebc1ae8a557fc1309mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_bedcb988d74c499da024c6b2fb12dd4amv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piguet Royal Oak Chronograph",
    price: "$799.00",
    brand_category: "Audemars Piguet",
    case_specs: "42MM in Diameter x 16MM Thick Sapphire Crystals complete with AP markings",
    dial_specs: "Silver Toned Grande Tapisserie dial with 3 Functional Sub Dials and Date Window",
    movement_specs: "re-aligned to resemble the 3126 Audemars Piguet Movement with Functional stopwatch feature",
    functions: "",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_6123079821e24bff808c3bc68d8f981amv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_3ca8b22f294d40e3b01db907c2c8c6eamv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_2f530006e2454a02a95559ff2bae581dmv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_7d9b811db29b4abeb3ba1caed48a8f17mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_4d56f7cf99a24c759ed31cdfefae9eebmv2.jpg",
    stock: 999
  },
  {
    product_name: "Audemars Piguet RO 15400 1:1 Superclone",
    price: "$814.00",
    brand_category: "Audemars Piguet",
    case_specs: "Stainless Steel 904L",
    dial_specs: "Blue Dial",
    movement_specs: "SWISS Audemars Piguet 3120 Automatic Movement Like Genuine",
    functions: "Hours. Minutes. Seconds and Date",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_e73b83d83eaf4e02af556cdb01c60f01mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_589aadae20494d27b320a304209faddfmv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_40f9c91863ef4daab99352ceab81da2cmv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_800bc0fd7d0840b6ada28cb1b47ad41bmv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_0448c33fb6fe440cb5c65da106bad1c1mv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piguet RO 15400( Rose gold black AP)",
    price: "$899.00",
    brand_category: "Audemars Piguet",
    case_specs: "Stainless Steel 904L",
    dial_specs: "Black Dial",
    movement_specs: "SWISS Audemars Piguet 3120 Automatic Movement Like Genuine",
    functions: "Hours. Minutes. Seconds and Date",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_25b32c416df149c8a259108a33a51fa6mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_e3bc25e1553349f5a879fb65a5543f5fmv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_96a9be1b3bbd453c8c9b932a7c9bf045mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_d3b320dbc021419287457aa874cd42d0mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_e388101b54734760b4991b0642a8aff5mv2.jpg",
    stock: 999
  },
  {
    product_name: "1:1 Superclone Audemars Piquet Royal Oak Offshore 26405",
    price: "$799.00",
    brand_category: "Audemars Piguet",
    case_specs: "back",
    dial_specs: "904L Stainless steel Double AR cyclops at 3:00",
    movement_specs: "Base Movement: SWISS 3120 automatic chronograph movement at 28800vph; Decoration: Platinum plated movement plate",
    functions: "Hours. minutes. sub-seconds. date and chronograph",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_da2a4771fc6f4cc9b717ab8e6e64b4d1mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_642903b24a3942aeaed2b9fb3c73b7abmv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_d72d7ba790b245208d6f843535250cf2mv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_db28ca0a244b48f29449964d184d43e4mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_ac467ae542644e5da7f1bb189e19bd61mv2.jpg",
    stock: 999
  },
  {
    product_name: "Patek Philippe Nautilus 7118/1200R-010 35MM Rose Gold(1:1 Super Clone)",
    price: "$799.00",
    brand_category: "Patek Philippe",
    case_specs: "35mm Rose Gold",
    dial_specs: "",
    movement_specs: "3235",
    functions: "",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/1",
    stock: 999
  },
  {
    product_name: "Patek Philippe Nautilus 5711/1R-001 in Rose Gold Grey Dial(1:1 Super Clone)",
    price: "$1,199.00",
    brand_category: "Patek Philippe",
    case_specs: "Rose Gold",
    dial_specs: "Grey Dial",
    movement_specs: "3235",
    functions: "",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/1",
    stock: 999
  },
  {
    product_name: "Audemars Piguet Royal Jumbo Oak Extra Thin 1:1 Superclone",
    price: "$849.00",
    brand_category: "Audemars Piguet",
    case_specs: "Cover",
    dial_specs: "with Date Window at 3 O Clock",
    movement_specs: "- An updated 2018 Ultimate Version",
    functions: "",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_01ec6d7a122147be955521d2e41b884fmv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_14bd044e5ad34e9eb14ff539bad9995emv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_73c1b65d47714cfcb4ae016c6246506bmv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_21e2ee620e6542dc8eb59435ccf1482emv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_347c8eb26f074a24bbb6f54abd09bda4mv2.jpg",
    stock: 999
  },
  {
    product_name: "Audemars Piguet Royal Oak (TOURBILLON EXTRA-THIN) 1:1 Superclone",
    price: "$959.00",
    brand_category: "Audemars Piguet",
    case_specs: "Solid 904L stainless steel case",
    dial_specs: "Bezel Brushed/polished bezel",
    movement_specs: "SWISS hand-winding tourbillon movement",
    functions: "Hours and minutes display",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_dcaea82f941e4e969fd05c818baf22c6mv2.jpg",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_4dd7ec6078a843d9bb9a20e18a25b6bbmv2.jpg",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_14840b0712084df2834f59f659f556abmv2.jpg",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_63c360f939fb4de8a97f5a8c723a6135mv2.jpg",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/4d39d6_d20b9927f3d6433baa3886bd38b4b3d8mv2.jpg",
    stock: 999
  },
  {
    product_name: "Patek Philippe Nautilus 5712/R Grey Dial Leather Strap(1:1Super Clone)",
    price: "$1,199.00",
    brand_category: "Patek Philippe",
    case_specs: "Leather Strap",
    dial_specs: "Grey Dial",
    movement_specs: "3235",
    functions: "",
    power_reserve: "40h",
    water_resistance: "/",
    main_image: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_1: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_2: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_3: "https://guowatches.com/wp-content/uploads/2026/01/1",
    detail_image_4: "https://guowatches.com/wp-content/uploads/2026/01/1",
    stock: 999
  }
];

function parsePrice(priceStr) {
  const match = priceStr.match(/[\d,]+\.?\d*/);
  if (match) {
    const usdPrice = parseFloat(match[0].replace(',', ''));
    return Math.round(usdPrice * 0.92 * 100) / 100; // USD to EUR
  }
  return 0;
}

function determineCategory(productName, caseSpecs) {
  // Check for 35mm in product name
  if (productName.includes('35mm') || productName.includes('35MM')) {
    return 'Women';
  }
  // Check case specs
  const match = caseSpecs.match(/(\d+)\s*mm/i);
  if (match) {
    const size = parseInt(match[1]);
    if (size <= 35) {
      return 'Women';
    }
  }
  return 'Men';
}

function createDialDescription(p) {
  const parts = [];
  if (p.dial_specs) parts.push(p.dial_specs);
  if (p.case_specs) parts.push(`Case: ${p.case_specs}`);
  if (p.movement_specs) parts.push(`Movement: ${p.movement_specs}`);
  if (p.functions) parts.push(`Functions: ${p.functions}`);
  if (p.power_reserve) parts.push(`Power Reserve: ${p.power_reserve}`);
  return parts.join(' | ').substring(0, 500); // limit to 500 chars
}

async function importProducts() {
  const prisma = new PrismaClient();
  
  try {
    let importedCount = 0;
    const errors = [];
    
    for (const p of productsData) {
      try {
        // Parse price (USD to EUR)
        const eurPrice = parsePrice(p.price);
        const originalPrice = Math.round(eurPrice * 1.3 * 100) / 100; // 30% markup
        
        // Determine category
        const category = determineCategory(p.product_name, p.case_specs);
        
        // Create dial description
        const dialDesc = createDialDescription(p);
        
        // Check if product exists
        const existing = await prisma.product.findFirst({
          where: { name: p.product_name }
        });
        
        if (existing) {
          // Update existing
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              price: eurPrice,
              originalPrice: originalPrice,
              stock: p.stock || 999,
              image: p.main_image || '',
              detailImage1: p.detail_image_1 || '',
              detailImage2: p.detail_image_2 || '',
              detailImage3: p.detail_image_3 || '',
              detailImage4: p.detail_image_4 || '',
              dial: dialDesc,
              caseMaterial: (p.case_specs || '').substring(0, 100),
              movement: (p.movement_specs || '').substring(0, 100),
              powerReserve: p.power_reserve || '',
              functions: p.functions || '',
              isActive: true,
            }
          });
          console.log(`Updated: ${p.product_name}`);
        } else {
          // Create new
          await prisma.product.create({
            data: {
              name: p.product_name,
              price: eurPrice,
              originalPrice: originalPrice,
              category: category,
              stock: p.stock || 999,
              brand: p.brand_category || '',
              image: p.main_image || '',
              detailImage1: p.detail_image_1 || '',
              detailImage2: p.detail_image_2 || '',
              detailImage3: p.detail_image_3 || '',
              detailImage4: p.detail_image_4 || '',
              dial: dialDesc,
              caseMaterial: (p.case_specs || '').substring(0, 100),
              movement: (p.movement_specs || '').substring(0, 100),
              powerReserve: p.power_reserve || '',
              functions: p.functions || '',
              isActive: true,
            }
          });
          console.log(`Created: ${p.product_name}`);
        }
        
        importedCount++;
      } catch (e) {
        errors.push(`Error: ${p.product_name} - ${e.message}`);
        console.error(`Error: ${p.product_name} - ${e.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('Import Complete!');
    console.log(`Total imported: ${importedCount}`);
    console.log(`Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(err => console.log(`  - ${err}`));
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

importProducts();
