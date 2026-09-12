import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shop } from '../../types';
import { formatDistance } from '../../utils/helpers';
import {
  MapPin,
  Navigation,
  Phone,
  Video,
  MessageSquare,
  Clock,
  Star,
  Compass,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const InteractiveMapView: React.FC = () => {
  const {
    userLocation,
    shops,
    setSelectedShopId,
    startCall,
    setActiveChatShopId,
    radiusKm,
    setActiveModal
  } = useApp();

  const [activePinShop, setActivePinShop] = useState<Shop | null>(shops[0] || null);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');

  // Filter shops within radius
  const nearbyShops = shops.filter((s) => (s.distanceKm || 0) <= radiusKm);

  // Map coordinate projection relative to userLocation (SVG bounds 0-400, 0-350)
  const mapCenter = { lat: userLocation.lat, lng: userLocation.lng };
  const scale = 3200; // coordinate to pixel scaling factor

  const projectToMap = (lat: number, lng: number) => {
    const x = 200 + (lng - mapCenter.lng) * scale;
    const y = 175 - (lat - mapCenter.lat) * scale;
    // Bound safely inside the SVG
    return {
      x: Math.max(30, Math.min(370, x)),
      y: Math.max(30, Math.min(320, y))
    };
  };

  const userPoint = { x: 200, y: 175 };

  return (
    <div className="flex-1 flex flex-col relative bg-neutral-950 overflow-hidden">
      {/* Top Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-xs shadow-lg flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="font-semibold text-white">Live Discovery Map</span>
          <span className="text-[10px] text-neutral-400">({nearbyShops.length} stores in {radiusKm}km)</span>
        </div>

        <button
          onClick={() => setActiveModal('locationPicker')}
          className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-xs font-semibold text-amber-400 hover:text-white shadow-lg flex items-center gap-1.5 transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Change Pin</span>
        </button>
      </div>

      {/* Vector Interactive Map Canvas */}
      <div className="flex-1 relative flex items-center justify-center bg-neutral-900/40 select-none">
        <svg
          viewBox="0 0 400 350"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Map Grid Pattern */}
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.8" />
            </pattern>

            {/* User Pulse Glow */}
            <radialGradient id="userRadar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background & Grid */}
          <rect width="100%" height="100%" fill="#121212" />
          <rect width="100%" height="100%" fill="url(#mapGrid)" />

          {/* Road Network Lines */}
          <path
            d="M -20 180 Q 150 160 420 190"
            stroke="#2e333d"
            strokeWidth="10"
            fill="none"
          />
          <path
            d="M 190 -20 Q 210 180 180 370"
            stroke="#2e333d"
            strokeWidth="12"
            fill="none"
          />
          <path
            d="M 20 60 L 380 300"
            stroke="#242933"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M 50 320 Q 200 240 370 70"
            stroke="#242933"
            strokeWidth="6"
            fill="none"
          />

          {/* Neighborhood Park / Green Zone */}
          <path
            d="M 60 70 Q 110 50 140 100 Q 100 140 50 120 Z"
            fill="#064e3b"
            fillOpacity="0.35"
            stroke="#059669"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text x="75" y="98" fill="#10b981" fontSize="9" fontWeight="600" opacity="0.8">
            Eco Green Park
          </text>

          {/* Metro Line */}
          <path
            d="M -10 100 L 410 140"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeDasharray="6 4"
            fill="none"
          />
          <circle cx="210" cy="120" r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
          <text x="218" y="123" fill="#a5b4fc" fontSize="8" fontWeight="bold">
            Metro Gate 2
          </text>

          {/* Radius Discovery Circle */}
          <circle
            cx={userPoint.x}
            cy={userPoint.y}
            r="120"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* Route path to active pin shop */}
          {activePinShop && (
            (() => {
              const shopPt = projectToMap(activePinShop.lat, activePinShop.lng);
              return (
                <path
                  d={`M ${userPoint.x} ${userPoint.y} Q ${(userPoint.x + shopPt.x) / 2 + 15} ${(userPoint.y + shopPt.y) / 2 - 15} ${shopPt.x} ${shopPt.y}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="5 4"
                  className="animate-pulse"
                />
              );
            })()
          )}

          {/* User Location Radar Pulse */}
          <circle cx={userPoint.x} cy={userPoint.y} r="28" fill="url(#userRadar)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx={userPoint.x} cy={userPoint.y} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <circle cx={userPoint.x} cy={userPoint.y} r="2.5" fill="#000000" />
          <text
            x={userPoint.x}
            y={userPoint.y + 17}
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontWeight="bold"
            className="drop-shadow"
          >
            You Are Here
          </text>

          {/* Shop Pins */}
          {nearbyShops.map((shop) => {
            const pt = projectToMap(shop.lat, shop.lng);
            const isSelected = activePinShop?.id === shop.id;

            return (
              <g
                key={shop.id}
                onClick={() => setActivePinShop(shop)}
                className="cursor-pointer transition-transform duration-200"
                transform={`translate(${pt.x}, ${pt.y})`}
              >
                {/* Pin Shadow */}
                <ellipse cx="0" cy="5" rx="7" ry="3" fill="#000000" opacity="0.5" />

                {/* Pin Shape */}
                <path
                  d="M 0 -22 C -9 -22 -14 -16 -14 -8 C -14 2 0 10 0 10 C 0 10 14 2 14 -8 C 14 -16 9 -22 0 -22 Z"
                  fill={isSelected ? '#f59e0b' : '#1e293b'}
                  stroke={isSelected ? '#ffffff' : '#64748b'}
                  strokeWidth="1.5"
                />

                {/* Inner Icon Dot */}
                <circle cx="0" cy="-10" r="4.5" fill={isSelected ? '#000000' : '#f59e0b'} />

                {/* Shop Name Label Pill */}
                <rect
                  x="-35"
                  y="-34"
                  width="70"
                  height="12"
                  rx="6"
                  fill="#0f172a"
                  stroke={isSelected ? '#f59e0b' : '#334155'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="-25"
                  textAnchor="middle"
                  fill={isSelected ? '#fbbf24' : '#e2e8f0'}
                  fontSize="7.5"
                  fontWeight="bold"
                >
                  {shop.name.length > 13 ? shop.name.slice(0, 11) + '..' : shop.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Shop Preview Bottom Drawer */}
      {activePinShop && (
        <div className="bg-neutral-900 border-t border-neutral-800 p-4 shadow-2xl z-30 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <img
                src={activePinShop.logoUrl}
                alt={activePinShop.name}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white truncate">{activePinShop.name}</h3>
                  {activePinShop.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 truncate">{activePinShop.category}</p>
                <div className="flex items-center gap-3 text-xs mt-1 text-neutral-300">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{activePinShop.rating}</span>
                    <span className="text-neutral-500 font-normal">({activePinShop.reviewCount})</span>
                  </div>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    {formatDistance(activePinShop.distanceKm || 0.8)} away
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Clock className="w-3 h-3" />
                    <span>~{activePinShop.estimatedDeliveryMins} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="map-btn-call"
              onClick={() => startCall(activePinShop, 'audio')}
              className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              title="Private in-app audio call without sharing phone number"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call</span>
            </button>

            <button
              id="map-btn-video"
              onClick={() => startCall(activePinShop, 'video')}
              className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              title="Private in-app video call to inspect goods live"
            >
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span>Video</span>
            </button>

            <button
              id="map-btn-chat"
              onClick={() => setActiveChatShopId(activePinShop.id)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Chat</span>
            </button>

            <button
              id="map-btn-view-shop"
              onClick={() => setSelectedShopId(activePinShop.id)}
              className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1 shadow-md transition"
            >
              <span>View Store</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
