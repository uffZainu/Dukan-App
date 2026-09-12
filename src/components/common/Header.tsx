import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ChevronDown,
  Bell,
  ShoppingCart,
  Search,
  SlidersHorizontal
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    userLocation,
    setActiveModal,
    cartItemCount,
    setCustomerTab,
    customerTab,
    radiusKm,
    setRadiusKm
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800/80 px-4 py-2.5 flex flex-col gap-2">
      {/* Top row: Location & Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        {/* Location selector */}
        <button
          id="btn-select-location"
          onClick={() => setActiveModal('locationPicker')}
          className="flex items-center gap-1.5 text-left max-w-[65%] group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/25 transition">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <span>DELIVERING TO</span>
              <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-xs font-semibold text-neutral-100 truncate">
              {userLocation.address.split(',')[0]}
            </span>
          </div>
        </button>

        {/* Right tools: Notifications & Cart */}
        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <button
            id="btn-notifications"
            onClick={() => setActiveModal('notifications')}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 flex items-center justify-center relative transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          {/* Cart with badge */}
          <button
            id="btn-open-cart"
            onClick={() => setActiveModal('cart')}
            className="h-9 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 text-neutral-950" />
            <span>{cartItemCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
