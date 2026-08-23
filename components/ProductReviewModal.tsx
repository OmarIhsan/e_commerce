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
        className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 text-xs text-blue-400 font-medium transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" />
        <span>{t.product.writeReview}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 rounded-2xl border border-white/15 bg-titanium-950 text-titanium-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                  {t.product.reviews}
                </span>
                <h3 className="text-base font-bold text-white">{productName}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-titanium-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating selector */}
              <div className="space-y-1.5">
                <label className="text-titanium-300 font-medium">{t.product.yourRating}</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-titanium-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ms-2 text-xs text-titanium-300 font-bold">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-titanium-300 font-medium">{t.product.yourName}</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-lg titanium-input text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-titanium-300 font-medium">{t.product.reviewTitle}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.product.reviewTitle}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 rounded-lg titanium-input text-xs"
                  />
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="text-titanium-300 font-medium">{t.product.comment}</label>
                <textarea
                  required
                  rows={3}
                  placeholder={t.product.comment}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 rounded-lg titanium-input text-xs resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg btn-titanium text-xs font-semibold"
                >
                  {t.checkout.backStep}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? t.checkout.processing : t.product.submitReview}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
