import { prisma } from "@/lib/prisma";
import AdminCouponManager from "./AdminCouponManager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { usages: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Coupon & Discount Engine</h1>
        <p className="text-xs text-slate-400 mt-1">
          Issue promotional codes, configure percentage/flat discounts, set min order thresholds, and track usage.
        </p>
      </div>

      <AdminCouponManager
        initialCoupons={coupons.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
          startDate: c.startDate.toISOString(),
          endDate: c.endDate ? c.endDate.toISOString() : null,
          usageCount: c._count.usages,
        }))}
      />
    </div>
  );
}
