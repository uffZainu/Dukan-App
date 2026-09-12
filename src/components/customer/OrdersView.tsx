import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  Package,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ChevronRight,
  Truck,
  Store,
  MapPin,
  Star,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  FileText,
  Printer,
  Download,
  X,
  Sparkles
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders,
    startCall,
    setActiveChatShopId,
    shops,
    setActiveModal,
    setSelectedShopId,
    addToCart,
    clearCart,
    showToast
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleReorder = (order: Order) => {
    clearCart();
    order.items.forEach((item) => {
      addToCart(item.product, item.selectedVariant, item.quantity);
    });
    showToast(`Items from #${order.id} loaded to your cart!`);
    setActiveModal('cart');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'accepted':
      case 'preparing':
      case 'ready':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';
      case 'out_for_delivery':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/40 animate-pulse';
      case 'delivered':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'cancelled':
      case 'refunded':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-white">No Orders Placed Yet</h3>
        <p className="text-xs text-neutral-400 max-w-xs">
          Discover fresh bakeries, farm produce, and local shops in your neighborhood.
        </p>
      </div>
    );
  }

  const shopForOrder = shops.find((s) => s.id === selectedOrder?.shopId);

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 space-y-4 overflow-y-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-white">My Orders</h1>
          <p className="text-[11px] text-neutral-400">Live order status and local store timeline</p>
        </div>
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
          {orders.length} orders
        </span>
      </div>

      {/* Orders selector tabs if multiple */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedOrderId(o.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedOrderId === o.id
                  ? 'bg-amber-500 text-neutral-950 border-amber-400'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              #{o.id} • {o.shopName.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Active Order Card */}
      {selectedOrder && (
        <div className="space-y-4">
          {/* Main Status Banner */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-amber-400">
                    #{selectedOrder.id}
                  </span>
                  <span className="text-neutral-500 text-xs">•</span>
                  <span className="text-xs text-neutral-400">{selectedOrder.createdAt}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedOrder.shopName}</h3>
                <p className="text-[10px] text-neutral-400">{selectedOrder.shopAddress}</p>
              </div>

              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getStatusColor(
                  selectedOrder.orderStatus
                )}`}
              >
                {selectedOrder.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Courier ETA & Live Progress Bar */}
            {selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Estimated Arrival</span>
                    <span className="text-xs font-extrabold text-white">
                      Arriving in ~{selectedOrder.estimatedDeliveryTime}
                    </span>
                  </div>
                </div>

                {shopForOrder && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startCall(shopForOrder, 'audio')}
                      className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 flex items-center justify-center transition"
                      title="Private Call to Shop"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveChatShopId(shopForOrder.id)}
                      className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 flex items-center justify-center transition"
                      title="Chat with Shop"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Live Order Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-white block">Order Activity Timeline</span>
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                {selectedOrder.timeline.map((event, index) => (
                  <div key={index} className="relative text-xs">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-900"></div>

                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-white">{event.label}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items In This Order */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow space-y-3">
            <h4 className="text-xs font-bold text-white">Purchased Items ({selectedOrder.items.length})</h4>
            <div className="space-y-2.5">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-800 bg-neutral-950"
                    />
                    <div>
                      <h5 className="font-bold text-white line-clamp-1">{item.product.name}</h5>
                      <span className="text-[10px] text-neutral-400">
                        Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-white">
                    {formatCurrency(
                      (item.selectedVariant?.discountPrice ||
                        item.selectedVariant?.price ||
                        item.product.discountPrice ||
                        item.product.price) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-neutral-800 pt-2 text-[11px] space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-neutral-200">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Delivery Fee</span>
                <span className="text-neutral-200">{formatCurrency(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Platform Fee</span>
                <span className="text-neutral-200">{formatCurrency(selectedOrder.platformFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-1.5 flex justify-between font-bold text-xs text-white">
                <span>Total Amount</span>
                <span className="text-amber-400">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Cryptographic Payment Badge */}
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-neutral-400">
                  Sig: {selectedOrder.signatureVerification?.slice(0, 16)}...
                </span>
              </div>
              <span className="text-emerald-400 font-bold uppercase">
                {selectedOrder.paymentStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Actions: Reorder, Digital Invoice & Reviews */}
            <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-2">
              <button
                id={`btn-reorder-${selectedOrder.id}`}
                onClick={() => handleReorder(selectedOrder)}
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Order</span>
              </button>

              <button
                id={`btn-receipt-${selectedOrder.id}`}
                onClick={() => setShowReceiptModal(true)}
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition active:scale-[0.98]"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bill Receipt</span>
              </button>
            </div>

            {/* Review Button if Delivered */}
            {selectedOrder.orderStatus === 'delivered' && (
              <button
                onClick={() => setActiveModal('shopReviews')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-[0.98]"
              >
                <Star className="w-3.5 h-3.5 fill-neutral-950" />
                <span>Rate & Review This Order</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">TAX INVOICE / RECEIPT</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">#{selectedOrder.id}</span>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Merchant & Customer Info */}
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80 text-[11px] space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Merchant:</span>
                <span className="text-white font-bold text-right">{selectedOrder.shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Store Address:</span>
                <span className="text-neutral-300 text-right max-w-[190px] truncate">{selectedOrder.shopAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Delivered To:</span>
                <span className="text-neutral-300 text-right max-w-[190px] truncate">
                  {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Date & Time:</span>
                <span className="text-neutral-400 font-mono text-right">{selectedOrder.createdAt}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Billed Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950/60 text-xs">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{item.product.name}</div>
                      <div className="text-[10px] text-neutral-400">
                        {item.quantity} × {formatCurrency(item.product.discountPrice || item.product.price)}
                        {item.selectedVariant ? ` (${item.selectedVariant.name})` : ''}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(
                        (item.selectedVariant?.discountPrice ||
                          item.selectedVariant?.price ||
                          item.product.discountPrice ||
                          item.product.price) * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>Items Subtotal</span>
                <span className="font-mono text-neutral-200">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Neighborhood Delivery</span>
                <span className="font-mono text-neutral-200">{formatCurrency(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Platform Convenience Fee</span>
                <span className="font-mono text-neutral-200">{formatCurrency(selectedOrder.platformFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Merchant Promotional Discount</span>
                  <span className="font-mono">-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-2 flex justify-between font-extrabold text-sm text-white">
                <span>Grand Total Paid</span>
                <span className="text-emerald-400 font-mono">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Cryptographic Verification Details */}
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-[10px] space-y-1 font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>PAYMENT MODE:</span>
                <span className="text-white uppercase font-bold">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>TRANSACTION HASH:</span>
                <span className="text-emerald-400">{selectedOrder.signatureVerification}</span>
              </div>
            </div>

            {/* Receipt Modal Footer Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast('Receipt downloaded to device storage.');
                  setShowReceiptModal(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Invoice</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
