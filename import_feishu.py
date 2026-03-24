#!/usr/bin/env python3
"""
Import products from Feishu Bitable to PostgreSQL
"""
import requests
import json
import os
import re
from datetime import datetime
from urllib.parse import urlparse
import psycopg2
from psycopg2.extras import execute_values

# Database
DATABASE_URL = "postgresql://neondb_owner:npg_TPmMDniR7Ow9@ep-spring-river-aloa79ru-pooler.c-3.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# Feishu Config
FEISHU_CONFIG = {
    "app_id": "cli_a94b4ef0bbbb5bcb",
    "app_secret": "Wef7lN4Bv9AsBPU3SIZPZg2UaVznQnJf",
    "app_token": "HTRMbB99garcMfswhsncGrmxnLf",
    "table_id": "tbl2vGaFlotqlaO4"
}

def get_access_token():
    """Get Feishu app access token"""
    url = "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal"
    resp = requests.post(url, json={
        "app_id": FEISHU_CONFIG["app_id"],
        "app_secret": FEISHU_CONFIG["app_secret"]
    })
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"Failed to get token: {data.get('msg')}")
    return data.get("app_access_token") or data.get("tenant_access_token")

def fetch_records(token):
    """Fetch all records from Feishu Bitable"""
    records = []
    page_token = None
    
    while True:
        url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{FEISHU_CONFIG['app_token']}/tables/{FEISHU_CONFIG['table_id']}/records"
        params = {"page_size": 500}
        if page_token:
            params["page_token"] = page_token
        
        resp = requests.get(url, headers={"Authorization": f"Bearer {token}"}, params=params)
        data = resp.json()
        
        if data.get("code") != 0:
            raise Exception(f"API error: {data.get('msg')}")
        
        items = data.get("data", {}).get("items", [])
        records.extend(items)
        
        if not data.get("data", {}).get("has_more"):
            break
        page_token = data.get("data", {}).get("page_token")
    
    return records

def extract_image_url(field):
    """Extract image URL from Feishu field"""
    if not field:
        return None
    if isinstance(field, str):
        return field
    if isinstance(field, dict):
        return field.get("link")
    return None

def parse_price(price_str):
    """Parse price from string, convert USD to EUR"""
    if not price_str:
        return 0
    if isinstance(price_str, (int, float)):
        usd = float(price_str)
    else:
        match = re.search(r'[\d,]+\.?\d*', str(price_str))
        if not match:
            return 0
        usd = float(match.group().replace(',', ''))
    # USD to EUR (0.92 rate)
    return round(usd * 0.92, 2)

def extract_case_size(case_specs):
    """Extract case size from specs"""
    if not case_specs:
        return 42
    match = re.search(r'(\d+(?:\.\d+)?)\s*mm', case_specs, re.IGNORECASE)
    return float(match.group(1)) if match else 42

def determine_gender(case_specs):
    """Determine gender category based on case size"""
    size = extract_case_size(case_specs)
    return "Women" if size < 35 else "Men"

def transform_record(record):
    """Transform Feishu record to product data"""
    f = record.get("fields", {})
    
    # Skip if no product name or price
    if not f.get("product_name"):
        return None
    
    price_str = f.get("price", "0")
    if not price_str:
        return None
    
    eur_price = parse_price(price_str)
    if eur_price <= 0:
        return None
    
    original_price = round(eur_price * 1.3, 2)  # 30% markup
    case_specs = f.get("case_specs", "")
    
    # Extract weight (remove 'g' and convert to kg)
    weight_str = f.get("重量", "")
    weight = None
    if weight_str:
        match = re.search(r'(\d+)', str(weight_str))
        if match:
            weight = int(match.group()) / 1000  # g to kg
    
    # Extract stock
    stock = 999
    stock_str = f.get("库存", "")
    if stock_str:
        try:
            stock = int(stock_str)
        except:
            pass
    
    now = datetime.now()
    product = {
        "id": record.get("id"),
        "name": f.get("product_name", ""),
        "price": eur_price,
        "originalPrice": original_price,
        "category": determine_gender(case_specs),
        "brand": f.get("brand_category", "Unknown"),
        "image": extract_image_url(f.get("main_image")) or "",
        "detailImage1": extract_image_url(f.get("detail_image_1")),
        "detailImage2": extract_image_url(f.get("detail_image_2")),
        "detailImage3": extract_image_url(f.get("detail_image_3")),
        "detailImage4": extract_image_url(f.get("detail_image_4")),
        "stock": stock,
        "caseMaterial": (case_specs or "")[:100] if case_specs else None,
        "dial": f.get("dial_specs", "")[:500] if f.get("dial_specs") else None,
        "movement": f.get("movement_specs", "")[:100] if f.get("movement_specs") else None,
        "functions": f.get("functions", "")[:200] if f.get("functions") else None,
        "powerReserve": f.get("power_reserve", "")[:50] if f.get("power_reserve") else None,
        "waterResistance": f.get("water_resistance", "")[:50] if f.get("water_resistance") else None,
        "sku": f.get("SKU", "")[:50] if f.get("SKU") else None,
        "weight": weight,
        "description": f.get("描述", "")[:2000] if f.get("描述") else None,
        "isActive": True,
        "createdAt": now,
        "updatedAt": now
    }
    
    return product

def import_to_database(products):
    """Import products to PostgreSQL"""
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    try:
        # Clear existing products
        cursor.execute('DELETE FROM products')
        print(f"Cleared {cursor.rowcount} old products")
        
        # Insert new products
        values = []
        for p in products:
            values.append((
                p["id"], p["name"], p["price"], p["originalPrice"], p["category"],
                p["brand"], p["image"], p["stock"], p["isActive"],
                p["caseMaterial"], p["dial"], p["movement"], p["functions"],
                p["powerReserve"], p["waterResistance"], p["sku"], p["weight"],
                p["description"], p["detailImage1"], p["detailImage2"],
                p["detailImage3"], p["detailImage4"], p["createdAt"], p["updatedAt"]
            ))
        
        execute_values(cursor, '''
            INSERT INTO products (
                id, name, price, "originalPrice", category, brand, image, stock, "isActive",
                "caseMaterial", dial, movement, functions, "powerReserve", water_resistance,
                sku, weight, description, "detailImage1", "detailImage2", "detailImage3", "detailImage4",
                "createdAt", "updatedAt"
            ) VALUES %s
        ''', values)
        
        conn.commit()
        return len(values)
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def main():
    print("🚀 Starting product import from Feishu...\n")
    
    # Step 1: Get access token
    print("1️⃣ Getting Feishu access token...")
    token = get_access_token()
    print(f"✅ Token obtained: {token[:30]}...\n")
    
    # Step 2: Fetch records
    print("2️⃣ Fetching records from Feishu...")
    records = fetch_records(token)
    print(f"✅ Fetched {len(records)} records\n")
    
    # Step 3: Transform records
    print("3️⃣ Transforming records...")
    products = []
    empty_count = 0
    for record in records:
        product = transform_record(record)
        if product:
            products.append(product)
        else:
            empty_count += 1
    print(f"✅ Valid products: {len(products)} ({empty_count} skipped)\n")
    
    # Step 4: Import to database
    print("4️⃣ Importing to database...")
    imported = import_to_database(products)
    print(f"✅ Imported {imported} products\n")
    
    print("🎉 Import completed!")
    print(f"📊 Total products in database: {imported}")

if __name__ == "__main__":
    main()
