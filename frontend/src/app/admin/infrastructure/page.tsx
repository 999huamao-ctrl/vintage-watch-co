"use client";

import { useState, useEffect } from "react";
import { 
  Shield, Key, Wallet, Globe, Mail, Bell, AlertTriangle, 
  CheckCircle, Clock, Save, RefreshCw, Lock, ExternalLink 
} from "lucide-react";

// 基础设施配置接口
interface InfrastructureConfig {
  payment: {
    usdtAddress: string;
    backupAddress: string;
    network: string;
  };
  apiKeys: {
    tronGrid: string;
    customNode?: string;
  };
  tracking: {
    facebookPixel?: string;
    googleAds?: string;
    googleAnalytics?: string;
  };
  notifications: {
    email: string;
    lowBalanceThreshold: number;
  };
  accounts: {
    id: string;
    name: string;
    type: string;
    status: "active" | "warning" | "expired";
    expiresAt?: string;
    cost?: string;
    notes?: string;
  }[];
}

const defaultConfig: InfrastructureConfig = {
  payment: {
    usdtAddress: "TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c",
    backupAddress: "TCWgr2qGcheRsD7kceoFpJfMg59fFrJGCq",
    network: "TRC20 (Tron)"
  },
  apiKeys: {
    tronGrid: "默认节点 (免费 100k/日)",
  },
  tracking: {
    facebookPixel: "",
    googleAds: "",
    googleAnalytics: ""
  },
  notifications: {
    email: "xujingtaiguo@icloud.com",
    lowBalanceThreshold: 100
  },
  accounts: [
    {
      id: "1",
      name: "Surge.sh 部署",
      type: "Hosting",
      status: "active",
      cost: "永久免费",
      notes: "当前域名: horizon-watch-store-1773050228.surge.sh"
    },
    {
      id: "2", 
      name: "TronGrid API",
      type: "Blockchain",
      status: "active",
      cost: "免费额度",
      notes: "100,000 requests/day"
    },
    {
      id: "3",
      name: "Gmail SMTP",
      type: "Email",
      status: "warning",
      notes: "需配置应用密码"
    },
    {
      id: "4",
      name: "Facebook Ads",
      type: "Advertising", 
      status: "expired",
      notes: "待开户"
    },
    {
      id: "5",
      name: "Google Ads",
      type: "Advertising",
      status: "expired", 
      notes: "待开户"
    }
  ]
};

