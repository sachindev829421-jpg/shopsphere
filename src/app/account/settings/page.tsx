"use client";

import { useState } from "react";
import { Bell, ShieldCheck, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [promos, setPromos] = useState(false);

  const handleSave = () => {
    toast.success("Notification preferences updated!");
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage notification alerts and data privacy preferences.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span>Order & Shipment Notifications</span>
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Email Order Confirmation & Tracking</p>
                  <p className="text-[11px] text-slate-500">Receive receipt invoices and dispatch milestones via email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">SMS / WhatsApp Shipment Updates</p>
                  <p className="text-[11px] text-slate-500">Get out-for-delivery alerts directly on your phone</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Promotional Vouchers & Sale Announcements</p>
                  <p className="text-[11px] text-slate-500">Special seasonal discounts, festival coupon drops</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={promos}
                onChange={(e) => setPromos(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
