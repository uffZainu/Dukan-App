import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shop, ModerationReport } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  ShieldAlert,
  Store,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  BarChart,
  DollarSign,
  Flag,
  Trash2,
  Check
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    shops,
    updateShopStatus,
    toggleShopVerification,
    reports,
    resolveReport,
    orders,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'shops' | 'reports' | 'analytics'>('shops');
  const [shopFilter, setShopFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);

  const filteredShops = shops.filter((s) => {
    if (shopFilter === 'all') return true;
    return s.status === shopFilter;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4 overflow-y-auto">
      {/* Admin Platform Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">Platform Governance Console</h2>
              <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Vicinio Network Compliance & Merchant Onboarding
            </p>
          </div>
        </div>
      </div>

      {/* High-level Platform Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total GMV</span>
          <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">
            {formatCurrency(totalGMV)}
          </span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Active Stores</span>
          <span className="text-sm font-extrabold text-amber-400 mt-0.5 block">
            {shops.filter((s) => s.status === 'active').length}
          </span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Open Reports</span>
          <span className="text-sm font-extrabold text-rose-400 mt-0.5 block">
            {reports.filter((r) => r.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('shops')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'shops'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Merchant Approvals ({shops.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'reports'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Moderation Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Compliance Health
        </button>
      </div>

      {/* TAB 1: SHOPS APPROVAL & STATUS */}
      {activeTab === 'shops' && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'pending', 'active', 'suspended'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setShopFilter(filter)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  shopFilter === filter
                    ? 'bg-neutral-800 text-rose-400 border border-rose-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-3 shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={shop.logoUrl}
                      alt={shop.name}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white truncate">{shop.name}</h4>
                        {shop.isVerified && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        Owner: {shop.ownerName} • {shop.phoneMasked}
                      </p>
                      <span className="text-[10px] text-neutral-500">{shop.address}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                      shop.status === 'active'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : shop.status === 'pending'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                    }`}
                  >
                    {shop.status}
                  </span>
                </div>

                {/* Admin Actions for Shop */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800 text-xs">
                  <button
                    onClick={() => toggleShopVerification(shop.id)}
                    className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-amber-400 transition"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{shop.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {shop.status !== 'active' && (
                      <button
                        onClick={() => updateShopStatus(shop.id, 'active')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-[11px] transition"
                      >
                        Approve Store
                      </button>
                    )}
                    {shop.status === 'active' && (
                      <button
                        onClick={() => updateShopStatus(shop.id, 'suspended')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 text-[11px] transition"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USER & LISTING REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              No outstanding moderation reports. Neighborhood trust is 100%.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-2 shadow text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">{rep.targetName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono uppercase">
                        Type: {rep.targetType} • Reported by: {rep.reporterName}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      rep.status === 'pending'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>

                <p className="text-neutral-300 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80">
                  {rep.reason}
                </p>

                {rep.status === 'pending' && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => resolveReport(rep.id)}
                      className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs flex items-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve & Dismiss</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: COMPLIANCE HEALTH */}
      {activeTab === 'analytics' && (
        <div className="space-y-3 text-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-white text-xs">Zero-Leak Privacy Audit</h4>
            <p className="text-neutral-400 leading-relaxed">
              Every phone number across customer and shopkeeper communications is hashed and mapped into encrypted proxy audio channels.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>Cryptographic Identity Tokenization Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
