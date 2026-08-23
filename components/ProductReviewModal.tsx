"use client";

import React, { useState } from "react";
import { Star, MessageSquarePlus, X } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { useEcomI18n } from "@/lib/i18n";

interface ProductReviewModalProps {
  productName: string;
  sku: string;
}

export default function ProductReviewModal({ productName, sku }: ProductReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success } = useToast();
  const { t } = useEcomI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      success(t.product.reviewSubmitted);
      setName("");
      setTitle("");
      setComment("");
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-white/10 text-xs text-blue-600 dark:text-blue-400 font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" />
        <span>{t.product.writeReview}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-titanium-950 text-slate-900 dark:text-titanium-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
                  {t.product.reviews}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{productName}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-titanium-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating selector */}
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.product.yourRating}</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-titanium-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ms-2 text-xs text-slate-700 dark:text-titanium-300 font-bold">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.product.yourName}</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.product.reviewTitle}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.product.reviewTitle}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.product.comment}</label>
                <textarea
                  required
                  rows={3}
                  placeholder={t.product.comment}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-titanium-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {t.checkout.backStep}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? "..." : t.product.submitReview}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
