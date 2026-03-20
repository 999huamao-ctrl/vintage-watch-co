"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { TranslationKey } from "./i18n";

interface Product {
  id?: string;
  name: string;
  nameZh?: string;
  price: number;
  originalPrice?: number;
  brand: string;           // 品牌名称
  category: string;
  stock: number;
  isActive: boolean;
  image: string;           // 首图URL
  detailImage1?: string;   // 细节图1
  detailImage2?: string;   // 细节图2
  detailImage3?: string;   // 细节图3
  detailImage4?: string;   // 细节图4
  // 规格参数
  caseMaterial?: string;   // 表壳
  dial?: string;           // 表盘
  movement?: string;       // 机芯
  powerReserve?: string;   // 动力储存
  functions?: string;      // 功能
}

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  t: (key: TranslationKey) => string;
  canEditAll?: boolean;
}

const categories = [
  "Submariner",
  "Daytona", 
  "GMT-Master",
  "Datejust",
  "Day-Date",
  "Explorer",
  "Yacht-Master"
];

export default function ProductForm({ product, onSave, onCancel, t, canEditAll = true }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    nameZh: product?.nameZh || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    brand: product?.brand || "",
    category: product?.category || "Submariner",
    stock: product?.stock || 0,
    isActive: product?.isActive ?? true,
    image: product?.image || "",
    detailImage1: product?.detailImage1 || "",
    detailImage2: product?.detailImage2 || "",
    detailImage3: product?.detailImage3 || "",
    detailImage4: product?.detailImage4 || "",
    caseMaterial: product?.caseMaterial || "",
    dial: product?.dial || "",
    movement: product?.movement || "",
    powerReserve: product?.powerReserve || "",
    functions: product?.functions || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "产品名称必填";
    }
    if (!formData.brand.trim()) {
      newErrors.brand = "品牌名称必填";
    }
    if (formData.price <= 0) {
      newErrors.price = "售价必须大于0";
    }
    if (!formData.image.trim()) {
      newErrors.image = "首图URL必填";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  const inputClass = (field: string) => `
    w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white 
    focus:outline-none focus:border-amber-500 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${errors[field] ? 'border-red-500' : 'border-slate-700'}
  `;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {product ? t("editProduct") : t("addProduct")}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 必填字段提示 */}
          <div className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg">
            * 为必填字段
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("name")} (EN) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass('name')}
                disabled={!canEditAll}
                placeholder="输入产品名称"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("name")} (中文)
              </label>
              <input
                type="text"
                value={formData.nameZh}
                onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                className={inputClass('nameZh')}
                disabled={!canEditAll}
                placeholder="输入中文名称"
              />
            </div>
          </div>

          {/* 价格和品牌 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("price")} (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className={inputClass('price')}
                required
                disabled={!canEditAll}
              />
              {errors.price && <span className="text-red-400 text-xs mt-1">{errors.price}</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("originalPrice")} (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                className={inputClass('originalPrice')}
                disabled={!canEditAll}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("brand")} *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className={inputClass('brand')}
                disabled={!canEditAll}
                placeholder="如: Rolex"
              />
              {errors.brand && <span className="text-red-400 text-xs mt-1">{errors.brand}</span>}
            </div>
          </div>

          {/* 分类和库存 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("category")}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass('category')}
                disabled={!canEditAll}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {t("stock")}
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className={inputClass('stock')}
                disabled={!canEditAll}
              />
            </div>
          </div>

          {/* 图片URL */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">{t("productImages")}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {t("mainImage")} URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={inputClass('image')}
                  disabled={!canEditAll}
                  placeholder="https://..."
                />
                {errors.image && <span className="text-red-400 text-xs mt-1">{errors.image}</span>}
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 h-20 object-cover rounded" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['detailImage1', 'detailImage2', 'detailImage3', 'detailImage4'].map((field, idx) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      {t("detailImage")} {idx + 1} URL
                    </label>
                    <input
                      type="url"
                      value={formData[field as keyof Product] as string}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className={inputClass(field)}
                      disabled={!canEditAll}
                      placeholder="https://..."
                    />
                    {formData[field as keyof Product] && (
                      <img 
                        src={formData[field as keyof Product] as string} 
                        alt={`Detail ${idx + 1}`} 
                        className="mt-2 h-16 object-cover rounded" 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 规格参数 */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">{t("specifications")}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {t("caseMaterial")}
                </label>
                <input
                  type="text"
                  value={formData.caseMaterial}
                  onChange={(e) => setFormData({ ...formData, caseMaterial: e.target.value })}
                  className={inputClass('caseMaterial')}
                  disabled={!canEditAll}
                  placeholder="如: Stainless Steel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {t("dial")}
                </label>
                <input
                  type="text"
                  value={formData.dial}
                  onChange={(e) => setFormData({ ...formData, dial: e.target.value })}
                  className={inputClass('dial')}
                  disabled={!canEditAll}
                  placeholder="如: Black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {t("movement")}
                </label>
                <input
                  type="text"
                  value={formData.movement}
                  onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                  className={inputClass('movement')}
                  disabled={!canEditAll}
                  placeholder="如: Automatic"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {t("powerReserve")}
                </label>
                <input
                  type="text"
                  value={formData.powerReserve}
                  onChange={(e) => setFormData({ ...formData, powerReserve: e.target.value })}
                  className={inputClass('powerReserve')}
                  disabled={!canEditAll}
                  placeholder="如: 72 hours"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {t("functions")}
                </label>
                <input
                  type="text"
                  value={formData.functions}
                  onChange={(e) => setFormData({ ...formData, functions: e.target.value })}
                  className={inputClass('functions')}
                  disabled={!canEditAll}
                  placeholder="如: Date, Chronograph"
                />
              </div>
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-slate-700 bg-slate-900/50 text-amber-500 focus:ring-amber-500"
              disabled={!canEditAll}
            />
            <label htmlFor="isActive" className="text-slate-300">
              {t("isActive")}
            </label>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {t("cancel")}
            </button>
            {canEditAll && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? t("saving") : t("save")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
