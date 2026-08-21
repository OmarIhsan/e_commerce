"use client";

import React, { useState } from "react";
import { Star, MessageSquarePlus, Check, Sparkles, X } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      success("Thank you! Your verified review has been submitted for publication.");
      setName("");
      setTitle("");
      setComment("");
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 rounded-subtle bg-white/5 border border-white/10 hover:border-cyber-cyan/50 hover:bg-white/10 text-xs font-mono text-cyber-cyan transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" />
        <span>Write a Review</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 rounded-card glass-panel border border-white/15 bg-titanium-950 text-titanium-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-wider">
                  Verified Feedback
                </span>
                <h3 className="text-lg font-bold text-titanium-100">Review {productName}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-subtle text-titanium-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {/* Star Rating selector */}
              <div className="space-y-1.5">
                <label className="text-titanium-400 uppercase text-[10px]">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
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
                  <span className="ml-2 text-xs text-titanium-300 font-bold">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-titanium-400 uppercase text-[10px]">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-subtle bg-titanium-900 border border-white/10 text-titanium-100 placeholder:text-titanium-600 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-titanium-400 uppercase text-[10px]">Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Outstanding quality"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-subtle bg-titanium-900 border border-white/10 text-titanium-100 placeholder:text-titanium-600 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-1">
                <label className="text-titanium-400 uppercase text-[10px]">Detailed Review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your thoughts on fit, durability, texture, and everyday usability..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-subtle bg-titanium-900 border border-white/10 text-titanium-100 placeholder:text-titanium-600 focus:outline-none focus:border-cyber-cyan font-sans resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-subtle btn-titanium text-xs font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-subtle btn-cyber-primary text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-glow"
                >
                  {isSubmitting ? (
                    "Publishing..."
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
