import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Product, Shop } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Video,
  Eye,
  EyeOff,
  AlertTriangle,
  Upload,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Megaphone,
  Image as ImageIcon,
  Heart,
  Radio
} from 'lucide-react';

export const ShopkeeperDashboard: React.FC = () => {
  const {
    currentShop,
    setCurrentShop,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    posts,
    createPost,
    deletePost,
    startCall,
    setActiveChatShopId,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'posts' | 'profile' | 'analytics'>('orders');

  // Broadcast / Post Creation Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTag, setPostTag] = useState<'Offer' | 'Daily Special' | 'New Arrival' | 'Notice'>('Daily Special');
  const [postImageUrl, setPostImageUrl] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=600');

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Groceries');
  const [prodUnit, setProdUnit] = useState('1 kg');
  const [prodStock, setProdStock] = useState('50');
  const [prodSku, setProdSku] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400');

  // Shop Profile Edit States
  const [shopName, setShopName] = useState(currentShop.name);
  const [shopTagline, setShopTagline] = useState(currentShop.tagline);
  const [shopMinOrder, setShopMinOrder] = useState(currentShop.minimumOrder.toString());
  const [shopDeliveryFee, setShopDeliveryFee] = useState(currentShop.deliveryFee.toString());
  const [shopOpenTime, setShopOpenTime] = useState(currentShop.hours.open);
  const [shopCloseTime, setShopCloseTime] = useState(currentShop.hours.close);

  const shopOrders = orders.filter((o) => o.shopId === currentShop.id);
  const myProducts = products.filter((p) => p.shopId === currentShop.id);

  // Analytics
  const totalSales = shopOrders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = shopOrders.filter((o) => o.orderStatus === 'pending').length;

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdDiscountPrice('');
    setProdCategory('Groceries');
    setProdUnit('1 kg');
    setProdStock('25');
    setProdSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400');
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price.toString());
    setProdDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setProdCategory(prod.category);
    setProdUnit(prod.unit);
    setProdStock(prod.stock.toString());
    setProdSku(prod.sku);
    setProdImage(prod.imageUrl);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodName,
        description: prodDesc,
        price: parseFloat(prodPrice),
        discountPrice: prodDiscountPrice ? parseFloat(prodDiscountPrice) : undefined,
        category: prodCategory,
        unit: prodUnit,
        stock: parseInt(prodStock, 10) || 0,
        sku: prodSku,
        imageUrl: prodImage
      });
      showToast('Product updated.');
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        shopId: currentShop.id,
        shopName: currentShop.name,
        name: prodName,
        description: prodDesc,
        price: parseFloat(prodPrice),
        discountPrice: prodDiscountPrice ? parseFloat(prodDiscountPrice) : undefined,
        category: prodCategory,
        unit: prodUnit,
        stock: parseInt(prodStock, 10) || 0,
        sku: prodSku || `SKU-${Date.now().toString().slice(-4)}`,
        imageUrl: prodImage,
        isAvailable: true
      };
      addProduct(newProd);
      showToast('New product added to store catalog.');
    }
    setIsProductModalOpen(false);
  };

  const handleSaveShopProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentShop({
      ...currentShop,
      name: shopName,
      tagline: shopTagline,
      minimumOrder: parseFloat(shopMinOrder) || 0,
      deliveryFee: parseFloat(shopDeliveryFee) || 0,
      hours: {
        ...currentShop.hours,
        open: shopOpenTime,
        close: shopCloseTime
      }
    });
    showToast('Store settings saved.');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showToast('Please enter post headline and message.');
      return;
    }

    createPost({
      shopId: currentShop.id,
      shopName: currentShop.name,
      shopLogo: currentShop.logoUrl,
      title: postTitle,
      content: postContent,
      tag: postTag,
      imageUrl: postImageUrl.trim() ? postImageUrl.trim() : undefined
    });

    setPostTitle('');
    setPostContent('');
    setIsPostModalOpen(false);
  };

  const myPosts = posts.filter((p) => p.shopId === currentShop.id);

  const filteredOrders = shopOrders.filter((o) => {
    if (orderStatusFilter === 'pending') return o.orderStatus === 'pending';
    if (orderStatusFilter === 'active')
      return ['accepted', 'preparing', 'ready', 'out_for_delivery'].includes(o.orderStatus);
    if (orderStatusFilter === 'completed')
      return ['delivered', 'cancelled'].includes(o.orderStatus);
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4 overflow-y-auto">
      {/* Merchant Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentShop.logoUrl}
            alt={currentShop.name}
            className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-500/50 shadow"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">{currentShop.name}</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {currentShop.category} • ⭐ {currentShop.rating} ({currentShop.reviewCount})
            </p>
            <span className="text-[10px] font-semibold text-emerald-400">
              Open today: {currentShop.hours.open} - {currentShop.hours.close}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-bold shadow transition"
            title="Broadcast an update or special to neighborhood customers"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Post Update</span>
          </button>
          <button
            onClick={openAddProduct}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 px-3 py-2 rounded-xl text-xs font-bold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Stat Highlights */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Today's Sales</span>
          <span className="text-sm font-extrabold text-white mt-0.5 block">
            {formatCurrency(totalSales)}
          </span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">All Orders</span>
          <span className="text-sm font-extrabold text-amber-400 mt-0.5 block">
            {shopOrders.length}
          </span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Pending</span>
          <span className="text-sm font-extrabold text-rose-400 mt-0.5 block">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Orders ({shopOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'products'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Catalog ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'posts'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Broadcasts ({myPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Store Settings
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Insights
        </button>
      </div>

      {/* TAB 1: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'pending', 'active', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setOrderStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  orderStatusFilter === filter
                    ? 'bg-neutral-800 text-amber-400 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              No orders found under {orderStatusFilter} status.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          #{ord.id}
                        </span>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-[10px] text-neutral-400">{ord.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-0.5">{ord.customerName}</h4>
                      <p className="text-[10px] text-neutral-400">{ord.deliveryAddress.address}</p>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-xs space-y-1">
                    {ord.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-neutral-300">
                        <span>
                          {it.quantity}x {it.product.name}
                        </span>
                        <span>
                          {formatCurrency(
                            (it.selectedVariant?.discountPrice ||
                              it.selectedVariant?.price ||
                              it.product.discountPrice ||
                              it.product.price) * it.quantity
                          )}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-neutral-800 pt-1 flex justify-between font-bold text-white">
                      <span>Total ({ord.paymentMethod.toUpperCase()})</span>
                      <span className="text-amber-400">{formatCurrency(ord.total)}</span>
                    </div>
                  </div>

                  {/* Status Action Controls */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {ord.orderStatus === 'pending' && (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'accepted')}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1 shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                          className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {ord.orderStatus === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing')}
                        className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                      >
                        Start Packing (Preparing)
                      </button>
                    )}

                    {ord.orderStatus === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready')}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Mark Ready for Courier
                      </button>
                    )}

                    {ord.orderStatus === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'out_for_delivery')}
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs"
                      >
                        Handed to Courier (Out for Delivery)
                      </button>
                    )}

                    {ord.orderStatus === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'delivered')}
                        className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs"
                      >
                        Confirm Delivery Completed
                      </button>
                    )}

                    {ord.orderStatus === 'delivered' && (
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mx-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Order Complete & Funds Deposited</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Store Inventory ({myProducts.length})</span>
            <button
              onClick={openAddProduct}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {myProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-14 h-14 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                    <span className="font-bold text-amber-400">{formatCurrency(prod.price)}</span>
                    <span>•</span>
                    <span>Stock: {prod.stock}</span>
                    <span>•</span>
                    <span>{prod.unit}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">SKU: {prod.sku}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      updateProduct({
                        ...prod,
                        isAvailable: !prod.isAvailable
                      })
                    }
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                      prod.isAvailable
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                    }`}
                    title={prod.isAvailable ? 'In Stock (Active)' : 'Out of Stock'}
                  >
                    {prod.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEditProduct(prod)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(prod.id)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 flex items-center justify-center transition"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STORE SETTINGS & PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveShopProfile} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow space-y-3">
          <h3 className="text-xs font-bold text-white">Merchant Store Profile</h3>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">Shop Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">Tagline / Specialties</label>
            <input
              type="text"
              value={shopTagline}
              onChange={(e) => setShopTagline(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Minimum Order (₹)</label>
              <input
                type="number"
                value={shopMinOrder}
                onChange={(e) => setShopMinOrder(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Delivery Fee (₹)</label>
              <input
                type="number"
                value={shopDeliveryFee}
                onChange={(e) => setShopDeliveryFee(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Opening Time</label>
              <input
                type="text"
                value={shopOpenTime}
                onChange={(e) => setShopOpenTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Closing Time</label>
              <input
                type="text"
                value={shopCloseTime}
                onChange={(e) => setShopCloseTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow transition mt-2"
          >
            Save Store Settings
          </button>
        </form>
      )}

      {/* TAB 4: STORE INSIGHTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>Performance Summary</span>
            </div>
            <p className="text-xs text-neutral-400">
              Your store is currently in the top 10% of local neighborhood merchants in Bangalore.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 text-[10px] block">Average Order Value</span>
                <span className="font-bold text-white">
                  {formatCurrency(shopOrders.length > 0 ? totalSales / shopOrders.length : 0)}
                </span>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 text-[10px] block">Repeat Customers</span>
                <span className="font-bold text-emerald-400">68%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BROADCASTS & POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Store Updates & Broadcasts</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Published updates appear instantly on neighborhood customers' home feed.
              </p>
            </div>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Post</span>
            </button>
          </div>

          {myPosts.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">No updates broadcasted yet</h4>
                <p className="text-[11px] text-neutral-400 mt-1 max-w-xs mx-auto">
                  Announce fresh morning arrivals, flash discounts, or weekend deals to attract nearby customers.
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="inline-flex items-center gap-1 bg-amber-500 text-neutral-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Post</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-amber-500/20 text-amber-400 border-amber-500/40">
                        {post.tag}
                      </span>
                      <span className="text-[10px] text-neutral-500">{post.createdAt}</span>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1 transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white">{post.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden max-h-44 bg-neutral-950 border border-neutral-800">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 text-rose-400">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{post.likesCount} customer likes</span>
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span>{post.commentsCount} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BROADCAST POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Broadcast Neighborhood Post</h3>
                  <p className="text-[10px] text-neutral-400">Instant notification to local customers</p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 pt-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Category Tag</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Daily Special', 'Offer', 'New Arrival', 'Notice'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPostTag(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                        postTag === t
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Headline / Catchy Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Fresh Mangoes Just Unloaded - Flat 20% Off!"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Message & Details</label>
                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Describe your update, special deal, freshness, or availability..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Featured Image URL (Optional)</label>
                <input
                  type="url"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-amber-300">
                <Radio className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span>Will be broadcasted live to all customers in your 10km radius.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-lg transition mt-2 flex items-center justify-center gap-1.5"
              >
                <Megaphone className="w-4 h-4" />
                <span>Publish Post Broadcast</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white">
                {editingProduct ? 'Edit Product Item' : 'Add New Item to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 pt-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Organic Farm Strawberries"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Freshly picked from Ooty farms daily..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Unit / Measure</label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="1 kg / 500g"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Stock Qty</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">SKU Code</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Image Web URL</label>
                <input
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-lg transition mt-3"
              >
                {editingProduct ? 'Save Product Changes' : 'Add Item to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
