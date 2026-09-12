import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, SavedAddress } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { OrderSuccessAnimation } from './OrderSuccessAnimation';
import {
  X,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Truck,
  PackageCheck
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    currentUser,
    cart,
    cartTotalAmount,
    placeOrder,
    setActiveModal,
    setCustomerTab,
    shops,
    showToast
  } = useApp();

  const primaryShopId = cart[0]?.product.shopId;
  const shop = shops.find((s) => s.id === primaryShopId) || shops[0];

  const [selectedAddress, setSelectedAddress] = useState<SavedAddress>(
    currentUser.savedAddresses[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Trigger subtle, performance-optimized confetti burst upon successful order confirmation
  useEffect(() => {
    if (!orderSuccessId) return;

    try {
      // Primary targeted burst aligned with the checkmark badge
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.44 },
        colors: ['#10B981', '#34D399', '#F59E0B', '#FBBF24', '#2DD4BF', '#FFFFFF'],
        ticks: 150,
        gravity: 1.1,
        scalar: 0.85,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
        zIndex: 99999
      });

      // Secondary micro-burst for layered delight and depth
      const timer = setTimeout(() => {
        confetti({
          particleCount: 22,
          angle: 60,
          spread: 45,
          origin: { x: 0.3, y: 0.48 },
          colors: ['#10B981', '#F59E0B', '#34D399'],
          ticks: 130,
          gravity: 1.2,
          scalar: 0.75,
          disableForReducedMotion: true,
          zIndex: 99999
        });

        confetti({
          particleCount: 22,
          angle: 120,
          spread: 45,
          origin: { x: 0.7, y: 0.48 },
          colors: ['#10B981', '#FBBF24', '#2DD4BF'],
          ticks: 130,
          gravity: 1.2,
          scalar: 0.75,
          disableForReducedMotion: true,
          zIndex: 99999
        });
      }, 190);

      return () => {
        clearTimeout(timer);
        confetti.reset();
      };
    } catch {
      // Fallback gracefully if canvas context is restricted in sandbox
    }
  }, [orderSuccessId]);

  const subtotal = cartTotalAmount;
  const deliveryFee = subtotal >= (shop?.freeDeliveryThreshold || 500) ? 0 : (shop?.deliveryFee || 25);
  const platformFee = 5;
  const discount = subtotal > 300 ? 25 : 0;
  const total = subtotal + deliveryFee + platformFee - discount;

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      // Simulate cryptographic order verification on backend
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const newOrder = await placeOrder(selectedAddress, paymentMethod, customerNote);
      setIsProcessing(false);
      setOrderSuccessId(newOrder.id);
      showToast(`Order #${newOrder.id} placed successfully!`);
    } catch (err: any) {
      setIsProcessing(false);
      showToast(err.message || 'Payment failed. Please try again.');
    }
  };

  if (orderSuccessId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 24,
            stiffness: 280,
            mass: 0.9
          }}
          className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4 relative overflow-hidden"
        >
          {/* Subtle top ambient radial highlight */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-emerald-500/15 blur-2xl rounded-full pointer-events-none" />

          {/* Animated Vector & Drawing Checkmark Success Indicator */}
          <OrderSuccessAnimation size={92} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Order Confirmed</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Thank You, {currentUser.name}!</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Order <span className="text-white font-mono font-bold">#{orderSuccessId}</span> has been confirmed & transmitted to <span className="text-amber-400 font-semibold">{shop.name}</span>.
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="w-full bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800/90 text-xs space-y-2 text-left"
          >
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Total Paid</span>
              <span className="font-black text-emerald-400 text-sm">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Payment Mode</span>
              <span className="uppercase text-white font-medium bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 text-[10px]">
                {paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Estimated Delivery</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>~{shop.estimatedDeliveryMins} mins</span>
              </div>
            </div>

            {/* Live Progress Bar indicator */}
            <div className="pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="text-neutral-400 flex items-center gap-1">
                  <PackageCheck className="w-3 h-3 text-emerald-400" />
                  Merchant Acknowledged
                </span>
                <span className="text-emerald-400 font-mono font-medium">Just now</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.4 }}
            id="btn-track-live-order"
            onClick={() => {
              setActiveModal(null);
              setCustomerTab('orders');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] text-neutral-950 font-black text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 transition"
          >
            <span>TRACK LIVE ORDER TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h2 className="text-sm font-bold text-white">Secure Local Checkout</h2>
            <p className="text-[11px] text-neutral-400">Verified server-side payment encryption</p>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 py-3 text-xs">
          {/* Section 1: Delivery Address Selection */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Deliver To Address</span>
            </label>

            <div className="space-y-2">
              {currentUser.savedAddresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-300 mt-0.5">{addr.address}</p>
                      {addr.landmark && (
                        <p className="text-[10px] text-neutral-400 mt-0.5">Near: {addr.landmark}</p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note for Merchant */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400">
              Delivery instructions for merchant/courier (Optional)
            </label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="e.g. Ring doorbell, leave at door, don't call"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Section 2: Payment Methods */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-neutral-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Payment Method</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* UPI Option */}
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-20 ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-white">Instant UPI</span>
                  <QrCode className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[10px] text-neutral-400">GPay, PhonePe, Paytm, QR</span>
              </button>

              {/* Cards Option */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-20 ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-white">Cards</span>
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] text-neutral-400">Debit / Credit / RuPay</span>
              </button>

              {/* Cash on Delivery */}
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-20 col-span-2 ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">Cash / Pay on Delivery (COD)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/50 font-semibold">
                    Supported by Store
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">
                  Inspect goods at your door before handing cash or scanning delivery partner UPI.
                </span>
              </button>
            </div>
          </div>

          {/* Sub-options for UPI */}
          {paymentMethod === 'upi' && (
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-around gap-2 text-[11px]">
              <button
                onClick={() => setUpiApp('gpay')}
                className={`flex-1 py-1.5 text-center rounded-lg border font-semibold ${
                  upiApp === 'gpay'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                    : 'border-neutral-800 text-neutral-400'
                }`}
              >
                Google Pay
              </button>
              <button
                onClick={() => setUpiApp('phonepe')}
                className={`flex-1 py-1.5 text-center rounded-lg border font-semibold ${
                  upiApp === 'phonepe'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                    : 'border-neutral-800 text-neutral-400'
                }`}
              >
                PhonePe
              </button>
              <button
                onClick={() => setUpiApp('qr')}
                className={`flex-1 py-1.5 text-center rounded-lg border font-semibold ${
                  upiApp === 'qr'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                    : 'border-neutral-800 text-neutral-400'
                }`}
              >
                Scan UPI QR
              </button>
            </div>
          )}

          {/* Privacy & Anti-leak guarantee */}
          <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Leak Privacy Protocol</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              Your cellular phone number is never printed on box slips. The courier only receives your delivery token and masked proxy call alias.
            </p>
          </div>

          {/* Pay Button */}
          <button
            id="btn-place-order-confirm"
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-neutral-950 font-extrabold text-xs flex items-center justify-between shadow-xl transition active:scale-[0.99] disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full"
                />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>{isProcessing ? 'AUTHORIZING & TRANSMITTING...' : 'PLACE ORDER'}</span>
            </div>
            <span className="text-sm font-black">{formatCurrency(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
