import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Store,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertTriangle,
  ShoppingBag
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalAmount,
    setActiveModal,
    shops
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Group items by shop
  const shopGroups = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    const sId = item.product.shopId;
    if (!acc[sId]) {
      acc[sId] = [];
    }
    acc[sId].push(item);
    return acc;
  }, {});

  const uniqueShopsCount = Object.keys(shopGroups).length;

  // Pricing calculations
  const subtotal = cartTotalAmount;
  const primaryShopId = cart[0]?.product.shopId;
  const primaryShop = shops.find((s) => s.id === primaryShopId) || shops[0];
  const deliveryFee = subtotal >= (primaryShop?.freeDeliveryThreshold || 500) ? 0 : (primaryShop?.deliveryFee || 25);
  const platformFee = 5;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee - appliedDiscount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NEARVO25' || promoCode.trim().toUpperCase() === 'LOCAL50') {
      const disc = promoCode.toUpperCase() === 'LOCAL50' ? 50 : 25;
      setAppliedDiscount(disc);
      setPromoMessage(`Coupon applied! ₹${disc} discount added.`);
    } else {
      setPromoMessage('Invalid coupon code. Try "NEARVO25" or "LOCAL50".');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your Cart is Empty</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add fresh products from your favorite neighborhood stores!
            </p>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow hover:bg-amber-600 transition"
          >
            Explore Nearby Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h2 className="text-sm font-bold text-white">Your Shopping Cart</h2>
            <p className="text-[11px] text-neutral-400">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} items from {uniqueShopsCount} {uniqueShopsCount === 1 ? 'store' : 'stores'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCart}
              className="text-[11px] text-neutral-400 hover:text-rose-400 font-medium px-2 py-1 rounded transition"
            >
              Clear
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-shop notification if more than 1 shop */}
        {uniqueShopsCount > 1 && (
          <div className="mt-3 bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl flex items-start gap-2 text-[11px] text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              Your cart has items from multiple stores. In accordance with local dispatch rules, separate courier dispatches will be prepared for each store.
            </span>
          </div>
        )}

        {/* Cart items grouped by Shop */}
        <div className="space-y-4 py-3">
          {(Object.entries(shopGroups) as [string, CartItem[]][]).map(([shopId, items]) => {
            const shop = shops.find((s) => s.id === shopId) || shops[0];
            return (
              <div key={shopId} className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">{shop.name}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">~{shop.estimatedDeliveryMins} min delivery</span>
                </div>

                <div className="space-y-2">
                  {items.map((item) => {
                    const price = item.selectedVariant
                      ? item.selectedVariant.discountPrice || item.selectedVariant.price
                      : item.product.discountPrice || item.product.price;

                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.id || 'none'}`}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate">{item.product.name}</h4>
                          {item.selectedVariant && (
                            <span className="text-[10px] text-amber-400 font-medium">
                              Variant: {item.selectedVariant.name}
                            </span>
                          )}
                          <div className="text-[11px] text-neutral-400">
                            {formatCurrency(price)} × {item.quantity} ={' '}
                            <span className="text-white font-bold">{formatCurrency(price * item.quantity)}</span>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden font-bold text-xs shrink-0">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedVariant?.id
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 text-neutral-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-white text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedVariant?.id
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 text-neutral-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo code coupon box */}
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code (e.g. NEARVO25)"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs transition"
            >
              Apply
            </button>
          </div>
          {promoMessage && (
            <p className="text-[10px] text-amber-300 mt-1 pl-1">{promoMessage}</p>
          )}
        </div>

        {/* Bill Summary */}
        <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 my-3 text-xs space-y-1.5">
          <div className="flex justify-between text-neutral-400">
            <span>Items Subtotal</span>
            <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-neutral-400">
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-medium'}>
              {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
            </span>
          </div>

          <div className="flex justify-between text-neutral-400">
            <span>Local Platform Fee</span>
            <span className="text-white font-medium">{formatCurrency(platformFee)}</span>
          </div>

          {appliedDiscount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Coupon Discount</span>
              <span>- {formatCurrency(appliedDiscount)}</span>
            </div>
          )}

          <div className="border-t border-neutral-800 pt-2 mt-1 flex justify-between font-extrabold text-sm text-white">
            <span>To Pay</span>
            <span className="text-amber-400 text-base">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          id="btn-proceed-checkout"
          onClick={() => {
            setActiveModal('checkout');
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-neutral-950 font-extrabold text-xs flex items-center justify-between shadow-xl transition active:scale-[0.99]"
        >
          <span>PROCEED TO CHECKOUT</span>
          <div className="flex items-center gap-1.5">
            <span>{formatCurrency(grandTotal)}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
