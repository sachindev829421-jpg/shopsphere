import { prisma } from "@/lib/prisma";
import AdminUserManager from "./AdminUserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
      orders: {
        where: { paymentStatus: "PAID" },
        select: { total: true },
      },
    },
  });

  const formatted = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    orderCount: u._count.orders,
    reviewCount: u._count.reviews,
    totalSpent: Math.round(u.orders.reduce((sum, o) => sum + o.total, 0)),
  }));

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Customer Accounts & Roles</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review customer registrations, lifetime spending, account activation, and role permissions.
        </p>
      </div>

      <AdminUserManager initialUsers={formatted} />
    </div>
  );
}
