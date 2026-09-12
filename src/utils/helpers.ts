/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

/**
 * Formats distance for clean UI display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Currency formatter (₹ / INR standard for Indian / Asian local markets)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Mask phone numbers to preserve privacy (Anti-leak)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 7) return '+91 98••• ••000';
  const clean = phone.trim();
  return clean.replace(/(\+?\d{2})?(\d{2})\d+(\d{3})$/, '$1 $2••• ••$3');
}

/**
 * Generate simulated cryptographic payment order token
 */
export function generatePaymentSignature(orderId: string, amount: number): string {
  const timestamp = Date.now();
  const raw = `${orderId}_${amount}_${timestamp}_vicinio_secret`;
  // Simple deterministic hash simulation
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `rzp_sig_${Math.abs(hash).toString(16).padStart(12, '0')}`;
}

/**
 * Estimate travel time in minutes based on distance
 */
export function estimateTravelTime(km: number, mode: 'walking' | 'bike' = 'bike'): number {
  const speed = mode === 'bike' ? 20 : 4.5; // km/h
  const timeHours = km / speed;
  const minutes = Math.ceil(timeHours * 60) + 10; // +10 mins prep time
  return Math.max(12, Math.min(60, minutes));
}
