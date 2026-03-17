'use client';

import { useState } from 'react';

const productsToSync = [
  {
    id: 'prod_009',
    name: 'Rolex Pearlmaster Style',
    nameZh: '劳力士珍珠淑女型风格',
    description: 'Luxury women watch with precious stone setting',
    descriptionZh: '奢华女士腕表，宝石镶嵌',
    price: 199.00,
    originalPrice: 319.00,
    category: 'Pearlmaster',
    image: '/products/image17.jpeg',
    images: ['/products/image17.jpeg', '/products/image18.jpeg'],
    stock: 5,
    isActive: true,
    caseSize: '29mm',
    movement: 'Automatic',
    strap: 'Pearlmaster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_010',
    name: 'Rolex Air-King Style',
    nameZh: '劳力士空中霸王风格',
    description: 'Aviation-inspired watch with bold dial',
    descriptionZh: '航空灵感腕表，醒目表盘',
    price: 159.00,
    originalPrice: 239.00,
    category: 'Air-King',
    image: '/products/image19.jpeg',
    images: ['/products/image19.jpeg', '/products/image20.jpeg'],
    stock: 14,
    isActive: true,
    caseSize: '40mm',
    movement: 'Automatic',
    strap: 'Oyster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_011',
    name: 'Rolex Sea-Dweller Style',
    nameZh: '劳力士海使型风格',
    description: 'Professional diving watch with helium escape valve',
    descriptionZh: '专业潜水腕表，排氦阀门',
    price: 209.00,
    originalPrice: 339.00,
    category: 'Sea-Dweller',
    image: '/products/image21.jpeg',
    images: ['/products/image21.jpeg', '/products/image22.jpeg'],
    stock: 4,
    isActive: true,
    caseSize: '43mm',
    movement: 'Automatic',
    strap: 'Oyster Bracelet',
    waterResistance: '1220m',
  },
  {
    id: 'prod_012',
    name: 'Rolex Milgauss Style',
    nameZh: '劳力士格磁型风格',
    description: 'Anti-magnetic watch with lightning bolt seconds hand',
    descriptionZh: '防磁腕表，闪电形状秒针',
    price: 179.00,
    originalPrice: 279.00,
    category: 'Milgauss',
    image: '/products/image23.jpeg',
    images: ['/products/image23.jpeg', '/products/image24.jpeg'],
    stock: 9,
    isActive: true,
    caseSize: '40mm',
    movement: 'Automatic',
    strap: 'Oyster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_013',
    name: 'Rolex Cellini Style',
    nameZh: '劳力士切利尼风格',
    description: 'Dress watch with leather strap and moonphase',
    descriptionZh: '正装腕表，皮表带，月相显示',
    price: 189.00,
    originalPrice: 299.00,
    category: 'Cellini',
    image: '/products/image25.jpeg',
    images: ['/products/image25.jpeg', '/products/image26.jpeg'],
    stock: 7,
    isActive: true,
    caseSize: '39mm',
    movement: 'Automatic',
    strap: 'Leather',
    waterResistance: '50m',
  },
  {
    id: 'prod_014',
    name: 'Rolex Sky-Dweller Style',
    nameZh: '劳力士纵航者风格',
    description: 'Annual calendar watch with dual time zone',
    descriptionZh: '年历腕表，双时区显示',
    price: 219.00,
    originalPrice: 359.00,
    category: 'Sky-Dweller',
    image: '/products/image27.jpeg',
    images: ['/products/image27.jpeg', '/products/image28.jpeg'],
    stock: 3,
    isActive: true,
    caseSize: '42mm',
    movement: 'Automatic Annual Calendar',
    strap: 'Oyster Bracelet',
    waterResistance: '100m',
  },
  {
    id: 'prod_015',
    name: 'TEST PRODUCT - DO NOT BUY',
    nameZh: '测试商品 - 请勿购买',
    description: 'This is a test product for development purposes only. Do not purchase.',
    descriptionZh: '这是仅供开发测试使用的商品。请勿购买。',
    price: 1.00,
    originalPrice: 1.00,
    category: 'Test',
    image: '/products/image1.webp',
    images: ['/products/image1.webp'],
    stock: 999,
    isActive: true,
    caseSize: '40mm',
    movement: 'Quartz',
    strap: 'Test',
    waterResistance: '0m',
  },
];

export default function SyncPage() {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<{ success: string[]; failed: string[] }>({ success: [], failed: [] });

  const handleSync = async () => {
    setStatus('syncing');
    const success: string[] = [];
    const failed: string[] = [];

    for (const product of productsToSync) {
      try {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });

        if (res.ok) {
          success.push(product.name);
        } else {
          const err = await res.text();
          failed.push(`${product.name}: ${err}`);
        }
      } catch (err) {
        failed.push(`${product.name}: ${(err as Error).message}`);
      }
    }

    setResults({ success, failed });
    setStatus('done');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">商品同步工具</h1>
        <p className="text-gray-400 mb-6">
          将缺失的 7 个商品（prod_009 - prod_015）同步到数据库
        </p>

        {status === 'idle' && (
          <button
            onClick={handleSync}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            开始同步
          </button>
        )}

        {status === 'syncing' && (
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span>同步中...</span>
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
              <h3 className="text-green-400 font-medium mb-2">
                ✅ 成功 ({results.success.length})
              </h3>
              <ul className="text-sm text-green-300 space-y-1">
                {results.success.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>

            {results.failed.length > 0 && (
              <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
                <h3 className="text-red-400 font-medium mb-2">
                  ❌ 失败 ({results.failed.length})
                </h3>
                <ul className="text-sm text-red-300 space-y-1">
                  {results.failed.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium"
            >
              返回后台
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
