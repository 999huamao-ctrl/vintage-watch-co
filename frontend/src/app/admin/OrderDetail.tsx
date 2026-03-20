"use client";

import { useState } from "react";
import { X, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { TranslationKey } from "./i18n";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
}

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, trackingInfo?: { trackingNumber: string; carrier: string }) => void;
  t: (key: TranslationKey) => string;
  canManageShipping?: boolean;
}

const statusOptions = [
  { value: "PENDING", label: "pending", icon: Clock, color: "amber" },
  { value: "CONFIRMED", label: "confirmed", icon: CheckCircle, color: "indigo" },
  { value: "PROCESSING", label: "processing", icon: Clock, color: "purple" },
  { value: "PAID", label: "paid", icon: CheckCircle, color: "emerald" },
  { value: "SHIPPED", label: "shipped", icon: Truck, color: "blue" },
  { value: "DELIVERED", label: "delivered", icon: Package, color: "green" },
  { value: "CANCELLED", label: "cancelled", icon: XCircle, color: "red" },
  { value: "REFUNDED", label: "refunded", icon: XCircle, color: "orange" },
];

export default function OrderDetail({ order, onClose, onUpdateStatus, t, canManageShipping = true }: OrderDetailProps) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [shippingCarrier, setShippingCarrier] = useState(order.carrier || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    const trackingInfo = newStatus === "SHIPPED" ? { trackingNumber, carrier: shippingCarrier } : undefined;
    await onUpdateStatus(order.id, newStatus, trackingInfo);
    setIsSubmitting(false);
  };

  const currentStatus = statusOptions.find(s => s.value === order.status);
  const StatusIcon = currentStatus?.icon || Clock;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">{t("orderNumber")} #{order.orderNumber}</h2>
            <p className="text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 客户信息 */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">{t("customer")}</h3>
            <p className="text-white font-medium">{order.customerName}</p>
            <p className="text-slate-400 text-sm">{order.customerEmail}</p>
          </div>

          {/* 订单金额 */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">{t("total")}</h3>
            <p className="text-2xl font-bold text-amber-400">€{Number(order.total).toFixed(2)}</p>
          </div>

          {/* 当前状态 */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">{t("status")}</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-${currentStatus?.color}-500/20 text-${currentStatus?.color}-400`}>
              <StatusIcon className="w-4 h-4" />
              <span className="font-medium">{t(currentStatus?.label as TranslationKey)}</span>
            </div>
          </div>

          {/* 物流信息（如果已发货） */}
          {order.status === "SHIPPED" || order.status === "DELIVERED" ? (
            <div className="bg-slate-900/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">{t("trackingInfo")}</h3>
              {order.trackingNumber ? (
                <div className="space-y-2">
                  <p className="text-white"><span className="text-slate-400">{t("trackingNumber")}: </span>{order.trackingNumber}</p>
                  <p className="text-white"><span className="text-slate-400">{t("shippingCarrier")}: </span>{order.carrier}</p>
                </div>
              ) : (
                <p className="text-slate-400">{t("noTrackingInfo")}</p>
              )}
            </div>
          ) : null}

          {/* 更新状态 - 仅物流角色可以操作 */}
          {canManageShipping && (
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-sm font-medium text-white mb-4">{t("updateStatus")}</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewStatus(option.value as Order["status"])}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left ${
                        newStatus === option.value
                          ? `bg-${option.color}-500/20 border-${option.color}-500 text-${option.color}-400`
                          : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{t(option.label as TranslationKey)}</span>
                    </button>
                  );
                })}
              </div>

              {/* 物流信息输入（仅在发货状态） */}
              {newStatus === "SHIPPED" && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">{t("trackingNumber")}</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                      placeholder="1Z999AA10123456784"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">{t("shippingCarrier")}</label>
                    <select
                      value={shippingCarrier}
                      onChange={(e) => setShippingCarrier(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">{t("selectCarrier")}</option>
                      <option value="DHL">DHL</option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="TNT">TNT</option>
                      <option value="GLS">GLS</option>
                      <option value="DPD">DPD</option>
                      <option value="Local Post">Local Post</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpdate}
                disabled={isSubmitting || newStatus === order.status}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? t("updating") : t("updateStatus")}
              </button>
            </div>
          )}
          
          {!canManageShipping && (
            <div className="border-t border-slate-700 pt-6 text-center">
              <p className="text-slate-400 text-sm">{t("noPermission")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
