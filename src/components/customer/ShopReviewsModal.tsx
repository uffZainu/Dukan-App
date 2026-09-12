import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Send,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

export const ShopReviewsModal: React.FC = () => {
  const {
    selectedShopId,
    setActiveModal,
    shops,
    reviews,
    addReview
  } = useApp();

  const shop = shops.find((s) => s.id === selectedShopId) || shops[0];
  const shopReviews = reviews.filter((r) => r.shopId === shop.id);

  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addReview(shop.id, ratingInput, commentInput);
      setCommentInput('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              {shop.name}
            </span>
            <h2 className="text-sm font-bold text-white">Customer Reviews & Ratings</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Rating Card */}
        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 my-3 flex items-center justify-between">
          <div className="text-center">
            <span className="text-3xl font-black text-white">{shop.rating}</span>
            <div className="flex items-center gap-0.5 text-amber-400 my-1 justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(shop.rating) ? 'fill-amber-400' : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-neutral-400">Based on {shop.reviewCount} reviews</span>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Neighborhood Buyers</span>
            </div>
            <p className="text-[10px] text-neutral-400 max-w-[200px]">
              Reviews are only allowed from customers who completed orders with this shop.
            </p>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-2.5 mb-3">
          <span className="text-xs font-bold text-white block">Rate Your Experience</span>

          {/* Star selector */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingInput(star)}
                className="p-1 transition hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= ratingInput
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-700 hover:text-amber-500'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-400 ml-2">{ratingInput} of 5 Stars</span>
          </div>

          <textarea
            rows={2}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write genuine feedback about item freshness, packing, and courier delivery speed..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
          />

          <button
            type="submit"
            disabled={!commentInput.trim() || isSubmitting}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting...' : 'Submit Verified Review'}</span>
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <span className="text-xs font-bold text-neutral-400 block">Recent Customer Feedback</span>

          {shopReviews.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-500">
              No reviews yet. Be the first to leave one after ordering!
            </div>
          ) : (
            shopReviews.map((rev) => (
              <div key={rev.id} className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{rev.customerName}</span>
                      <span className="text-[10px] text-neutral-400">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-amber-400 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>

                {rev.verifiedPurchase && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Purchase</span>
                  </div>
                )}

                {rev.shopReply && (
                  <div className="bg-neutral-900 border-l-2 border-amber-500 p-2.5 rounded-r-xl space-y-1 text-xs mt-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400">Response from Store</span>
                      <span className="text-neutral-500">{rev.shopReply.date}</span>
                    </div>
                    <p className="text-neutral-300 text-[11px]">{rev.shopReply.comment}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
