import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Compass,
  Search,
  Package,
  User,
  LayoutDashboard,
  Boxes,
  MessageSquare,
  ShieldCheck,
  Flag,
  Sparkles,
  BarChart3,
  FileText
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    currentRole,
    customerTab,
    setCustomerTab,
    shopkeeperTab,
    setShopkeeperTab,
    adminTab,
    setAdminTab,
    setSelectedShopId,
    orders,
    moderationReports
  } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending').length;
  const pendingReportsCount = moderationReports.filter((r) => r.status === 'pending').length;

  if (currentRole === 'customer') {
    return (
      <nav aria-label="Customer Navigation" className="sticky bottom-0 z-30 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/90 px-2 py-1 flex items-center justify-around">
        <button
          id="nav-customer-home"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerTab('home');
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            customerTab === 'home'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          id="nav-customer-shops"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerTab('shops');
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            customerTab === 'shops'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Nearby Map</span>
        </button>

        <button
          id="nav-customer-search"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerTab('search');
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            customerTab === 'search'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        <button
          id="nav-customer-orders"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerTab('orders');
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition relative ${
            customerTab === 'orders'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Orders</span>
          {orders.length > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          id="nav-customer-profile"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerTab('profile');
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            customerTab === 'profile'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </nav>
    );
  }

  if (currentRole === 'shopkeeper') {
    return (
      <nav aria-label="Shopkeeper Navigation" className="sticky bottom-0 z-30 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/90 px-2 py-1 flex items-center justify-around">
        <button
          id="nav-merchant-dashboard"
          onClick={() => setShopkeeperTab('dashboard')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
            shopkeeperTab === 'dashboard'
              ? 'text-emerald-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </button>

        <button
          id="nav-merchant-orders"
          onClick={() => setShopkeeperTab('orders')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition relative ${
            shopkeeperTab === 'orders'
              ? 'text-emerald-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Orders</span>
          {pendingOrdersCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          id="nav-merchant-products"
          onClick={() => setShopkeeperTab('products')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
            shopkeeperTab === 'products'
              ? 'text-emerald-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Boxes className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Products</span>
        </button>

        <button
          id="nav-merchant-messages"
          onClick={() => setShopkeeperTab('messages')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
            shopkeeperTab === 'messages'
              ? 'text-emerald-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Messages</span>
        </button>

        <button
          id="nav-merchant-profile"
          onClick={() => setShopkeeperTab('profile')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
            shopkeeperTab === 'profile'
              ? 'text-emerald-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Shop Info</span>
        </button>
      </nav>
    );
  }

  // Admin bottom nav
  return (
    <nav aria-label="Admin Navigation" className="sticky bottom-0 z-30 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/90 px-2 py-1 flex items-center justify-around">
      <button
        id="nav-admin-shops"
        onClick={() => setAdminTab('shops')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
          adminTab === 'shops'
            ? 'text-indigo-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <ShieldCheck className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Approvals</span>
      </button>

      <button
        id="nav-admin-moderation"
        onClick={() => setAdminTab('moderation')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition relative ${
          adminTab === 'moderation'
            ? 'text-indigo-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Flag className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Reports</span>
        {pendingReportsCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
            {pendingReportsCount}
          </span>
        )}
      </button>

      <button
        id="nav-admin-promotions"
        onClick={() => setAdminTab('promotions')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
          adminTab === 'promotions'
            ? 'text-indigo-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Sparkles className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Promotions</span>
      </button>

      <button
        id="nav-admin-analytics"
        onClick={() => setAdminTab('analytics')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
          adminTab === 'analytics'
            ? 'text-indigo-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Analytics</span>
      </button>

      <button
        id="nav-admin-audit"
        onClick={() => setAdminTab('audit')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
          adminTab === 'audit'
            ? 'text-indigo-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <FileText className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Audit Logs</span>
      </button>
    </nav>
  );
};
