"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { SafeUser } from "@/types";

export default function AdminSidebar({ user }: { user: SafeUser }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/users", icon: Users },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="p-6 space-y-6">
        {/* Brand */}
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-base">
            S
          </div>
          <div>
            <span className="font-extrabold text-lg text-white">
              Shop<span className="text-indigo-400">Sphere</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-900">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
