"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Download, Search, Save, X, Wallet, Settings, Lock, LogOut, Users, Truck, Shield, UserCircle, Globe, BarChart3, TrendingUp, DollarSign, ShoppingCart, Trash, MessageCircle, Check } from "lucide-react";
import { translations, Language, TranslationKey } from "./i18n";
import ProductForm from "./ProductForm";
import OrderDetail from "./OrderDetail";
import UserForm from "./UserForm";

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

interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
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

const getRolePermissions = (t: (key: TranslationKey) => string): Record<UserRole | "CUSTOMER", { label: string; icon: any; permissions: string[]; description: string }> => ({
  SUPERADMIN: {
    label: t("superadmin"),
    icon: Shield,
    permissions: ["dashboard", "products", "orders", "users", "settings", "finance", "analytics", "inventory", "shipping"],
    description: "Full system access",
  },
  ADMIN: {
    label: t("admin"),
    icon: UserCircle,
    permissions: ["dashboard", "products", "orders", "inventory"],
    description: "Manage products and orders",
  },
  SUPPLY: {
    label: t("supply"),
    icon: Package,
    permissions: ["dashboard", "products", "inventory"],
    description: "Manage inventory and products",
  },
  LOGISTICS: {
    label: t("logistics"),
    icon: Truck,
    permissions: ["dashboard", "orders", "shipping"],
    description: "Manage orders and shipping",
  },
  CUSTOMER: {
    label: "Customer",
    icon: UserCircle,
    permissions: [],
    description: "No admin access",
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

  // WhatsApp Links
  const [waLinks, setWALinks] = useState<{ id: string; name: string; url: string; isActive: boolean }[]>([]);
  const [newWALink, setNewWALink] = useState({ name: "", url: "" });
  const [creatingWALink, setCreatingWALink] = useState(false);
  
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
        fetchWALinks();
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

  // WhatsApp Links
  const fetchWALinks = async () => {
    try {
      const res = await fetch("/api/admin/whatsapp");
      if (res.ok) {
        const data = await res.json();
        setWALinks(data);
      }
    } catch (err) {
      console.error("Failed to load WA links");
    }
  };

  const handleCreateWALink = async () => {
    if (!newWALink.name.trim() || !newWALink.url.trim()) return;
    setCreatingWALink(true);
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWALink.name,
          url: newWALink.url,
          createdBy: currentUser?.id || "admin",
        }),
      });
      if (!res.ok) throw new Error("Failed to create WA link");
      await fetchWALinks();
      setNewWALink({ name: "", url: "" });
    } catch (err) {
      setDataError("Failed to create WA link");
    } finally {
      setCreatingWALink(false);
    }
  };

  const handleToggleWALink = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update WA link");
      await fetchWALinks();
    } catch (err) {
      setDataError("Failed to update WA link");
    }
  };

  const handleDeleteWALink = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/admin/whatsapp?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete WA link");
      await fetchWALinks();
    } catch (err) {
      setDataError("Failed to delete WA link");
    }
  };

  // Product CRUD
  const handleCreateProduct = async (productData: any) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Failed to create product");
      await fetchProducts();
      setShowProductForm(false);
    } catch (err) {
      setDataError("Failed to create product");
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productData, id: editingProduct?.id }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      await fetchProducts();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      setDataError("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (err) {
      setDataError("Failed to delete product");
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingInfo?: { trackingNumber: string; carrier: string }) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status, ...trackingInfo }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      await fetchOrders();
      setShowOrderDetail(false);
      setSelectedOrder(null);
    } catch (err) {
      setDataError("Failed to update order status");
    }
  };

  // User CRUD
  const handleCreateUser = async (userData: any) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create user");
      }
      await fetchUsers();
      setShowUserForm(false);
    } catch (err: any) {
      setDataError(err.message || "Failed to create user");
      throw err;
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, id: editingUser?.id }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      await fetchUsers();
      setShowUserForm(false);
      setEditingUser(null);
    } catch (err) {
      setDataError("Failed to update user");
      throw err;
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err) {
      setDataError("Failed to delete user");
    }
  };

  // Wallet config save
  const handleSaveWalletConfig = async () => {
    try {
      const res = await fetch("/api/admin/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...walletConfig,
          updatedBy: currentUser?.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to save wallet config");
      alert(t("saved"));
    } catch (err) {
      setDataError("Failed to save wallet config");
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

  // Access denied component
  const renderAccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">{t("accessDenied")}</h2>
      <p className="text-slate-400">{t("noPermission")}</p>
    </div>
  );

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
              <p className="text-3xl font-bold text-emerald-400">€{Number(dashboardData?.todayRevenue || 0).toFixed(2)}</p>
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

  const renderProducts = () => {
    // Check if user has any product-related permission
    if (!hasPermission("products") && !hasPermission("inventory")) {
      return renderAccessDenied();
    }

    const canEditProducts = hasPermission("products");
    const canManageInventory = hasPermission("inventory");

    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{t("products")}</h2>
            {canEditProducts && (
              <button 
                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("brand")}</th>
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
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="text-white block">{product.name}</span>
                          <span className="text-slate-500 text-xs">{product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300">{product.brand || "-"}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">€{Number(product.price).toFixed(2)}</td>
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
                      {(canEditProducts || canManageInventory) && (
                        <button 
                          onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors mr-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {canEditProducts && (
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showProductForm && (
          <ProductForm
            product={editingProduct}
            onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
            t={t}
            canEditAll={canEditProducts}
          />
        )}
      </>
    );
  };

  const renderOrders = () => {
    // Check if user has any order-related permission
    if (!hasPermission("orders") && !hasPermission("shipping")) {
      return renderAccessDenied();
    }

    const canManageShipping = hasPermission("shipping");

    return (
      <>
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
                  <tr key={order.id} className="hover:bg-slate-700/30 cursor-pointer"
                    onClick={() => { setSelectedOrder(order); setShowOrderDetail(true); }}
                  >
                    <td className="px-4 py-3 text-white font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white">{order.customerName}</p>
                        <p className="text-slate-400 text-sm">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">€{Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                        order.status === 'CONFIRMED' ? 'bg-indigo-500/20 text-indigo-400' :
                        order.status === 'PROCESSING' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                        order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'REFUNDED' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {t(order.status.toLowerCase() as TranslationKey)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canManageShipping && (
                        <button 
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowOrderDetail(true); }}
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showOrderDetail && selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => { setShowOrderDetail(false); setSelectedOrder(null); }}
            onUpdateStatus={handleUpdateOrderStatus}
            t={t}
            canManageShipping={canManageShipping}
          />
        )}
      </>
    );
  };

  const renderSettings = () => {
    // Only SUPERADMIN can access settings
    if (!hasPermission("settings")) {
      return renderAccessDenied();
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">{t("settings")}</h2>
        
        {/* Wallet Configuration */}
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
            <button 
              onClick={handleSaveWalletConfig}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              {t("saveChanges")}
            </button>
          </div>
        </div>

        {/* WhatsApp Links Management */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-400" />
            WhatsApp {t("links") || "Links"}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            管理前台「通过WhatsApp获取优惠」按钮的跳转链接。多个链接将随机分配。
          </p>
          
          {/* Add New WA Link */}
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-white mb-3">{t("addNewLink") || "Add New Link"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="链接名称 (如: 客服1)"
                value={newWALink.name}
                onChange={(e) => setNewWALink({ ...newWALink, name: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              />
              <input
                type="url"
                placeholder="WhatsApp链接 (https://wa.me/...)"
                value={newWALink.url}
                onChange={(e) => setNewWALink({ ...newWALink, url: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500 md:col-span-2"
              />
            </div>
            <button
              onClick={handleCreateWALink}
              disabled={!newWALink.name.trim() || !newWALink.url.trim() || creatingWALink}
              className="mt-3 flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              {creatingWALink ? t("adding") || "Adding..." : t("add") || "Add"}
            </button>
          </div>

          {/* WA Links List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white mb-2">{t("existingLinks") || "Existing Links"}</h4>
            {waLinks.length === 0 ? (
              <p className="text-slate-500 text-sm">{t("noLinksYet") || "No links yet"}</p>
            ) : (
              waLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{link.name}</p>
                    <p className="text-slate-400 text-xs truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${link.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {link.isActive ? t("active") : t("inactive")}
                    </span>
                    <button
                      onClick={() => handleToggleWALink(link.id, link.isActive)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                      title={link.isActive ? t("deactivate") || "Deactivate" : t("activate") || "Activate"}
                    >
                      {link.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteWALink(link.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
                      title={t("delete")}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    // Only SUPERADMIN can access user management
    if (!hasPermission("users")) {
      return renderAccessDenied();
    }

    const canManageUsers = hasPermission("users");

    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{t("userManagement")}</h2>
            {canManageUsers && (
              <button
                onClick={() => { setEditingUser(null); setShowUserForm(true); }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t("addUser")}
              </button>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("username")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("email")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("role")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">{t("status")}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-white font-medium">{user.username}</td>
                    <td className="px-4 py-3 text-slate-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'SUPERADMIN' ? 'bg-purple-500/20 text-purple-400' :
                        user.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' :
                        user.role === 'SUPPLY' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {t(user.role.toLowerCase() as TranslationKey)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {user.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canManageUsers && (
                        <button
                          onClick={() => { setEditingUser(user); setShowUserForm(true); }}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors mr-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {canManageUsers && user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showUserForm && (
          <UserForm
            user={editingUser}
            onSave={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => { setShowUserForm(false); setEditingUser(null); }}
            t={t}
            currentUserRole={currentUser?.role}
          />
        )}
      </>
    );
  };

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
            {activeTab === "users" && renderUsers()}
          </>
        )}
      </main>
    </div>
  );
}
