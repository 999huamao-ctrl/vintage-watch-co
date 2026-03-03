"use client";

import { useState } from "react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif mb-8">Product Manager</h1>
        <p className="text-gray-600 mb-4">
          Use this form to generate product data:
        </p>
        
        <div className="bg-white rounded-xl border p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}

function ProductForm() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    category: "Heritage Collection",
    description: "",
    caseSize: "40mm",
    movement: "Quartz",
    strap: "Leather",
  });

  const [output, setOutput] = useState("");

  const generate = () => {
    const product = {
      id: form.id || `watch-${Date.now()}`,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      specs: {
        caseSize: form.caseSize,
        movement: form.movement,
        strap: form.strap,
        waterResistance: "30m",
        crystal: "Mineral",
      },
    };
    setOutput(JSON.stringify(product, null, 2));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="e.g. The Classic Heritage"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Price (€)</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="99"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option>Heritage Collection</option>
          <option>Chronograph Collection</option>
          <option>Minimalist Collection</option>
          <option>Diver Collection</option>
          <option>Dress Collection</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg h-24"
          placeholder="Product description..."
        />
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800"
      >
        Generate Product Code
      </button>

      {output && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Copy this to data.ts:</label>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {output}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mt-2 px-4 py-2 bg-amber-500 text-stone-900 rounded-lg text-sm font-semibold"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
