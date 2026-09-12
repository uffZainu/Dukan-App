import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/initialData';
import { formatDistance, formatCurrency } from '../../utils/helpers';
import { NeighborhoodFeed } from '../common/NeighborhoodFeed';
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Plus,
  Compass,
  Store,
  Tag,
  TrendingUp
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    shops,
    products,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    setSelectedShopId,
    setSelectedProduct,
    addToCart,
    setCustomerTab,
    radiusKm,
    userLocation
  } = useApp();

  // Filter and sort shops
  let filteredShops = shops.filter((s) => {
    const matchesCategory =
      selectedCategory === 'cat-all' || s.categoryId === selectedCategory;
    const withinRadius = (s.distanceKm || 0) <= radiusKm;
    return matchesCategory && withinRadius && s.status === 'active';
  });

  if (sortBy === 'distance') {
    filteredShops.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else if (sortBy === 'rating') {
    filteredShops.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'deliveryTime') {
    filteredShops.sort((a, b) => a.estimatedDeliveryMins - b.estimatedDeliveryMins);
  }

  // Recommended products
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const sponsoredShop = shops.find((s) => s.isSponsored && s.status === 'active');

  return (
    <div className="flex-1 flex flex-col pb-6 space-y-4">
      {/* Search Input Bar Trigger */}
      <div className="px-4 pt-3">
        <button
          id="home-search-trigger"
          onClick={() => setCustomerTab('search')}
          className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl px-4 py-3 text-xs text-neutral-400 flex items-center justify-between shadow-sm transition"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Search shops, groceries, fresh bakery...</span>
          </div>
          <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
            <SlidersHorizontal className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Sponsored Local Merchant Spotlight Banner */}
      {sponsoredShop && (
        <div className="px-4">
          <div
            onClick={() => setSelectedShopId(sponsoredShop.id)}
            className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-neutral-900 to-neutral-900 border border-amber-500/30 p-4 shadow-lg group"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="bg-amber-500 text-neutral-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded tracking-wider uppercase">
                    SPONSORED
                  </span>
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Neighborhood Pick
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white group-hover:text-amber-300 transition truncate">
                  {sponsoredShop.name}
                </h2>
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                  {sponsoredShop.tagline}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-300">
                  <span className="text-emerald-400 font-semibold">
                    {formatDistance(sponsoredShop.distanceKm || 0.6)}
                  </span>
                  <span>•</span>
                  <span>Free delivery over ₹{sponsoredShop.freeDeliveryThreshold}</span>
                </div>
              </div>

              <img
                src={sponsoredShop.logoUrl}
                alt={sponsoredShop.name}
                className="w-16 h-16 rounded-xl object-cover border border-amber-500/40 shrink-0 shadow"
              />
            </div>
          </div>
        </div>
      )}

      {/* Categories Horizontal Carousel */}
      <div className="space-y-2">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Browse Categories
          </h2>
          <span className="text-[11px] text-amber-400 font-medium cursor-pointer" onClick={() => setSelectedCategory('cat-all')}>
            Reset
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-1 no-scrollbar select-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md scale-[1.02]'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Local Delights (Products preview) */}
      <div className="space-y-2">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Popular Near You
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400">Fresh Today</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              className="w-40 shrink-0 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden p-2.5 flex flex-col justify-between group shadow-sm hover:border-neutral-700 transition"
            >
              <div
                className="cursor-pointer"
                onClick={() => setSelectedProduct(prod)}
              >
                <div className="w-full h-28 rounded-xl overflow-hidden mb-2 relative bg-neutral-950">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.discountPrice && (
                    <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                      SAVE ₹{prod.price - prod.discountPrice}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold truncate">
                  {prod.shopName}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight mt-0.5">
                  {prod.name}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800">
                <div>
                  <div className="text-xs font-extrabold text-white">
                    {formatCurrency(prod.discountPrice || prod.price)}
                  </div>
                  {prod.discountPrice && (
                    <div className="text-[10px] text-neutral-500 line-through">
                      {formatCurrency(prod.price)}
                    </div>
                  )}
                </div>

                <button
                  id={`btn-add-${prod.id}`}
                  onClick={() => addToCart(prod)}
                  className="w-7 h-7 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 flex items-center justify-center font-bold shadow transition active:scale-95"
                  title="Add to cart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhood Live Updates / Merchant Posts Feed */}
      <div className="px-4">
        <NeighborhoodFeed />
      </div>

      {/* Nearby Shops Section */}
      <div className="space-y-3 px-4 pt-1">
        {/* Header & Sort Filters */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Nearby Local Shops</span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Stores within {radiusKm}km of {userLocation.city}
              </p>
            </div>

            {/* View on Map Link */}
            <button
              id="home-btn-map"
              onClick={() => setCustomerTab('shops')}
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          {/* Sort Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs select-none">
            <button
              onClick={() => setSortBy('distance')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                sortBy === 'distance'
                  ? 'bg-neutral-800 text-amber-400 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Nearest First
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                sortBy === 'rating'
                  ? 'bg-neutral-800 text-amber-400 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setSortBy('deliveryTime')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                sortBy === 'deliveryTime'
                  ? 'bg-neutral-800 text-amber-400 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Fastest Delivery
            </button>
          </div>
        </div>

        {/* Shops Card List */}
        {filteredShops.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center text-neutral-400 space-y-2">
            <Store className="w-8 h-8 text-neutral-600 mx-auto" />
            <div className="font-bold text-neutral-200 text-sm">No shops found within {radiusKm}km</div>
            <p className="text-xs">Try increasing your discovery radius or resetting category filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShopId(shop.id)}
                className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl overflow-hidden p-3.5 shadow-sm transition group"
              >
                <div className="flex items-start gap-3">
                  {/* Shop Logo DP */}
                  <div className="relative shrink-0">
                    <img
                      src={shop.logoUrl}
                      alt={shop.name}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-800 group-hover:border-amber-500/40 transition"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-neutral-950 px-1.5 py-0.2 rounded-md border border-neutral-800 flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">
                        {shop.name}
                      </h3>
                      {shop.isVerified && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {shop.tagline}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] flex-wrap">
                      <span className="text-emerald-400 font-bold">
                        {formatDistance(shop.distanceKm || 0.7)}
                      </span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        ~{shop.estimatedDeliveryMins} min
                      </span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-400">{shop.category.split(' ')[0]}</span>
                    </div>

                    {/* Minimum order & open status badge */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/80 text-[10px]">
                      <span className="text-neutral-400">
                        Min. Order: ₹{shop.minimumOrder}
                      </span>
                      <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        Open Now ({shop.hours.close} close)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
