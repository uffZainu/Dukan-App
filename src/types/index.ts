export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface UserLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  postalCode?: string;
  landmark?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  savedAddresses: SavedAddress[];
  privacySettings: {
    hidePhoneNumber: boolean;
    useApproximateLocation: boolean;
    allowMarketingNotifications: boolean;
  };
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  city: string;
  postalCode: string;
  landmark?: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface ShopHours {
  open: string;  // e.g. "08:00"
  close: string; // e.g. "21:30"
  daysOpen: string; // e.g. "Mon - Sun"
  isOpenNow: boolean;
}

export interface Shop {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  categoryId: string;
  logoUrl: string;
  coverUrl: string;
  ownerName: string;
  ownerId: string;
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  estimatedDeliveryMins: number;
  minimumOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  hours: ShopHours;
  isVerified: boolean;
  isSponsored: boolean;
  status: 'active' | 'pending_approval' | 'suspended';
  allowsCod: boolean;
  allowsUpi: boolean;
  allowsCards: boolean;
  phoneMasked: string; // Displayed safely without leaking real number
  email: string;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "500g", "1kg", "Large"
  price: number;
  discountPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  brand?: string;
  sku: string;
  stock: number;
  unit: string; // "kg", "pack", "pcs", "litre"
  variants?: ProductVariant[];
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhoneMasked: string;
  deliveryAddress: SavedAddress;
  shopId: string;
  shopName: string;
  shopAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_verification' | 'cod_pending' | 'failed' | 'refunded';
  paymentId?: string;
  signatureVerification?: string;
  orderStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  estimatedDeliveryTime: string;
  courierLocation?: { lat: number; lng: number };
  customerNote?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  shopId: string;
  shopName: string;
  shopLogo: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface CallSession {
  id: string;
  type: 'audio' | 'video';
  shopId: string;
  shopName: string;
  shopLogo: string;
  targetRole: UserRole;
  status: 'calling' | 'connected' | 'ended' | 'rejected';
  startTime?: number;
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
}

export interface Review {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  shopReply?: {
    comment: string;
    date: string;
  };
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'shop' | 'user' | 'order' | 'product' | 'promotion';
  targetId: string;
  targetName: string;
  timestamp: string;
  details: string;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'shop' | 'review' | 'product';
  targetId: string;
  targetName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ShopPost {
  id: string;
  shopId: string;
  shopName: string;
  shopLogo: string;
  title: string;
  content: string;
  imageUrl?: string;
  tag: 'Offer' | 'New Arrival' | 'Daily Special' | 'Notice';
  likesCount: number;
  hasLiked?: boolean;
  createdAt: string;
  commentsCount: number;
}
