"use client";

import { useState } from "react";
import { Star, CheckCircle, MessageSquarePlus, ShieldCheck } from "lucide-react";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ReviewSection({
  productId,
  initialReviews,
  rating,
  reviewCount,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formComment) {
      toast.error("Please fill in all review fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: formRating,
          title: formTitle,
          comment: formComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to submit review");
        return;
      }

      toast.success("Review submitted successfully!");
      if (data.review) {
        setReviews([data.review, ...reviews]);
      }
      setShowModal(false);
      setFormTitle("");
      setFormComment("");
    } catch {
      toast.error("An error occurred while posting your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-12 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Ratings & Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-slate-900 text-lg">{rating.toFixed(1)} out of 5</span>
            <span className="text-slate-400 text-sm">({reviewCount} customer reviews)</span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
          <p className="text-base font-medium">No reviews yet for this product.</p>
          <p className="text-xs text-slate-400 mt-1">Be the first verified customer to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{rev.title}</h4>
                </div>
                <span className="text-xs text-slate-400">{formatDate(rev.createdAt)}</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{rev.user?.name || "Verified Customer"}</span>
                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Write Product Review</h3>
            <p className="text-xs text-slate-500 mb-6">
              Only verified purchasers who ordered this item can submit testimonials.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setFormRating(s)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= formRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-sm text-slate-800">{formRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Exceptional finish and prompt delivery"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Detailed Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="What did you like or dislike about this product? How was the fit, material or performance?"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
