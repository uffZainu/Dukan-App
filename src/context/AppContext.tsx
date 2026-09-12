import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  UserProfile,
  UserLocation,
  Shop,
  Product,
  CartItem,
  Order,
  Review,
  ChatMessage,
  CallSession,
  AuditLog,
  ModerationReport,
  OrderStatus,
  PaymentMethod,
  SavedAddress,
  ProductVariant,
  ShopPost
} from '../types';
import {
  DEFAULT_USER_LOCATION,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MODERATION_REPORTS,
  INITIAL_POSTS
} from '../data/initialData';
import { calculateDistanceKm, generatePaymentSignature } from '../utils/helpers';

interface AppContextType {
  // Roles & User
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  deleteAccount: () => void;

  // Location
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  radiusKm: number;
  setRadiusKm: (r: number) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Shops & Discovery
  shops: Shop[];
  currentShop: Shop;
  setCurrentShop: (shop: Shop) => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'distance' | 'rating' | 'deliveryTime';
  setSortBy: (sort: 'distance' | 'rating' | 'deliveryTime') => void;
  addShop: (newShop: Omit<Shop, 'id' | 'rating' | 'reviewCount'>) => void;
  updateShopStatus: (shopId: string, status: 'active' | 'pending_approval' | 'suspended') => void;
  toggleShopVerification: (shopId: string) => void;
  toggleSponsoredShop: (shopId: string) => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  addProduct: (productData: Omit<Product, 'id'> | Product) => void;
  updateProduct: (productOrId: string | Product, updates?: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  cartTotalAmount: number;
  cartItemCount: number;

  // Checkout & Orders
  orders: Order[];
  placeOrder: (
    deliveryAddress: SavedAddress,
    paymentMethod: PaymentMethod,
    customerNote?: string
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Reviews
  reviews: Review[];
  addReview: (shopId: string, rating: number, comment: string) => void;

  // Neighborhood Posts / Merchant Updates
  posts: ShopPost[];
  createPost: (post: Omit<ShopPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;

  // Communication: Audio/Video Calling
  activeCall: CallSession | null;
  startCall: (shop: Shop, type: 'audio' | 'video') => void;
  endCall: () => void;
  toggleMuteCall: () => void;
  toggleVideoCall: () => void;

  // Communication: Chat
  chatMessages: ChatMessage[];
  activeChatShopId: string | null;
  setActiveChatShopId: (shopId: string | null) => void;
  sendMessage: (text: string) => void;

  // Admin & Moderation
  auditLogs: AuditLog[];
  moderationReports: ModerationReport[];
  reports: ModerationReport[];
  submitReport: (targetType: 'shop' | 'review' | 'product', targetId: string, targetName: string, reason: string) => void;
  resolveReport: (reportId: string, action?: 'resolved' | 'dismissed') => void;

  // UI Navigation & Modals
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  customerTab: 'home' | 'shops' | 'search' | 'orders' | 'profile';
  setCustomerTab: (tab: 'home' | 'shops' | 'search' | 'orders' | 'profile') => void;
  shopkeeperTab: 'dashboard' | 'orders' | 'products' | 'messages' | 'profile';
  setShopkeeperTab: (tab: 'dashboard' | 'orders' | 'products' | 'messages' | 'profile') => void;
  adminTab: 'shops' | 'moderation' | 'promotions' | 'analytics' | 'audit';
  setAdminTab: (tab: 'shops' | 'moderation' | 'promotions' | 'analytics' | 'audit') => void;
  isAndroidFrame: boolean;
  setIsAndroidFrame: (frame: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vicinio_marketplace_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'deliveryTime'>('distance');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tabs
  const [customerTab, setCustomerTab] = useState<'home' | 'shops' | 'search' | 'orders' | 'profile'>('home');
  const [shopkeeperTab, setShopkeeperTab] = useState<'dashboard' | 'orders' | 'products' | 'messages' | 'profile'>('dashboard');
  const [adminTab, setAdminTab] = useState<'shops' | 'moderation' | 'promotions' | 'analytics' | 'audit'>('shops');

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return {
      id: 'cust-current',
      name: 'Saddam Hussain',
      email: 'saddam.hussain261@gmail.com',
      phone: '+91 98712 34812',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Home',
          address: 'Tower 4, Flat 602, Eco City Apartments',
          city: 'Noida',
          postalCode: '201309',
          landmark: 'Near Eco Park Metro Gate 2',
          lat: 28.5355,
          lng: 77.3910,
          isDefault: true
        },
        {
          id: 'addr-2',
          label: 'Work',
          address: 'Floor 8, Pinnacle Business Towers, Cyber City',
          city: 'Noida',
          postalCode: '201301',
          landmark: 'Opposite Metro Station',
          lat: 28.5672,
          lng: 77.3210,
          isDefault: false
        }
      ],
      privacySettings: {
        hidePhoneNumber: true,
        useApproximateLocation: false,
        allowMarketingNotifications: true
      },
      createdAt: '2026-01-15'
    };
  });

