import React, { useState, useEffect, ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wifi,
  Signal,
  BatteryCharging,
  Smartphone,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Store,
  User,
  ShoppingBag,
  Bell,
  Sparkles
} from 'lucide-react';

export const AndroidFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    currentRole,
    setCurrentRole,
    isAndroidFrame,
    setIsAndroidFrame,
    toastMessage,
    setActiveModal,
    cartItemCount,
    orders
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('12:51');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start p-0 sm:py-4">
      {/* Platform Control Bar (Top Bar for Tester / Evaluator) */}
      <header className="w-full max-w-4xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-neutral-900/90 backdrop-blur border-b border-neutral-800 z-50 rounded-b-xl shadow-lg mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-bold text-white shadow-sm">
            V
          </div>
          <div>
            <span className="font-bold tracking-tight text-white">Vicinio</span>
            <span className="text-neutral-400 ml-1.5 hidden sm:inline">Android Local Marketplace</span>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-neutral-950 p-0.5 rounded-xl border border-neutral-800">
          <button
            id="role-btn-customer"
            onClick={() => setCurrentRole('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentRole === 'customer'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            id="role-btn-shopkeeper"
            onClick={() => setCurrentRole('shopkeeper')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentRole === 'shopkeeper'
                ? 'bg-emerald-500 text-neutral-950 font-semibold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Shopkeeper</span>
            {activeOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            id="role-btn-admin"
            onClick={() => setCurrentRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-indigo-500 text-white font-semibold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* View Frame & Play Store Guide */}
        <div className="flex items-center gap-2">
          <button
            id="btn-playstore-docs"
            onClick={() => setActiveModal('playStoreGuide')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-medium transition"
            title="Google Play Store & Android Architecture Specs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Play Store Specs</span>
          </button>

          <button
            id="btn-toggle-frame"
            onClick={() => setIsAndroidFrame(!isAndroidFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition"
            title={isAndroidFrame ? 'Switch to Full-Screen View' : 'Switch to Android Phone Frame'}
          >
            {isAndroidFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Width</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isAndroidFrame
            ? 'max-w-[425px] h-[910px] my-auto rounded-[48px] border-[10px] border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden bg-neutral-900 ring-1 ring-neutral-700/50'
            : 'max-w-2xl min-h-[860px] rounded-2xl border border-neutral-800 shadow-2xl flex flex-col bg-neutral-900 overflow-hidden'
        }`}
      >
        {/* Android Hardware Camera Punch Hole (in phone frame mode) */}
        {isAndroidFrame && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-neutral-800 shadow-inner flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900"></div>
          </div>
        )}

        {/* Android Status Bar */}
        <div className="w-full pt-2.5 pb-1 px-6 flex items-center justify-between text-xs text-neutral-300 select-none z-40 bg-neutral-900/90 backdrop-blur-md">
          <div className="font-semibold tracking-wide text-xs pl-1">{currentTime}</div>
          <div className="flex items-center gap-2 pr-1">
            <Signal className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[10px] font-bold text-neutral-300">5G</span>
            <Wifi className="w-3.5 h-3.5 text-neutral-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-semibold text-neutral-300">98%</span>
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Content Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-neutral-950">
          {children}
        </main>

        {/* Android Gesture Navigation Bar Pill */}
        {isAndroidFrame && (
          <div className="w-full py-2 flex items-center justify-center bg-neutral-950 z-40 select-none">
            <div className="w-32 h-1 bg-neutral-500 rounded-full"></div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-16 left-4 right-4 z-50 bg-neutral-800/95 text-neutral-100 border border-neutral-700/80 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2.5 backdrop-blur animate-bounce">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <span className="font-medium flex-1">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
