export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface LocationError {
  code: number;
  message: string;
}

/**
 * Get user's current location using browser geolocation API
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: -1,
        message: 'Geolocation is not supported by this browser.'
      } as LocationError);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        try {
          // Get address from coordinates using reverse geocoding
          const address = await reverseGeocode(location.latitude, location.longitude);
          location.address = address;
        } catch (error) {
          console.warn('Failed to get address from coordinates:', error);
        }

        resolve(location);
      },
      (error) => {
        let message = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }

        reject({
          code: error.code,
          message
        } as LocationError);
      },
      options
    );
  });
}

/**
 * Geocode an address to get coordinates
 */
export async function geocodeAddress(address: string): Promise<Location> {
  try {
    // Using a free geocoding service (Nominatim - OpenStreetMap)
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Address not found');
    }

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to find location for address: ${address}`);
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();
    return data.display_name || `${latitude}, ${longitude}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude}, ${longitude}`;
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export default {
  getCurrentLocation,
  geocodeAddress,
  reverseGeocode,
  calculateDistance,
  formatDistance
};