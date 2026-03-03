"use client";

import { useState, useEffect } from "react";
import { products as initialProducts } from "@/lib/data";
import { Edit, Save, X, Image, Plus, Trash2, Download } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: string;
  description: string;
  specs: {
    caseSize: string;
    movement: string;
    strap: string;
    waterResistance: string;
    crystal: string;
  };
  image?: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [savedMessage, setSavedMessage] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vintage-watch-products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    if (!editingId) return;
    
    const updated = products.map(p => 
      p.id === editingId ? { ...p, ...editForm } as Product : p
    );
    setProducts(updated);
    localStorage.setItem("vintage-watch-products", JSON.stringify(updated));
    setEditingId(null);
    setEditForm({});
    setSavedMessage("Changes saved to browser!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("vintage-watch-products", JSON.stringify(updated));
  };

  const handleAdd = () => {
    const newId = `watch-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: "New Watch",
      price: 99,
      category: "Heritage Collection",
      description: "A beautiful vintage-inspired timepiece.",
      specs: {
        caseSize: "40mm",
        movement: "Quartz",
        strap: "Leather",
        waterResistance: "30m",
        crystal: "Mineral"
      }
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("vintage-watch-products", JSON.stringify(updated));
    handleEdit(newProduct);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
  };

  const generateDataFile = () => {
    const dataTs = `export const products = ${JSON.stringify(products, null, 2)};

export const categories = ["All", "Heritage Collection", "Chronograph Collection", "Minimalist Collection", "Diver Collection", "Dress Collection"];

export const shippingRates: Record<string, { country: string; rate: number }> = {
  DE: { country: "Germany", rate: 6 },
  FR: { country: "France", rate: 6 },
  IT: { country: "Italy", rate: 6 },
  ES: { country: "Spain", rate: 6 },
  NL: { country: "Netherlands", rate: 6 },
  BE: { country: "Belgium", rate: 6 },
  AT: { country: "Austria", rate: 6 },
  PL: { country: "Poland", rate: 8 },
  PT: { country: "Portugal", rate: 8 },
  SE: { country: "Sweden", rate: 8 },
  DK: { country: "Denmark", rate: 8 },
  FI: { country: "Finland", rate: 10 },
  IE: { country: "Ireland", rate: 10 },
  GR: { country: "Greece", rate: 10 },
  CZ: { country: "Czech Republic", rate: 10 },
  HU: { country: "Hungary", rate: 10 },
  RO: { country: "Romania", rate: 10 },
};

export const freeShippingThreshold = 79;
`;
    const blob = new Blob([dataTs], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.ts";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Product Manager</h1>
            <p className="text-gray-600">Manage your watch catalog</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={generateDataFile}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-stone-900 rounded-lg hover:bg-amber-400 transition-colors font-semibold"
            >
              <Download className="w-4 h-4" />
              Download data.ts
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {savedMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            {savedMessage}
          </div>
        )}

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Image</th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {editingId === product.id ? (
                      <div className="space-y-2">
                        {editForm.image && (
                          <img 
                            src={editForm.image} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm">
                          <Image className="w-4 h-4" />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg flex items-center justify-center text-white text-xs">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          "No Image"
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    ) : (
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.badge && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={editForm.price || 0}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                          placeholder="Price"
                        />
                        <input
                          type="number"
                          value={editForm.originalPrice || ""}
                          onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                          placeholder="Original Price (optional)"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold">€{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            €{product.originalPrice}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <select
                        value={editForm.category || ""}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                      >
                        <option>Heritage Collection</option>
                        <option>Chronograph Collection</option>
                        <option>Minimalist Collection</option>
                        <option>Diver Collection</option>
                        <option>Dress Collection</option>
                      </select>
                    ) : (
                      product.category.replace(" Collection", "")
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-amber-500 text-stone-900 rounded-lg hover:bg-amber-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="mt-8 bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500 h-32"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Badge (optional)</label>
                  <select
                    value={editForm.badge || ""}
                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value || undefined })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="New">New</option>
                    <option value="Sale">Sale</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Case Size</label>
                    <input
                      type="text"
                      value={editForm.specs?.caseSize || ""}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        specs: { ...editForm.specs, caseSize: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Movement</label>
                    <input
                      type="text"
                      value={editForm.specs?.movement || ""}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        specs: { ...editForm.specs, movement: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Strap</label>
                    <input
                      type="text"
                      value={editForm.specs?.strap || ""}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        specs: { ...editForm.specs, strap: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Water Resistance</label>
                    <input
                      type="text"
                      value={editForm.specs?.waterResistance || ""}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        specs: { ...editForm.specs, waterResistance: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Edit products directly in this table</li>
            <li>Upload images by clicking the image cell</li>
            <li>Click "Save" icon to save changes to your browser</li>
            <li>When finished, click "Download data.ts" to get the updated file</li>
            <li>Replace <code>src/lib/data.ts</code> with the downloaded file</li>
            <li>Commit and push to deploy changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
