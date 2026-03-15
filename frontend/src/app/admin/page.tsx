"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Download, Upload, Search, Save, X, Wallet, Settings, Lock, LogOut, Users, Truck, Shield, UserCircle } from "lucide-react";
import { products as allProducts } from "@/lib/data";

// 默认 USDT 收款地址
const DEFAULT_USDT_ADDRESS = "TYRo5Tq9F1ZVngfTdU2heAwmpZbqsWKGXJ";

type UserRole = "SUPERADMIN" | "ADMIN" | "SUPPLY" | "LOGISTICS";

interface User {
  username: string;
  email: string;
  role: UserRole;
}

// 订单类型定义
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
  paymentStatus: string;
  trackingNumber?: string;
  carrier?: string;
}

// 账号配置（用户名 -> 详细信息）
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
    permissions: ["products", "orders"],
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
  const [view, setView] = useState<"list" | "edit" | "add" | "settings" | "orders" | "users">("list");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // 3级钱包状态（仅SuperAdmin可设置）
  const [walletConfig, setWalletConfig] = useState({
    l1Receiving: "TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c",
    l2Operating: "TCWgr2qGcheRsD7kceoFpJfMg59fFrJGCq", 
    l3Profit: "TUyTqV47pd7o3Bg6Uhw5XJ9rwkdgi6tsKb",
  });
  const [walletSaved, setWalletSaved] = useState(false);
  
  const [activeTab, setActiveTab] = useState("products");
  
  // 用户管理状态（仅SuperAdmin）
  const [users, setUsers] = useState<User[]>(() => {
    // 初始化时加载现有的4个账号
    return Object.entries(USER_CREDENTIALS).map(([username, data]) => ({
      username,
      email: data.email,
      role: data.role,
    }));
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ username: "", password: "", role: "ADMIN" as UserRole });
  
  // 订单管理状态
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");

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
    const savedWallets = localStorage.getItem("wallet_config");
    if (savedWallets) {
      setWalletConfig(JSON.parse(savedWallets));
    }
  }, []);

  // 同步浏览器历史记录
  useEffect(() => {
    if (!isLoggedIn) return;
    const hash = window.location.hash.slice(1);
    if (hash && ["list", "edit", "add", "settings", "orders"].includes(hash)) {
      setView(hash as any);
    }
  }, [isLoggedIn]);

  // 加载订单数据
  useEffect(() => {
    if (view === "orders" && isLoggedIn) {
      fetchOrders();
    }
  }, [view, isLoggedIn]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrdersError("Database not connected yet");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

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
        const user: User = { 
          username: username,
          email: credentials.email, 
          role: credentials.role 
        };
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

  // 保存钱包配置
  const saveWalletConfig = () => {
    localStorage.setItem("wallet_config", JSON.stringify(walletConfig));
    setWalletSaved(true);
    setTimeout(() => setWalletSaved(false), 2000);
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

  // 用户管理功能
  const handleSaveUser = () => {
    if (editingUser) {
      // 编辑用户
      setUsers(users.map(u => u.username === editingUser.username ? { 
        username: editingUser.username,
        email: editingUser.email,
        role: userForm.role 
      } : u));
    } else {
      // 新建用户
      if (users.find(u => u.username === userForm.username)) {
        alert("User with this username already exists");
        return;
      }
      const newEmail = `${userForm.username}@horizonwatches.com`;
      setUsers([...users, { 
        username: userForm.username,
        email: newEmail,
        role: userForm.role 
      }]);
    }
    setShowUserForm(false);
    setEditingUser(null);
    setUserForm({ username: "", password: "", role: "ADMIN" });
  };

  const handleDeleteUser = (username: string) => {
    if (confirm("Delete this user?")) {
      setUsers(users.filter(u => u.username !== username));
    }
  };

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

            {/* Security Note */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Authorized personnel only
              </p>
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
                onClick={() => { setView("users"); setActiveTab("users"); }}
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

          {/* Orders View */}
          {view === "orders" && hasPermission("orders") && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif">Orders Management</h2>
                <div className="flex gap-3">
                  <select 
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="ALL">All Orders</option>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {ordersLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : ordersError ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h2>
                  <p className="text-gray-500 mb-4">{ordersError}</p>
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    Retry
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                  <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders
                        .filter(order => orderFilter === "ALL" || order.status === orderFilter)
                        .map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.id.slice(0, 8)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                              order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                              order.status === "PAID" ? "bg-amber-100 text-amber-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            €{order.total}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif">Wallet Configuration</h2>
                <button 
                  onClick={() => setView("list")} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3级钱包架构 */}
              <div className="space-y-6">
                {/* L1 收款钱包 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Level 1: Receiving Wallet</h3>
                      <p className="text-sm text-gray-500">Customer payments come here</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      USDT Address (TRC20)
                    </label>
                    <textarea
                      value={walletConfig.l1Receiving}
                      onChange={(e) => setWalletConfig({...walletConfig, l1Receiving: e.target.value})}
                      placeholder="Enter TRC20 receiving address"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* L2 运营钱包 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Level 2: Operating Wallet</h3>
                      <p className="text-sm text-gray-500">40% for ads, logistics, operations</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      USDT Address (TRC20)
                    </label>
                    <textarea
                      value={walletConfig.l2Operating}
                      onChange={(e) => setWalletConfig({...walletConfig, l2Operating: e.target.value})}
                      placeholder="Enter TRC20 operating address"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* L3 利润钱包 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Level 3: Profit Wallet</h3>
                      <p className="text-sm text-gray-500">60% profit - STAR&apos;s wallet</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      USDT Address (TRC20)
                    </label>
                    <textarea
                      value={walletConfig.l3Profit}
                      onChange={(e) => setWalletConfig({...walletConfig, l3Profit: e.target.value})}
                      placeholder="Enter TRC20 profit address"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Fund Flow:</strong> L1 receives → 40% to L2 (operations) → 60% to L3 (profit)
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
                    onClick={saveWalletConfig}
                    className="flex-1 px-4 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {walletSaved ? "Saved!" : "Save Configuration"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Users Management */}
          {view === "users" && hasPermission("users") && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif">User Management</h2>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setUserForm({ username: "", password: "", role: "ADMIN" });
                    setShowUserForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Permissions</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No users created yet. Click "Add User" to create one.
                        </td>
                      </tr>
                    )}
                    {users.map((user) => (
                      <tr key={user.username} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "SUPERADMIN" ? "bg-purple-100 text-purple-700" :
                            user.role === "ADMIN" ? "bg-blue-100 text-blue-700" :
                            user.role === "SUPPLY" ? "bg-green-100 text-green-700" :
                            "bg-orange-100 text-orange-700"
                          }`}>
                            {ROLE_PERMISSIONS[user.role].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {ROLE_PERMISSIONS[user.role].permissions.join(", ")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setUserForm({ username: user.username, password: "", role: user.role });
                                setShowUserForm(true);
                              }}
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.username)}
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
              </div>

              {/* Role Reference */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Role Permissions Reference</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
                    <div key={role} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <config.icon className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-gray-900">{config.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{config.permissions.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">{editingUser ? "Edit User" : "Add New User"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 text-gray-900"
                  placeholder="e.g., johnsmith"
                />
                {!editingUser && (
                  <p className="text-xs text-gray-500 mt-1">Email will be: {userForm.username}@horizonwatches.com</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
                  placeholder={editingUser ? "••••••••" : "Enter password"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="SUPPLY">Supply Manager</option>
                  <option value="LOGISTICS">Logistics Manager</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUserForm(false);
                  setEditingUser(null);
                  setUserForm({ username: "", password: "", role: "ADMIN" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800"
              >
                {editingUser ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

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
