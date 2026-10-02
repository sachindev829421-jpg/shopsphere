"use client";

import { useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShieldAlert, User, Power, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminUserManager({
  initialUsers,
}: {
  initialUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    isActive: boolean;
    createdAt: string;
    orderCount: number;
    reviewCount: number;
    totalSpent: number;
  }>;
}) {
  const [users, setUsers] = useState(initialUsers);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update role");
        return;
      }

      toast.success(`Role changed to ${newRole}`);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      toast.error("Error updating role");
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update status");
        return;
      }

      toast.success(`Account ${!currentActive ? "activated" : "deactivated"}`);
      setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u)));
    } catch {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">User</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Lifetime Spend</th>
              <th className="py-3.5 px-4">Joined</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-slate-300">{u.email}</p>
                  {u.phone && <p className="text-[10px] text-slate-500">{u.phone}</p>}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      u.role === "ADMIN"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-4 font-semibold text-white">{u.orderCount}</td>
                <td className="py-4 px-4 font-bold text-white">{formatPrice(u.totalSpent)}</td>
                <td className="py-4 px-4 text-slate-400">{formatDate(u.createdAt)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      u.isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleRole(u.id, u.role)}
                      title={`Switch role to ${u.role === "ADMIN" ? "CUSTOMER" : "ADMIN"}`}
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      title={u.isActive ? "Disable Account" : "Activate Account"}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        u.isActive
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
