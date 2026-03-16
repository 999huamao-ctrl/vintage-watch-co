"use client";

import { useState } from "react";
import { X, Save, Shield, UserCircle, Package, Truck } from "lucide-react";
import { TranslationKey } from "./i18n";

interface User {
  id?: string;
  username: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "SUPPLY" | "LOGISTICS";
  isActive: boolean;
}

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
  t: (key: TranslationKey) => string;
  currentUserRole?: string;
}

const roles = [
  { value: "SUPERADMIN", label: "superadmin", icon: Shield, description: "Full access to all features" },
  { value: "ADMIN", label: "admin", icon: UserCircle, description: "Manage products and orders" },
  { value: "SUPPLY", label: "supply", icon: Package, description: "Manage inventory and products" },
  { value: "LOGISTICS", label: "logistics", icon: Truck, description: "Manage orders and shipping" },
];

export default function UserForm({ user, onSave, onCancel, t, currentUserRole }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "ADMIN",
    isActive: user?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.username.trim() || !formData.email.trim()) {
      setError(t("invalidCredentials"));
      return;
    }
    
    // 只有 SUPERADMIN 可以创建 SUPERADMIN
    if (formData.role === "SUPERADMIN" && currentUserRole !== "SUPERADMIN") {
      setError("Only Super Admin can create Super Admin accounts");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {user ? t("editUser") : t("addUser")}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* 用户名 */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">{t("username")}</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="admin"
              required
              disabled={!!user}
            />
            {user && <p className="text-slate-500 text-xs mt-1">Username cannot be changed</p>}
          </div>

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">{t("email")}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* 密码（仅新建用户时显示） */}
          {!user && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">{t("password")}</label>
              <input
                type="password"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
                disabled
              />
              <p className="text-slate-500 text-xs mt-1">Default password: username + "123"</p>
            </div>
          )}

          {/* 角色选择 */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">{t("role")}</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isDisabled = role.value === "SUPERADMIN" && currentUserRole !== "SUPERADMIN";
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => !isDisabled && setFormData({ ...formData, role: role.value as User["role"] })}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.role === role.value
                        ? "bg-amber-500/20 border-amber-500"
                        : isDisabled
                        ? "bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${formData.role === role.value ? "text-amber-400" : "text-slate-400"}`} />
                      <span className={`font-medium ${formData.role === role.value ? "text-amber-400" : "text-white"}`}>
                        {t(role.label as TranslationKey)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="isActive" className="text-slate-300">{t("active")}</label>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
