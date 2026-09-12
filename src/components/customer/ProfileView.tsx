import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  MapPin,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Smartphone,
  Info,
  Building2,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    setCurrentRole,
    setCustomerTab,
    showToast,
    setIsLocationModalOpen
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [phoneInput, setPhoneInput] = useState(currentUser.phone);

  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: nameInput,
      phone: phoneInput
    });
    setIsEditingProfile(false);
    showToast('Profile updated successfully.');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel.trim() || !newAddrText.trim()) return;

    const newAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      address: newAddrText,
      lat: 12.9716 + (Math.random() - 0.5) * 0.02,
      lng: 77.5946 + (Math.random() - 0.5) * 0.02,
      isDefault: currentUser.savedAddresses.length === 0
    };

    setCurrentUser({
      ...currentUser,
      savedAddresses: [...currentUser.savedAddresses, newAddress]
    });

    setNewAddrLabel('');
    setNewAddrText('');
    setIsAddingAddress(false);
    showToast('New address saved to address book.');
  };

  const handleDeleteAddress = (id: string) => {
    if (currentUser.savedAddresses.length <= 1) {
      showToast('You must keep at least one delivery address.');
      return;
    }
    setCurrentUser({
      ...currentUser,
      savedAddresses: currentUser.savedAddresses.filter((a) => a.id !== id)
    });
    showToast('Address removed.');
  };

  const handleSetDefaultAddress = (id: string) => {
    setCurrentUser({
      ...currentUser,
      savedAddresses: currentUser.savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    });
    showToast('Default address updated.');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4 overflow-y-auto">
      {/* Profile Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow"
          />
          <div>
            <h2 className="text-sm font-bold text-white">{currentUser.name}</h2>
            <p className="text-xs text-neutral-400 font-mono">{currentUser.phone}</p>
            <span className="inline-block mt-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {currentUser.role} Account
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="text-xs font-semibold text-amber-400 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-700 transition"
        >
          {isEditingProfile ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Edit Profile Form */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3"
        >
          <h3 className="text-xs font-bold text-white">Update Personal Information</h3>
          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">Full Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">Mobile Phone</label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-600 transition"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Role Switcher Section (Testing & Multi-Role Navigation) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
          Role Switcher & Management
        </span>
        <p className="text-xs text-neutral-400">
          Switch into Shopkeeper or Platform Admin mode to manage your store, inventory, orders, and review moderation:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="profile-switch-shopkeeper"
            onClick={() => {
              setCurrentRole('shopkeeper');
              showToast('Switched to Shopkeeper Partner Portal');
            }}
            className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 transition group text-left"
          >
            <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Shopkeeper</span>
              <span className="text-[10px] text-neutral-500">Store Dashboard</span>
            </div>
          </button>

          <button
            id="profile-switch-admin"
            onClick={() => {
              setCurrentRole('admin');
              showToast('Switched to Platform Administrator Panel');
            }}
            className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-rose-500/60 transition group text-left"
          >
            <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Admin Panel</span>
              <span className="text-[10px] text-neutral-500">Approve & Moderate</span>
            </div>
          </button>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">Saved Delivery Addresses</h3>
          </div>
          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        {/* Add Address Mini-Form */}
        {isAddingAddress && (
          <form onSubmit={handleAddAddress} className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-2">
            <input
              type="text"
              value={newAddrLabel}
              onChange={(e) => setNewAddrLabel(e.target.value)}
              placeholder="Label (e.g. Home, Office, Parents)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <textarea
              rows={2}
              value={newAddrText}
              onChange={(e) => setNewAddrText(e.target.value)}
              placeholder="Flat/House No, Street, Landmark, Pin code"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-3 py-1.5 text-xs text-neutral-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {currentUser.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80 flex items-start justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">{addr.address}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    className="text-[10px] text-neutral-400 hover:text-amber-400"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-neutral-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Privacy Center */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white">Privacy & Security</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
            <div>
              <span className="font-semibold text-white block">Phone Number Masking</span>
              <span className="text-[10px] text-neutral-400">Merchants see proxy digits (+91 98••• ••201)</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-800/40">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
            <div>
              <span className="font-semibold text-white block">Location Permission</span>
              <span className="text-[10px] text-neutral-400">Used strictly for nearby shop discovery</span>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-[10px] bg-neutral-800 text-amber-400 font-bold px-2.5 py-1 rounded-lg hover:bg-neutral-700"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Version and Footer */}
      <div className="text-center pt-2 pb-4 space-y-1 text-neutral-500 text-[11px]">
        <div>Vicinio Local Marketplace • Version 1.0.4 (Android Release)</div>
        <div>Compliant with Android 14 Granular Permissions & Zero-Leak Contact</div>
      </div>
    </div>
  );
};
