"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          ...(newPassword ? { currentPassword, newPassword } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading your profile...</div>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">Personal Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your contact details and security credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Change Password Block */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-400">Leave blank if you do not want to alter your password.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Required if setting new password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
