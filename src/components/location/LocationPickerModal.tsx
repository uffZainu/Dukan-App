import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRESET_LOCATIONS } from '../../data/initialData';
import { UserLocation } from '../../types';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  X,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';

export const LocationPickerModal: React.FC = () => {
  const {
    userLocation,
    setUserLocation,
    setActiveModal,
    radiusKm,
    setRadiusKm,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    setIsDetecting(true);
    setGpsError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
            city: 'Detected Metro Area',
            landmark: 'GPS Verified Coordinate'
          };
          setUserLocation(newLoc);
          setIsDetecting(false);
          showToast('GPS Location acquired accurately.');
          setActiveModal(null);
        },
        (error) => {
          setIsDetecting(false);
          setGpsError('Browser permission denied or timeout. Switched to neighborhood preset.');
          // Fallback to primary preset
          setUserLocation(PRESET_LOCATIONS[0]);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsDetecting(false);
      setUserLocation(PRESET_LOCATIONS[0]);
      showToast('Geolocation not supported. Loaded default neighborhood.');
      setActiveModal(null);
    }
  };

  const handleSelectPreset = (loc: UserLocation) => {
    setUserLocation(loc);
    showToast(`Location set to: ${loc.city}, ${loc.address.split(',')[0]}`);
    setActiveModal(null);
  };

  const filteredPresets = PRESET_LOCATIONS.filter(
    (loc) =>
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.landmark && loc.landmark.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Select Delivery Location</h2>
              <p className="text-[11px] text-neutral-400">Discover shops within delivery distance</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="pt-4 pb-2">
          <button
            id="btn-detect-gps"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <Crosshair className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting via GPS...' : 'Use Current Device Location'}</span>
          </button>

          {gpsError && (
            <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1.5 bg-amber-950/40 p-2 rounded-lg border border-amber-900/50">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="py-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search street, sector, colony, or landmark..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Radius Slider */}
        <div className="bg-neutral-950/70 p-3 rounded-xl border border-neutral-800 my-2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-400 font-medium">Discovery Radius</span>
            <span className="text-amber-400 font-bold">{radiusKm} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
            <span>Walking (1km)</span>
            <span>Neighborhood (5km)</span>
            <span>City Sector (15km)</span>
          </div>
        </div>

        {/* Presets List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">
            Nearby Neighborhood Addresses
          </div>

          {filteredPresets.map((loc, idx) => {
            const isSelected = userLocation.address === loc.address;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPreset(loc)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/40 text-neutral-100'
                    : 'bg-neutral-950/50 hover:bg-neutral-800/60 border-neutral-800 text-neutral-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{loc.city}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">{loc.address}</p>
                  {loc.landmark && (
                    <p className="text-[10px] text-neutral-400 mt-0.5">Landmark: {loc.landmark}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="pt-3 border-t border-neutral-800 flex items-center gap-2 text-[10px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Privacy First: Your exact doorstep apartment is only revealed to the shopkeeper upon order dispatch.
          </span>
        </div>
      </div>
    </div>
  );
};
