import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDistance, formatCurrency } from '../../utils/helpers';
import {
  ArrowLeft,
  Phone,
  Video,
  MessageSquare,
  Navigation,
  Mail,
  Star,
  Clock,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Sparkles,
  Share2,
  Flag,
  Info,
  Megaphone,
  Heart
} from 'lucide-react';

export const ShopProfileView: React.FC = () => {
  const {
    selectedShopId,
    setSelectedShopId,
    shops,
    products,
    cart,
    addToCart,
    updateCartQuantity,
    setSelectedProduct,
    startCall,
    setActiveChatShopId,
    setActiveModal,
    submitReport,
    showToast,
    posts,
    toggleLikePost
  } = useApp();

  const shop = shops.find((s) => s.id === selectedShopId) || shops[0];
  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const shopPosts = posts.filter((p) => p.shopId === shop.id);

  const [activeTab, setActiveTab] = useState<'catalog' | 'updates' | 'about' | 'hours'>('catalog');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');

  const categories = Array.from(new Set(shopProducts.map((p) => p.category)));

  const filteredProducts = shopProducts.filter((p) =>
    selectedProductCategory === 'all' ? true : p.category === selectedProductCategory
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on Vicinio Local Marketplace!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Store link copied to clipboard.');
    }
  };

  const handleReport = () => {
    submitReport('shop', shop.id, shop.name, 'Customer submitted concern regarding shop listing.');
  };

  return (
    <div className="flex-1 flex flex-col pb-8 bg-neutral-950 overflow-y-auto">
      {/* Top Banner & Navigation Bar */}
      <div className="relative h-44 w-full bg-neutral-900 shrink-0">
        <img
          src={shop.coverUrl}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/60"></div>

        {/* Floating Top Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          <button
            id="btn-back-from-shop"
            onClick={() => setSelectedShopId(null)}
            className="w-9 h-9 rounded-full bg-neutral-900/80 backdrop-blur text-white flex items-center justify-center border border-neutral-700/80 shadow hover:bg-neutral-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-neutral-900/80 backdrop-blur text-white flex items-center justify-center border border-neutral-700/80 shadow hover:bg-neutral-800 transition"
              title="Share Shop"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReport}
              className="w-9 h-9 rounded-full bg-neutral-900/80 backdrop-blur text-neutral-400 hover:text-rose-400 flex items-center justify-center border border-neutral-700/80 shadow transition"
              title="Report Shop"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shop Logo Avatar overlapping banner */}
        <div className="absolute -bottom-6 left-4 flex items-end gap-3 z-10">
          <img
            src={shop.logoUrl}
            alt={shop.name}
            className="w-18 h-18 rounded-2xl object-cover border-3 border-neutral-950 shadow-2xl bg-neutral-900"
          />
        </div>
      </div>

      {/* Shop Info Container */}
      <div className="pt-8 px-4 space-y-3">
        {/* Title, Badges & Verification */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">{shop.name}</h1>
            {shop.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Local Store</span>
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{shop.tagline}</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-xs text-neutral-300 py-1 flex-wrap border-y border-neutral-800/70">
          <button
            onClick={() => setActiveModal('shopReviews')}
            className="flex items-center gap-1 text-amber-400 font-bold hover:underline"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{shop.rating}</span>
            <span className="text-neutral-400 font-normal">({shop.reviewCount} reviews)</span>
          </button>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">
            {formatDistance(shop.distanceKm || 0.8)} away
          </span>
          <span>•</span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{shop.hours.daysOpen} ({shop.hours.open} - {shop.hours.close})</span>
          </span>
        </div>

        {/* Shopkeeper Name & Safe Contact Row */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-amber-400 text-[10px]">
              {shop.ownerName[0]}
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] block">Owner / Merchant</span>
              <span className="font-semibold text-neutral-200">{shop.ownerName}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-neutral-400 text-[10px] block">Phone (Masked)</span>
            <span className="font-mono text-[11px] text-neutral-300">{shop.phoneMasked}</span>
          </div>
        </div>

        {/* Contact & Interaction Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {/* CALL BUTTON */}
          <button
            id="profile-btn-call"
            onClick={() => startCall(shop, 'audio')}
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-neutral-200 transition group active:scale-95"
            title="Private In-App Audio Call"
          >
            <Phone className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold">Call</span>
          </button>

          {/* CHAT BUTTON */}
          <button
            id="profile-btn-chat"
            onClick={() => setActiveChatShopId(shop.id)}
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-neutral-200 transition group active:scale-95"
            title="Private One-to-One Chat"
          >
            <MessageSquare className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold">Chat</span>
          </button>

          {/* VIDEO BUTTON */}
          <button
            id="profile-btn-video"
            onClick={() => startCall(shop, 'video')}
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-neutral-200 transition group active:scale-95"
            title="Live Video Call to inspect items"
          >
            <Video className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold">Video</span>
          </button>

          {/* DIRECTIONS BUTTON */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-neutral-200 transition group active:scale-95"
            title="Directions via Google Maps"
          >
            <Navigation className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold">Directions</span>
          </a>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-neutral-800 pt-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
              activeTab === 'catalog'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Products ({shopProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
              activeTab === 'updates'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Broadcasts ({shopPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
              activeTab === 'about'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            About & Address
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
              activeTab === 'hours'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Delivery & Policy
          </button>
        </div>

        {/* Tab 1: Products Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-3 pt-2">
            {/* Category pills inside shop */}
            {categories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedProductCategory('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedProductCategory === 'all'
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  All Items
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedProductCategory(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedProductCategory === c
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Product items list */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No items in this category currently.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredProducts.map((prod) => {
                  const cartItem = cart.find((i) => i.product.id === prod.id);
                  const qtyInCart = cartItem?.quantity || 0;

                  return (
                    <div
                      key={prod.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex items-start gap-3 hover:border-neutral-700 transition"
                    >
                      <div
                        className="cursor-pointer shrink-0 relative"
                        onClick={() => setSelectedProduct(prod)}
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-20 h-20 rounded-xl object-cover bg-neutral-950 border border-neutral-800"
                        />
                        {prod.discountPrice && (
                          <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white font-extrabold text-[8px] px-1 py-0.5 rounded shadow">
                            OFF
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedProduct(prod)}
                        >
                          <h4 className="text-xs font-bold text-white line-clamp-1 hover:text-amber-400 transition">
                            {prod.name}
                          </h4>
                          <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                            {prod.description}
                          </p>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Unit: {prod.unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/60">
                          <div>
                            <span className="text-xs font-extrabold text-white">
                              {formatCurrency(prod.discountPrice || prod.price)}
                            </span>
                            {prod.discountPrice && (
                              <span className="text-[10px] text-neutral-500 line-through ml-1.5">
                                {formatCurrency(prod.price)}
                              </span>
                            )}
                          </div>

                          {/* Cart Button or Stepper */}
                          {qtyInCart === 0 ? (
                            <button
                              id={`shop-add-btn-${prod.id}`}
                              onClick={() => addToCart(prod)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow transition active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>ADD</span>
                            </button>
                          ) : (
                            <div className="flex items-center bg-amber-500 text-neutral-950 rounded-xl font-bold text-xs overflow-hidden shadow">
                              <button
                                onClick={() => updateCartQuantity(prod.id, qtyInCart - 1)}
                                className="px-2 py-1 hover:bg-amber-600 active:bg-amber-700"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2">{qtyInCart}</span>
                              <button
                                onClick={() => updateCartQuantity(prod.id, qtyInCart + 1)}
                                className="px-2 py-1 hover:bg-amber-600 active:bg-amber-700"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Store Broadcast Updates */}
        {activeTab === 'updates' && (
          <div className="space-y-3 pt-2 text-xs">
            {shopPosts.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center text-xs text-neutral-400">
                This store hasn&apos;t published any broadcasts or updates yet.
              </div>
            ) : (
              shopPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-amber-500/20 text-amber-400 border-amber-500/40">
                      {post.tag}
                    </span>
                    <span className="text-[10px] text-neutral-400">{post.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{post.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden max-h-48 bg-neutral-950 border border-neutral-800">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition ${
                        post.hasLiked ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                      <span>{post.likesCount}</span>
                    </button>
                    <span className="text-[11px] text-neutral-500">{post.commentsCount} comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: About & Address */}
        {activeTab === 'about' && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-bold text-white text-xs">Store Description</h4>
              <p className="text-neutral-300 leading-relaxed">{shop.description}</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-bold text-white text-xs">Address & Location</h4>
              <p className="text-neutral-300">{shop.address}</p>
              <div className="text-neutral-400 text-[11px]">
                Latitude: {shop.lat} • Longitude: {shop.lng}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-bold text-white text-xs">Store Badges & Specialties</h4>
              <div className="flex flex-wrap gap-1.5">
                {shop.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] px-2.5 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Delivery & Policy */}
        {activeTab === 'hours' && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-bold text-white text-xs">Order & Delivery Terms</h4>
              <div className="space-y-1.5 text-neutral-300">
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Minimum Order Amount</span>
                  <span className="font-semibold text-white">₹{shop.minimumOrder}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Standard Delivery Fee</span>
                  <span className="font-semibold text-white">₹{shop.deliveryFee}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Free Delivery Threshold</span>
                  <span className="font-semibold text-emerald-400">
                    Orders above ₹{shop.freeDeliveryThreshold}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Supported Payments</span>
                  <span className="text-white">UPI, Cards, Cash on Delivery</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-1.5">
              <h4 className="font-bold text-white text-xs">Privacy & Identity Protection</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Calls and messages between you and this shopkeeper are encrypted in-app and route through masked identifiers. Neither party receives the other&apos;s direct SIM card number.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
