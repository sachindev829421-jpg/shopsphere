import { prisma } from "@/lib/prisma";
import AdminReviewModerator from "./AdminReviewModerator";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Customer Review Moderation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review buyer testimonials, verify authenticity, approve/reject submissions, and purge inappropriate feedback.
        </p>
      </div>

      <AdminReviewModerator
        initialReviews={reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
