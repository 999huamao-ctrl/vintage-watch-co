"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Download, Upload, Search, Save, X, Wallet, Settings } from "lucide-react";
import { products as allProducts } from "@/lib/data";

// 默认 USDT 收款地址
const DEFAULT_USDT_ADDRESS = "TYRo5Tq9F1ZVngfTdU2heAwmpZbqsWKGXJ";

export default function AdminPage() {
  const [products, setProducts] = useState(allProducts);
  const [view, setView] = useState<"list" | "edit" | "add" | "settings">("list");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [usdtSaved, setUsdtSaved] = useState(false);

  // 从 localStorage 加载数据
  useEffect(() => {
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
    const savedAddress = localStorage.getItem("usdt_address");
    setUsdtAddress(savedAddress || DEFAULT_USDT_ADDRESS);
  }, []);

  // 保存 USDT 地址
  const saveUSDTAddress = () => {
    localStorage.setItem("usdt_address", usdtAddress);
    setUsdtSaved(true);
    setTimeout(() => setUsdtSaved(false), 2000);
  };

  // 保存到 localStorage
  const saveProducts = (newProducts: any[]) => {
    setProducts(newProducts);
    localStorage.setItem("admin_products", JSON.stringify(newProducts));
  };

  const handleDelete = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
    setShowDeleteConfirm(null);
  };

  const handleSave = (product: any) => {
    if (view === "add") {
      saveProducts([...products, product]);
    } else {
      const newProducts = products.map(p => p.id === product.id ? product : p);
      saveProducts(newProducts);
    }
    setView("list");
    setEditingProduct(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `products-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          saveProducts(imported);
          alert("Products imported successfully!");
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-stone-900 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl font-serif">Vintage Watch Co. Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("settings")}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="text-sm text-gray-400">
              {products.length} products
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "list" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("add")}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {product.image ? "🖼️" : "⌚"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">€{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingProduct(product); setView("edit"); }}
                            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </>
        )}

        {(view === "add" || view === "edit") && (
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => { setView("list"); setEditingProduct(null); }}
            isEdit={view === "edit"}
          />
        )}

        {view === "settings" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif">Settings</h2>
              <button onClick={() => setView("list")} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-semibold">Payment Settings</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  USDT Receiving Address (TRC20)
                </label>
                <textarea
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  placeholder="Enter your TRC20 USDT address (e.g., TNYsn..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This address will be displayed on the checkout page for customers to send USDT payments.
                  Make sure it&apos;s a TRC20 address on the Tron network.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Only use TRC20 (Tron) network addresses. 
                  Payments sent via other networks cannot be recovered.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setView("list")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUSDTAddress}
                  className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {usdtSaved ? "Saved!" : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-2">Delete Product?</h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onSave, onCancel, isEdit }: { 
  product: any, 
  onSave: (p: any) => void, 
  onCancel: () => void,
  isEdit: boolean 
}) {
  const [form, setForm] = useState({
    id: product?.id || "",
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "Heritage Collection",
    description: product?.description || "",
    image: product?.image || "",
    caseSize: product?.specs?.caseSize || "40mm",
    movement: product?.specs?.movement || "Quartz",
    strap: product?.specs?.strap || "Leather",
    waterResistance: product?.specs?.waterResistance || "30m",
    crystal: product?.specs?.crystal || "Mineral",
  });

  const [showJson, setShowJson] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: form.id || `watch-${Date.now()}`,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      image: form.image,
      specs: {
        caseSize: form.caseSize,
        movement: form.movement,
        strap: form.strap,
        waterResistance: form.waterResistance,
        crystal: form.crystal,
      },
    });
  };

  const generatedJson = JSON.stringify({
    id: form.id || `watch-${Date.now()}`,
    name: form.name,
    price: Number(form.price),
    category: form.category,
    description: form.description,
    image: form.image,
    specs: {
      caseSize: form.caseSize,
      movement: form.movement,
      strap: form.strap,
      waterResistance: form.waterResistance,
      crystal: form.crystal,
    },
  }, null, 2);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif">{isEdit ? "Edit Product" : "Add Product"}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
              placeholder="e.g., heritage-42"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g., The Heritage 42"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="79"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>Heritage Collection</option>
              <option>Chronograph Collection</option>
              <option>Minimalist Collection</option>
              <option>Diver Collection</option>
              <option>Dress Collection</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="/products/watch-name.jpg or https://..."
          />
          <p className="mt-1 text-xs text-gray-500">Use /products/ for local images or full URL for external images</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Product description..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Size</label>
            <select
              value={form.caseSize}
              onChange={(e) => setForm({ ...form, caseSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>38mm</option>
              <option>40mm</option>
              <option>42mm</option>
              <option>44mm</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movement</label>
            <select
              value={form.movement}
              onChange={(e) => setForm({ ...form, movement: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>Quartz</option>
              <option>Automatic</option>
              <option>Manual</option>
              <option>Japanese Quartz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strap</label>
            <select
              value={form.strap}
              onChange={(e) => setForm({ ...form, strap: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>Leather</option>
              <option>Stainless Steel</option>
              <option>Mesh</option>
              <option>Nylon</option>
              <option>Rubber</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Water Resistance</label>
            <select
              value={form.waterResistance}
              onChange={(e) => setForm({ ...form, waterResistance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option>30m</option>
              <option>50m</option>
              <option>100m</option>
              <option>200m</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <input
            type="checkbox"
            id="showJson"
            checked={showJson}
            onChange={(e) => setShowJson(e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="showJson" className="text-sm text-gray-600">
            Show generated JSON for data.ts
          </label>
        </div>

        {showJson && (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Copy to data.ts:</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(generatedJson)}
                className="text-xs px-3 py-1 bg-amber-500 text-stone-900 rounded font-medium hover:bg-amber-600"
              >
                Copy
              </button>
            </div>
            <pre className="text-xs text-gray-600 overflow-x-auto">{generatedJson}</pre>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
