import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVariant } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  X,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ShieldCheck,
  ZoomIn,
  Truck,
  RotateCcw
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    cart,
    updateCartQuantity
  } = useApp();

  if (!selectedProduct) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    selectedProduct.variants && selectedProduct.variants.length > 0
      ? selectedProduct.variants[0]
      : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const price = selectedVariant
    ? selectedVariant.discountPrice || selectedVariant.price
    : selectedProduct.discountPrice || selectedProduct.price;

  const originalPrice = selectedVariant
    ? selectedVariant.price
    : selectedProduct.price;

  const hasDiscount = selectedVariant
    ? !!selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price
    : !!selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedVariant, quantity);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              {selectedProduct.shopName}
            </span>
            <h3 className="text-sm font-bold text-white line-clamp-1">{selectedProduct.name}</h3>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image & Zoom */}
        <div className="py-4 relative flex justify-center">
          <div
            className="w-full max-w-xs h-56 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 relative cursor-zoom-in group"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'group-hover:scale-105'
              }`}
            />
            <div className="absolute bottom-2 right-2 bg-neutral-950/80 backdrop-blur p-1.5 rounded-lg text-neutral-300 text-[10px] flex items-center gap-1 border border-neutral-800">
              <ZoomIn className="w-3 h-3 text-amber-400" />
              <span>{isZoomed ? 'Click to normal' : 'Tap to zoom'}</span>
            </div>
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-xs px-2 py-0.5 rounded-lg shadow">
                Save ₹{originalPrice - price}
              </span>
            )}
          </div>
        </div>

        {/* Price & Stock info */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{formatCurrency(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-neutral-500 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
            <span className="text-xs text-neutral-400 ml-auto">
              {selectedProduct.stock > 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  In Stock ({selectedProduct.stock} units)
                </span>
              ) : (
                <span className="text-rose-400 font-semibold">Out of Stock</span>
              )}
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">{selectedProduct.description}</p>

          {/* Variant Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-neutral-300">Choose Size / Variant</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow'
                          : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="ml-1.5 text-[10px] opacity-80">({formatCurrency(v.discountPrice || v.price)})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata badges: SKU, Brand, Unit */}
          <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-[11px]">
            <div>
              <span className="text-neutral-500 block text-[10px]">Brand</span>
              <span className="font-semibold text-neutral-200 truncate">{selectedProduct.brand || 'Local Merchant'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Unit</span>
              <span className="font-semibold text-neutral-200">{selectedProduct.unit}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">SKU</span>
              <span className="font-mono text-[10px] text-neutral-400">{selectedProduct.sku}</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 py-1">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Express Local Dispatch
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Neighborhood Verified
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Easy Store Return
            </span>
          </div>

          {/* Quantity & Add to Cart Footer */}
          <div className="pt-3 border-t border-neutral-800 flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl font-bold text-xs p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              id="modal-btn-add-cart"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART ({formatCurrency(price * quantity)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
