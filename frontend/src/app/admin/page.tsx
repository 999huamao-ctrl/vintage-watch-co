"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Download, Search, Save, X, Wallet, Settings, Lock, LogOut, Users, Truck, Shield, UserCircle, Globe, BarChart3, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { translations, Language, TranslationKey } from "./i18n";

type UserRole = "SUPERADMIN" | "ADMIN" | "SUPPLY" | "LOGISTICS";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  isActive: boolean;
  image: string;
  caseSize?: string;
  movement?: string;
  strap?: string;
}

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

interface DashboardData {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
  todayRevenue: number;
  todayOrders: number;
}

const getRolePermissions = (t: (key: TranslationKey) => string): Record<UserRole, { label: string; icon: any; permissions: string[] }> => ({
  SUPERADMIN: {
    label: t("superadmin"),
    icon: Shield,
    permissions: ["dashboard", "products", "orders", "users", "settings", "finance", "analytics"],
  },
  ADMIN: {
    label: t("admin"),
    icon: UserCircle,
    permissions: ["dashboard", "products", "orders"],
  },
  SUPPLY: {
    label: t("supply"),
    icon: Package,
    permissions: ["dashboard", "products", "inventory"],
  },
  LOGISTICS: {
    label: t("logistics"),
    icon: Truck,
    permissions: ["dashboard", "orders", "shipping"],
  },
});

export default function AdminPage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = (key: TranslationKey): string => translations[language][key] || translations.en[key] || key;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  
  // Product editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  
  // Order management
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  
  // User management
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Wallet config
  const [walletConfig, setWalletConfig] = useState({
    l1Receiving: "",
    l2Operating: "",
    l3Profit: "",
  });
  
  const ROLE_PERMISSIONS = getRolePermissions(t);

  // Load language
  useEffect(() => {
    const savedLang = localStorage.getItem("admin_language") as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "zh" : "en";
    setLanguage(newLang);
    localStorage.setItem("admin_language", newLang);
  };

  // Check login status
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    const savedUser = sessionStorage.getItem("admin_user");
    if (token && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (!isLoggedIn) return;
    
    switch (activeTab) {
      case "dashboard":
        fetchDashboard();
        break;
      case "products":
        fetchProducts();
        break;
      case "orders":
        fetchOrders();
        break;
      case "users":
        if (currentUser?.role === "SUPERADMIN") fetchUsers();
        break;
      case "settings":
        fetchWalletConfig();
        break;
    }
  }, [activeTab, isLoggedIn]);

  // API Functions
  const fetchDashboard = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      setDataError("Failed to load dashboard");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchProducts = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setDataError("Failed to load products");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchOrders = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setDataError("Failed to load orders");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setDataError("Failed to load users");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchWalletConfig = async () => {
    try {
      const res = await fetch("/api/admin/wallet");
      if (res.ok) {
        const data = await res.json();
        setWalletConfig(data);
      }
    } catch (err) {
      console.error("Failed to load wallet config");
    }
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      
      if (!res.ok) throw new Error("Invalid credentials");
      
      const data = await res.json();
      sessionStorage.setItem("admin_token", data.token);
      sessionStorage.setItem("admin_user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setCurrentUser(data.user);
    } catch (err) {
      setLoginError(t("invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab("dashboard");
  };

  // Check permission
  const hasPermission = (permission: string) => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role]?.permissions.includes(permission) || false;
  };

  // Render functions
  const renderLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t("loginTitle")}</h1>
          <p className="text-slate-400">{t("loginSubtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t("username")}</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t("password")}</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="••••••"
            />
          </div>
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? t("loggingIn") : t("login")}
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{t("totalOrders")}</p>
              <p className="text-3xl font-bold text-white">{dashboardData?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{t("totalProducts")}</p>
              <p className="text-3xl font-bold text-white">{dashboardData?.totalProducts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{t("pendingOrders")}</p>
              <p className="text-3xl font-bold text-amber-400">{dashboardData?.pendingOrders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{t("todayRevenue")}</p>
              <p className="text-3xl font-bold text-emerald-400">€{dashboardData?.todayRevenue?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
      
      {dashboardData && dashboardData.lowStockProducts > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-red-400 font-medium">{t("lowStockAlert")}</p>
            <p className="text-red-400/70 text-sm">{dashboardData.lowStockProducts} {t("productsLowStock")}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t("products")}</h2>
        {hasPermission("products") && (
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {t("addProduct")}
          </button>
        )}
      </div>
      
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("product")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("price")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("stock")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("status")}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">€{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`${product.stock < 10 ? 'text-red-400' : 'text-slate-300'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {product.isActive ? t("active") : t("inactive")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t("orders")}</h2>
      </div>
      
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("orderNumber")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("customer")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("total")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("status")}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-white font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white">{order.customerName}</p>
                    <p className="text-slate-400 text-sm">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">€{order.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                    order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Truck className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t("settings")}</h2>
      
      {currentUser?.role === "SUPERADMIN" && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            {t("walletConfiguration")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">{t("l1ReceivingWallet")}</label>
              <input
                type="text"
                value={walletConfig.l1Receiving}
                onChange={(e) => setWalletConfig({ ...walletConfig, l1Receiving: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">{t("l2OperatingWallet")}</label>
              <input
                type="text"
                value={walletConfig.l2Operating}
                onChange={(e) => setWalletConfig({ ...walletConfig, l2Operating: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">{t("l3ProfitWallet")}</label>
              <input
                type="text"
                value={walletConfig.l3Profit}
                onChange={(e) => setWalletConfig({ ...walletConfig, l3Profit: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
            </div>
            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors">
              <Save className="w-4 h-4" />
              {t("saveChanges")}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (!isLoggedIn) return renderLogin();

  const RoleIcon = currentUser ? ROLE_PERMISSIONS[currentUser.role]?.icon : Shield;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-white font-semibold">Horizon Admin</h1>
              <p className="text-slate-400 text-xs">{t("adminPanel")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {hasPermission("dashboard") && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              {t("dashboard")}
            </button>
          )}
          {hasPermission("products") && (
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "products" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Package className="w-5 h-5" />
              {t("products")}
            </button>
          )}
          {hasPermission("orders") && (
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "orders" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {t("orders")}
            </button>
          )}
          {hasPermission("users") && (
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Users className="w-5 h-5" />
              {t("users")}
            </button>
          )}
          {hasPermission("settings") && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "settings" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              {t("settings")}
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <RoleIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentUser?.username}</p>
              <p className="text-slate-400 text-xs">{currentUser?.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleLanguage}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "EN" : "中文"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
          </div>
        ) : dataError ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
            {dataError}
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "products" && renderProducts()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "settings" && renderSettings()}
            {activeTab === "users" && <div className="text-slate-400">{t("comingSoon")}</div>}
          </>
        )}
      </main>
    </div>
  );
}
