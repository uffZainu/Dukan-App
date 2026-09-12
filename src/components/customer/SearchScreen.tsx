import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/initialData';
import { formatDistance, formatCurrency } from '../../utils/helpers';
import {
  Search,
  X,
  Store,
  ShoppingBag,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const {
    shops,
    products,
    setSelectedShopId,
    setSelectedProduct,
    addToCart,
    radiusKm
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'shops' | 'products'>('all');

  const cleanQuery = query.toLowerCase().trim();

  // Search matching shops
  const matchedShops = shops.filter((s) => {
    if (!cleanQuery) return true;
    return (
      s.name.toLowerCase().includes(cleanQuery) ||
      s.category.toLowerCase().includes(cleanQuery) ||
      s.tagline.toLowerCase().includes(cleanQuery) ||
      s.tags.some((t) => t.toLowerCase().includes(cleanQuery))
    );
  });

  // Search matching products
  const matchedProducts = products.filter((p) => {
    if (!cleanQuery) return true;
    return (
      p.name.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      (p.brand && p.brand.toLowerCase().includes(cleanQuery))
    );
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 space-y-3 overflow-y-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by shop name, organic greens, sourdough, battery..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-9 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition border ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800'
          }`}
        >
          All Results
        </button>
        <button
          onClick={() => setActiveFilter('shops')}
          className={`px-3 py-1.5 rounded-xl font-medium transition border ${
            activeFilter === 'shops'
              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800'
          }`}
        >
          Shops ({matchedShops.length})
        </button>
        <button
          onClick={() => setActiveFilter('products')}
          className={`px-3 py-1.5 rounded-xl font-medium transition border ${
            activeFilter === 'products'
              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800'
          }`}
        >
          Products ({matchedProducts.length})
        </button>
      </div>

      {/* Quick Search Chips if query is empty */}
      {!query && (
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
            Popular Searches Near You
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['Fresh Sourdough', 'Baby Spinach', 'Cold Pressed Oil', 'Type-C Cable', 'ORS Sachets', 'Cardamom'].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs px-3 py-1.5 rounded-xl transition"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Results Section: Shops */}
      {(activeFilter === 'all' || activeFilter === 'shops') && (
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
            Matching Shops ({matchedShops.length})
          </span>

          <div className="space-y-2">
            {matchedShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShopId(shop.id)}
                className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 flex items-center justify-between gap-3 group transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={shop.logoUrl}
                    alt={shop.name}
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition truncate">
                        {shop.name}
                      </h4>
                      {shop.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{shop.category}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                      <span className="text-emerald-400 font-bold">{formatDistance(shop.distanceKm || 0.7)}</span>
                      <span>•</span>
                      <span>~{shop.estimatedDeliveryMins} min delivery</span>
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-400 flex items-center justify-center transition shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Section: Products */}
      {(activeFilter === 'all' || activeFilter === 'products') && (
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
            Matching Products ({matchedProducts.length})
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {matchedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex flex-col justify-between group hover:border-neutral-700 transition"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedProduct(prod)}
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-1.5 bg-neutral-950">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[9px] text-amber-400 font-semibold truncate block">
                    {prod.shopName}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {prod.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800">
                  <span className="text-xs font-extrabold text-white">
                    {formatCurrency(prod.discountPrice || prod.price)}
                  </span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 flex items-center justify-center font-bold shadow"
                    title="Add to cart"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
