import React from 'react';
import { AppContextProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/common/AndroidFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/customer/HomeScreen';
import { InteractiveMapView } from './components/location/InteractiveMapView';
import { SearchScreen } from './components/customer/SearchScreen';
import { ShopProfileView } from './components/customer/ShopProfileView';
import { OrdersView } from './components/customer/OrdersView';
import { ProfileView } from './components/customer/ProfileView';
import { ShopkeeperDashboard } from './components/shopkeeper/ShopkeeperDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { LocationPickerModal } from './components/location/LocationPickerModal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartView } from './components/customer/CartView';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { ShopReviewsModal } from './components/customer/ShopReviewsModal';
import { ChatDrawer } from './components/communication/ChatDrawer';
import { CallOverlay } from './components/communication/CallOverlay';

const AppContent: React.FC = () => {
  const {
    currentRole,
    customerTab,
    selectedShopId,
    isLocationModalOpen,
    selectedProduct,
    activeModal,
    activeChatShopId,
    activeCall,
    toastMessage
  } = useApp();

  return (
    <AndroidFrame>
      {/* Top Application Header */}
      <Header />

      {/* Primary Scrollable Screen Content */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
        {/* Floating In-App System Toast */}
        {toastMessage && (
          <div className="sticky top-2 z-40 mx-auto w-11/12 max-w-sm">
            <div className="bg-neutral-900/95 border border-amber-500/50 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl backdrop-blur text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span className="font-medium truncate">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* CUSTOMER ROLE SCREENS */}
        {currentRole === 'customer' && (
          <>
            {selectedShopId ? (
              <ShopProfileView />
            ) : customerTab === 'home' ? (
              <HomeScreen />
            ) : customerTab === 'shops' ? (
              <InteractiveMapView />
            ) : customerTab === 'search' ? (
              <SearchScreen />
            ) : customerTab === 'orders' ? (
              <OrdersView />
            ) : (
              <ProfileView />
            )}
          </>
        )}

        {/* SHOPKEEPER ROLE SCREENS */}
        {currentRole === 'shopkeeper' && <ShopkeeperDashboard />}

        {/* ADMIN ROLE SCREENS */}
        {currentRole === 'admin' && <AdminPanel />}
      </div>

      {/* Role-adaptive Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Modals, Sheets & Overlays */}
      {isLocationModalOpen && <LocationPickerModal />}
      {selectedProduct && <ProductDetailModal />}
      {activeModal === 'cart' && <CartView />}
      {activeModal === 'checkout' && <CheckoutModal />}
      {activeModal === 'shopReviews' && <ShopReviewsModal />}
      {activeChatShopId && <ChatDrawer />}
      {activeCall && <CallOverlay />}
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}
