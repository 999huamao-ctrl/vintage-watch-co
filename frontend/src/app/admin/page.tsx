"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Download, Upload, Search, Save, X, Wallet, Settings, Lock, LogOut, Users, Truck, Shield, UserCircle } from "lucide-react";
import { products as allProducts } from "@/lib/data";

// 默认 USDT 收款地址
const DEFAULT_USDT_ADDRESS = "TYRo5Tq9F1ZVngfTdU2heAwmpZbqsWKGXJ";

type UserRole = "SUPERADMIN" | "ADMIN" | "SUPPLY" | "LOGISTICS";

interface User {
  email: string;
  role: UserRole;
}

// 账号配置（用户名 -> 邮箱映射）
const USER_CREDENTIALS: Record<string, { email: string; password: string; role: UserRole }> = {
  "superadmin": { email: "superadmin@horizonwatches.com", password: "super123", role: "SUPERADMIN" },
  "admin": { email: "admin@horizonwatches.com", password: "admin123", role: "ADMIN" },
  "supply": { email: "supply@horizonwatches.com", password: "supply123", role: "SUPPLY" },
  "logistics": { email: "logistics@horizonwatches.com", password: "logistics123", role: "LOGISTICS" },
};

// 权限配置
const ROLE_PERMISSIONS: Record<UserRole, { label: string; icon: any; permissions: string[] }> = {
  SUPERADMIN: {
    label: "Super Admin",
    icon: Shield,
    permissions: ["products", "orders", "users", "settings", "finance", "analytics"],
  },
  ADMIN: {
    label: "Administrator",
    icon: UserCircle,
    permissions: ["products", "orders", "settings"],
  },
  SUPPLY: {
    label: "Supply Manager",
    icon: Package,
    permissions: ["products", "inventory"],
  },
  LOGISTICS: {
    label: "Logistics Manager",
    icon: Truck,
    permissions: ["orders", "shipping"],
  },
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const [products, setProducts] = useState(allProducts);
  const [view, setView] = useState<"list" | "edit" | "add" | "settings" | "orders">("list");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [usdtSaved, setUsdtSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // 检查登录状态
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("admin_logged_in");
    const savedUser = sessionStorage.getItem("admin_user");
    if (loggedIn === "true" && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }
    
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
    const savedAddress = localStorage.getItem("usdt_address");
    setUsdtAddress(savedAddress || DEFAULT_USDT_ADDRESS);
  }, []);

  // 同步浏览器历史记录
  useEffect(() => {
    if (!isLoggedIn) return;
    const hash = window.location.hash.slice(1);
    if (hash && ["list", "edit", "add", "settings", "orders"].includes(hash)) {
      setView(hash as any);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const newHash = view === "list" ? "" : view;
    if (window.location.hash.slice(1) !== newHash) {
      window.history.pushState(null, "", newHash ? `#${newHash}` : window.location.pathname);
    }
  }, [view, isLoggedIn]);

  // 登录处理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    const username = loginForm.username.toLowerCase().trim();
    const credentials = USER_CREDENTIALS[username];
    
    setTimeout(() => {
      if (credentials && loginForm.password === credentials.password) {
        const user = { email: credentials.email, role: credentials.role };
        setIsLoggedIn(true);
        setCurrentUser(user);
        sessionStorage.setItem("admin_logged_in", "true");
        sessionStorage.setItem("admin_user", JSON.stringify(user));
        setLoginError("");
      } else {
        setLoginError("Invalid username or password");
      }
      setIsLoading(false);
    }, 500);
  };

  // 登出
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem("admin_logged_in");
    sessionStorage.removeItem("admin_user");
    setView("list");
  };

  // 检查权限
  const hasPermission = (permission: string) => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role].permissions.includes(permission);
  };

  // 保存 USDT 地址
  const saveUSDTAddress = () => {
    localStorage.setItem("usdt_address", usdtAddress);
    setUsdtSaved(true);
    setTimeout(() => setUsdtSaved(false), 2000);
  };

  // 保存产品数据
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

  // 登录页面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Horizon Watches</h1>
              <p className="text-gray-500 mt-1">Admin Workstation</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-semibold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-4">Demo Accounts</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(USER_CREDENTIALS).map(([key, cred]) => (
                  <button
                    key={key}
                    onClick={() => setLoginForm({ username: key, password: cred.password })}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors text-left"
                  >
                    <span className="font-medium capitalize">{key}</span>
                    <span className="text-gray-400 block">{cred.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const RoleIcon = ROLE_PERMISSIONS[currentUser!.role].icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-stone-900 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-serif">Horizon Watches</h1>
            </div>
            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
              <RoleIcon className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-200">{ROLE_PERMISSIONS[currentUser!.role].label}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:inline">{currentUser?.email}</span>
            {hasPermission("settings") && (
              <button
                onClick={() => setView("settings")}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {hasPermission("products") && (
              <button
                onClick={() => { setView("list"); setActiveTab("products"); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "products" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Products</span>
              </button>
            )}
            
            {hasPermission("orders") && (
              <button
                onClick={() => { setView("orders"); setActiveTab("orders"); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "orders" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="font-medium">Orders</span>
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
              </button>
            )}
            
            {hasPermission("users") && (
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "users" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </button>
            )}
            
            {hasPermission("finance") && (
              <button
                onClick={() => setActiveTab("finance")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "finance" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Finance</span>
              </button>
            )}
            
            {hasPermission("analytics") && (
              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "analytics" ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            )}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products View */}
          {view === "list" && hasPermission("products") && (
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView("add")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">€{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 ? "bg-green-100 text-green-700" : 
                            product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingProduct(product); setView("edit"); }}
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(product.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          {/* Orders View (Placeholder) */}
          {view === "orders" && hasPermission("orders") && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h2>
              <p className="text-gray-500">Coming soon - Connect to database for full order management</p>
            </div>
          )}

          {/* Product Form */}
          {(view === "add" || view === "edit") && hasPermission("products") && (
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => { setView("list"); setEditingProduct(null); }}
              isEdit={view === "edit"}
            />
          )}

          {/* Settings */}
          {view === "settings" && hasPermission("settings") && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif">Settings</h2>
                <button 
                  onClick={() => setView("list")} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-semibold">Payment Settings</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    USDT Receiving Address (TRC20)
                  </label>
                  <textarea
                    value={usdtAddress}
                    onChange={(e) => setUsdtAddress(e.target.value)}
                    placeholder="Enter your TRC20 USDT address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm text-gray-900"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Only use TRC20 (Tron) network addresses.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setView("list")}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveUSDTAddress}
                    className="flex-1 px-4 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {usdtSaved ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Delete Product?</h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
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
    stock: product?.stock || "50",
    caseSize: product?.specs?.caseSize || "40mm",
    movement: product?.specs?.movement || "Automatic",
    strap: product?.specs?.strap || "Stainless Steel",
    waterResistance: product?.specs?.waterResistance || "100m",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: form.id || `watch-${Date.now()}`,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      image: form.image,
      stock: Number(form.stock),
      specs: {
        caseSize: form.caseSize,
        movement: form.movement,
        strap: form.strap,
        waterResistance: form.waterResistance,
      },
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif">{isEdit ? "Edit Product" : "Add Product"}</h2>
        <button 
          onClick={onCancel} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
              placeholder="e.g., Rolex Submariner"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Product ID</label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 text-gray-900"
              placeholder="e.g., submariner-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Price (€)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
              placeholder="129"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
              placeholder="50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Image URL</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
            placeholder="/products/image1.webp"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
