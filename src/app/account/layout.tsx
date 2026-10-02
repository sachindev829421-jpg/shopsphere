"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { label: "Account Overview", href: "/account", icon: LayoutDashboard },
    { label: "My Orders", href: "/account/orders", icon: Package },
    { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Wishlist", href: "/account/wishlist", icon: Heart },
    { label: "Profile Details", href: "/account/profile", icon: User },
    { label: "Settings", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Account Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Account Management
          </p>

          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