export default function InfrastructurePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterKey, setMasterKey] = useState("");
  const [config, setConfig] = useState<InfrastructureConfig>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // 从 localStorage 加载配置
  useEffect(() => {
    const saved = localStorage.getItem("infrastructure_config");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("配置解析失败");
      }
    }
  }, []);

  const handleAuth = () => {
    // 硬编码 Master Key (STAR_2026_S1)
    if (masterKey === "STAR_2026_S1") {
      setIsAuthenticated(true);
    } else {
      alert("Master Key 错误");
    }
  };

  const handleSave = () => {
    setSaveStatus("saving");
    localStorage.setItem("infrastructure_config", JSON.stringify(config));
    setTimeout(() => {
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  };

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split(".");
      let target: any = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return newConfig;
    });
    setHasChanges(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">基础设施管理</h1>
            <p className="text-gray-800 mt-2">高权限区域 - 需要 Master Key</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Master Key
              </label>
              <input
                type="password"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                placeholder="输入 Master Key"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                onKeyPress={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>

            <button
              onClick={handleAuth}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
            >
              验证并进入
            </button>

            <p className="text-xs text-gray-800 text-center">
              此区域包含敏感配置，仅限 CEO 访问
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-stone-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <div>
              <h1 className="font-bold">基础设施管理</h1>
              <p className="text-xs text-gray-800">高权限后台 | 仅限 S1/STAR</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasChanges && (
              <span className="text-amber-400 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                有未保存的更改
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                saveStatus === "saved"
                  ? "bg-green-600 text-white"
                  : "bg-amber-500 text-stone-900 hover:bg-amber-400"
              }`}
            >
              {saveStatus === "saving" ? (
                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> 保存中...</span>
              ) : saveStatus === "saved" ? (
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 已保存</span>
              ) : (
                <span className="flex items-center gap-2"><Save className="w-4 h-4" /> 保存配置</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 核心配置 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 支付配置 */}
            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold">支付收款配置</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    USDT 收款地址 (主)
                  </label>
                  <input
                    type="text"
                    value={config.payment.usdtAddress}
                    onChange={(e) => updateConfig("payment.usdtAddress", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 font-mono text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-900 mt-1">
                    修改后，前端结账页将自动使用新地址
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    备用收款地址
                  </label>
                  <input
                    type="text"
                    value={config.payment.backupAddress}
                    onChange={(e) => updateConfig("payment.backupAddress", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 font-mono text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-800 bg-blue-50 p-3 rounded-lg">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>网络: {config.payment.network}</span>
                </div>
              </div>
            </section>

            {/* API 配置 */}
            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold">API 密钥管理</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    TronGrid API Key
                  </label>
                  <input
                    type="text"
                    value={config.apiKeys.tronGrid}
                    onChange={(e) => updateConfig("apiKeys.tronGrid", e.target.value)}
                    placeholder="输入自定义 API Key (可选)"
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    自定义 Tron 节点 (可选)
                  </label>
                  <input
                    type="text"
                    value={config.apiKeys.customNode || ""}
                    onChange={(e) => updateConfig("apiKeys.customNode", e.target.value)}
                    placeholder="https://your-tron-node.com"
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* 广告追踪 */}
            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold">广告追踪配置</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={config.tracking.facebookPixel}
                      onChange={(e) => updateConfig("tracking.facebookPixel", e.target.value)}
                      placeholder="例如: 1234567890"
                      className="w-full px-4 py-2 border rounded-lg text-gray-900 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Google Ads ID
                    </label>
                    <input
                      type="text"
                      value={config.tracking.googleAds}
                      onChange={(e) => updateConfig("tracking.googleAds", e.target.value)}
                      placeholder="例如: AW-123456789"
                      className="w-full px-4 py-2 border rounded-lg text-gray-900 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={config.tracking.googleAnalytics}
                      onChange={(e) => updateConfig("tracking.googleAnalytics", e.target.value)}
                      placeholder="例如: G-XXXXXXXXXX"
                      className="w-full px-4 py-2 border rounded-lg text-gray-900 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 右侧 - 账号看板 */}
          <div className="space-y-6">
            {/* 账号状态总览 */}
            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold">外部账号看板</h2>
              </div>
              
              <div className="divide-y">
                {config.accounts.map((account) => (
                  <div key={account.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{account.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            account.status === "active" ? "bg-green-100 text-green-700" :
                            account.status === "warning" ? "bg-amber-100 text-amber-700" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {account.status === "active" ? "正常" :
                             account.status === "warning" ? "需注意" : "待配置"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{account.type}</p>
                        {account.cost && (
                          <p className="text-xs text-gray-900 mt-1">费用: {account.cost}</p>
                        )}
                        {account.notes && (
                          <p className="text-xs text-gray-900 mt-1">{account.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>            </section>

            {/* 通知配置 */}
            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold">通知设置</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    提醒邮箱
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-800" />
                    <input
                      type="email"
                      value={config.notifications.email}
                      onChange={(e) => updateConfig("notifications.email", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    余额预警阈值 (USDT)
                  </label>
                  <input
                    type="number"
                    value={config.notifications.lowBalanceThreshold}
                    onChange={(e) => updateConfig("notifications.lowBalanceThreshold", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">每日汇报</span>
                  </div>
                  <p>每晚 21:00 自动发送日报到 {config.notifications.email}</p>
                </div>
              </div>            </section>

            {/* 快速链接 */}
            <section className="bg-stone-900 text-white rounded-xl p-6">
              <h3 className="font-semibold mb-4">快速链接</h3>
              <div className="space-y-2">
                <a href="https://tronscan.org" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  TronScan 区块链浏览器
                </a>
                <a href="https://www.trongrid.io" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  TronGrid 控制台
                </a>
                <a href="https://surge.sh" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Surge.sh 部署管理
                </a>
              </div>            </section>          </div>        </div>      </main>    </div>  );}