import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Control Center
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">ShopSphere Administration</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← View Live Storefront
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-full">
              {user.name}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 sm:p-8 bg-slate-950/50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