  // Shops, Products, Orders, Reviews state
  const [shopsList, setShopsList] = useState<Shop[]>(INITIAL_SHOPS);
  const [currentShop, setCurrentShop] = useState<Shop>(INITIAL_SHOPS[0]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [posts, setPosts] = useState<ShopPost[]>(INITIAL_POSTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(INITIAL_MODERATION_REPORTS);

  // Calls & Chat
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [activeChatShopId, setActiveChatShopId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      conversationId: 'shop-1',
      senderId: 'shop-1',
      senderRole: 'shopkeeper',
      senderName: 'Green Basket Organics',
      text: 'Hello! Thank you for ordering from Green Basket. Our morning organic greens just arrived from the cold storage farm!',
      timestamp: '11:45 AM',
      status: 'read'
    },
    {
      id: 'msg-2',
      conversationId: 'shop-1',
      senderId: 'cust-current',
      senderRole: 'customer',
      senderName: 'Saddam',
      text: 'Hi Sunil, are the hydroponic baby spinach leaves pre-washed?',
      timestamp: '11:48 AM',
      status: 'read'
    },
    {
      id: 'msg-3',
      conversationId: 'shop-1',
      senderId: 'shop-1',
      senderRole: 'shopkeeper',
      senderName: 'Green Basket Organics',
      text: 'Yes, double ozone rinsed and packed in sealed humidity-lock eco boxes! Ready to consume directly.',
      timestamp: '11:50 AM',
      status: 'read'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Re-calculate distance dynamically whenever userLocation changes
  const computedShops = shopsList.map((shop) => {
    const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, shop.lat, shop.lng);
    return {
      ...shop,
      distanceKm: dist
    };
  });

  // User Profile
  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...profileUpdates }));
    showToast('Profile updated successfully');
  };

  const deleteAccount = () => {
    showToast('Account data anonymized and scheduled for deletion in accordance with GDPR/DPDP rules.');
    setCurrentUser((prev) => ({
      ...prev,
      name: 'Deleted User',
      email: 'anonymized@vicinio.local',
      phone: '+91 00000 00000'
    }));
  };

  // Shop management
  const addShop = (newShopData: Omit<Shop, 'id' | 'rating' | 'reviewCount'>) => {
    const newId = `shop-${Date.now()}`;
    const newShop: Shop = {
      ...newShopData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      status: 'pending_approval' // Requires admin approval
    };
    setShopsList((prev) => [newShop, ...prev]);

    // Add audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: 'system',
      adminName: 'Registration Bot',
      action: 'NEW_SHOP_SUBMITTED',
      targetType: 'shop',
      targetId: newId,
      targetName: newShop.name,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: 'New merchant registered. Status set to pending_approval.'
    };
    setAuditLogs((prev) => [log, ...prev]);
    showToast('Shop submitted for Admin verification.');
  };

  const updateShopStatus = (shopId: string, status: 'active' | 'pending_approval' | 'suspended') => {
    setShopsList((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, status } : s))
    );
    const target = shopsList.find((s) => s.id === shopId);
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: 'admin-01',
      adminName: 'Security Admin Master',
      action: `SHOP_STATUS_${status.toUpperCase()}`,
      targetType: 'shop',
      targetId: shopId,
      targetName: target?.name || 'Shop',
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: `Admin updated status to ${status}.`
    };
    setAuditLogs((prev) => [log, ...prev]);
    showToast(`Shop marked as ${status.replace('_', ' ')}`);
  };

  const toggleSponsoredShop = (shopId: string) => {
    setShopsList((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, isSponsored: !s.isSponsored } : s))
    );
    const shop = shopsList.find((s) => s.id === shopId);
    showToast(`${shop?.name} sponsored placement toggled`);
  };

  const toggleShopVerification = (shopId: string) => {
    setShopsList((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, isVerified: !s.isVerified } : s))
    );
    showToast('Merchant verification status updated');
  };

  // Product management
  const addProduct = (productData: Omit<Product, 'id'> | Product) => {
    const newProduct: Product = {
      ...productData,
      id: 'id' in productData ? productData.id : `prod-${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalog`);
  };

  const updateProduct = (productOrId: string | Product, updates?: Partial<Product>) => {
    if (typeof productOrId === 'string') {
      setProducts((prev) =>
        prev.map((p) => (p.id === productOrId ? { ...p, ...updates } : p))
      );
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === productOrId.id ? { ...p, ...productOrId } : p))
      );
    }
    showToast('Product updated successfully');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from shop');
  };

  // Cart
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (!variant || item.selectedVariant?.id === variant.id)
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedVariant: variant, quantity }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) => !(item.product.id === productId && (!variantId || item.selectedVariant?.id === variantId))
        );
      }
      return prev.map((item) => {
        if (item.product.id === productId && (!variantId || item.selectedVariant?.id === variantId)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (!variantId || item.selectedVariant?.id === variantId))
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalAmount = cart.reduce((sum, item) => {
    const price = item.selectedVariant
      ? item.selectedVariant.discountPrice || item.selectedVariant.price
      : item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders
  const placeOrder = async (
    deliveryAddress: SavedAddress,
    paymentMethod: PaymentMethod,
    customerNote?: string
  ): Promise<Order> => {
    if (cart.length === 0) throw new Error('Cart is empty');

    // Identify primary shop from cart items
    const primaryShopId = cart[0].product.shopId;
    const shop = shopsList.find((s) => s.id === primaryShopId) || shopsList[0];

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = cartTotalAmount;
    const deliveryFee = subtotal >= (shop.freeDeliveryThreshold || 500) ? 0 : shop.deliveryFee;
    const platformFee = 5;
    const discount = subtotal > 300 ? 25 : 0;
    const total = subtotal + deliveryFee + platformFee - discount;

    const signature = generatePaymentSignature(orderId, total);

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhoneMasked: currentUser.privacySettings.hidePhoneNumber
        ? '+91 98••• ••812'
        : currentUser.phone,
      deliveryAddress,
      shopId: shop.id,
      shopName: shop.name,
      shopAddress: shop.address,
      items: [...cart],
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
      paymentId: paymentMethod === 'cod' ? undefined : `pay_verified_${Date.now()}`,
      signatureVerification: signature,
      orderStatus: 'pending',
      timeline: [
        {
          status: 'pending',
          label: 'Order Placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Payment token verified server-side. Sent to shopkeeper.'
        }
      ],
      createdAt: 'Just now',
      estimatedDeliveryTime: `${shop.estimatedDeliveryMins} mins`,
      customerNote
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Add Audit Log
    const audit: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: 'system',
      adminName: 'Payment Gatekeeper',
      action: 'ORDER_PLACED_VERIFIED',
      targetType: 'order',
      targetId: orderId,
      targetName: `Order by ${currentUser.name}`,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: `Payment method ${paymentMethod}. Signature: ${signature.slice(0, 14)}...`
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const labelMap: Record<OrderStatus, string> = {
          pending: 'Order Placed',
          accepted: 'Order Accepted',
          preparing: 'Packing Order',
          ready: 'Ready for Pickup',
          out_for_delivery: 'Out for Delivery',
          delivered: 'Delivered',
          cancelled: 'Order Cancelled',
          refunded: 'Payment Refunded'
        };

        const descMap: Record<OrderStatus, string> = {
          pending: 'Waiting for shopkeeper confirmation.',
          accepted: 'Shopkeeper confirmed inventory and accepted.',
          preparing: 'Merchant is carefully inspecting and packing items.',
          ready: 'Items are bagged and ready at the store counter.',
          out_for_delivery: 'Local courier partner has picked up your package.',
          delivered: 'Package handed over safely. Thank you for shopping local!',
          cancelled: 'Order was cancelled.',
          refunded: 'Amount has been returned to original payment source.'
        };

        const newTimelineEvent = {
          status,
          label: labelMap[status],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: descMap[status]
        };

        return {
          ...order,
          orderStatus: status,
          timeline: [...order.timeline, newTimelineEvent]
        };
      })
    );
    showToast(`Order status updated to: ${status.replace(/_/g, ' ')}`);
  };

  // Reviews
  const addReview = (shopId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      shopId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatarUrl,
      rating,
      comment,
      date: 'Just now',
      verifiedPurchase: true
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate shop rating
    setShopsList((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const newCount = s.reviewCount + 1;
          const newRating = Number(((s.rating * s.reviewCount + rating) / newCount).toFixed(1));
          return { ...s, rating: newRating, reviewCount: newCount };
        }
        return s;
      })
    );
    showToast('Review posted! Thank you for supporting local stores.');
  };

  // Posts / Broadcast Updates
  const createPost = (newPostData: Omit<ShopPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>) => {
    const post: ShopPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likesCount: 0,
      hasLiked: false,
      commentsCount: 0,
      createdAt: 'Just now'
    };
    setPosts((prev) => [post, ...prev]);
    showToast('Update broadcasted to your neighborhood!');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post removed.');
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likesCount: hasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );
  };

  // Calls
  const startCall = (shop: Shop, type: 'audio' | 'video') => {
    const session: CallSession = {
      id: `call-${Date.now()}`,
      type,
      shopId: shop.id,
      shopName: shop.name,
      shopLogo: shop.logoUrl,
      targetRole: 'shopkeeper',
      status: 'calling',
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false
    };
    setActiveCall(session);
  };

  const endCall = () => {
    setActiveCall(null);
    showToast('Call ended safely. No phone numbers were shared.');
  };

  const toggleMuteCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleVideoCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null));
  };

  // Chat
  const sendMessage = (text: string) => {
    if (!text.trim() || !activeChatShopId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeChatShopId,
      senderId: currentUser.id,
      senderRole: currentRole,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated automated merchant reply after 2 seconds if customer sends
    if (currentRole === 'customer') {
      setTimeout(() => {
        const shop = shopsList.find((s) => s.id === activeChatShopId);
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          conversationId: activeChatShopId,
          senderId: activeChatShopId,
          senderRole: 'shopkeeper',
          senderName: shop?.ownerName || 'Merchant',
          text: `Thanks for messaging ${shop?.name || 'us'}! We have this prepared and can dispatch right away.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    }
  };

  // Moderation
  const submitReport = (
    targetType: 'shop' | 'review' | 'product',
    targetId: string,
    targetName: string,
    reason: string
  ) => {
    const report: ModerationReport = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType,
      targetId,
      targetName,
      reason,
      status: 'pending',
      createdAt: new Date().toLocaleDateString()
    };
    setModerationReports((prev) => [report, ...prev]);
    showToast('Report submitted. Admin moderation team has been alerted.');
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed' = 'resolved') => {
    setModerationReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    showToast(`Report marked as ${action}`);
  };

  const isLocationModalOpen = activeModal === 'location';
  const setIsLocationModalOpen = (open: boolean) => setActiveModal(open ? 'location' : null);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        updateUserProfile,
        deleteAccount,
        userLocation,
        setUserLocation,
        radiusKm,
        setRadiusKm,
        isLocationModalOpen,
        setIsLocationModalOpen,
        shops: computedShops,
        currentShop,
        setCurrentShop,
        selectedShopId,
        setSelectedShopId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        addShop,
        updateShopStatus,
        toggleShopVerification,
        toggleSponsoredShop,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalAmount,
        cartItemCount,
        orders,
        placeOrder,
        updateOrderStatus,
        reviews,
        addReview,
        posts,
        createPost,
        deletePost,
        toggleLikePost,
        activeCall,
        startCall,
        endCall,
        toggleMuteCall,
        toggleVideoCall,
        chatMessages,
        activeChatShopId,
        setActiveChatShopId,
        sendMessage,
        auditLogs,
        moderationReports,
        reports: moderationReports,
        submitReport,
        resolveReport,
        activeModal,
        setActiveModal,
        customerTab,
        setCustomerTab,
        shopkeeperTab,
        setShopkeeperTab,
        adminTab,
        setAdminTab,
        isAndroidFrame,
        setIsAndroidFrame,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppContextProvider = AppProvider;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
