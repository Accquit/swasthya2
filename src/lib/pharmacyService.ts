import { calculateDistance, formatDistance } from './locationService';

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website?: string;
  rating: number;
  reviewCount?: number;
  isOpen: boolean;
  hours: {
    [key: string]: string; // day of week -> hours string
  };
  services: string[];
  distance?: number;
  distanceText?: string;
  priceLevel?: number; // 1-4 scale
  photos?: string[];
}

export interface PharmacySearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers, default 10
  query?: string;
  limit?: number; // default 20
}

export interface PharmacySearchResult {
  pharmacies: Pharmacy[];
  totalCount: number;
  searchLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

// Sample pharmacy data - In production, this would come from a real API
const samplePharmacies: Pharmacy[] = [
  {
    id: 'apollo-mg-road',
    name: 'Apollo Pharmacy',
    address: '123 MG Road, Mumbai, Maharashtra 400001',
    latitude: 19.0760,
    longitude: 72.8777,
    phone: '+91 98765 43210',
    website: 'https://www.apollopharmacy.in',
    rating: 4.5,
    reviewCount: 1250,
    isOpen: true,
    hours: {
      'Monday': '24 hours',
      'Tuesday': '24 hours',
      'Wednesday': '24 hours',
      'Thursday': '24 hours',
      'Friday': '24 hours',
      'Saturday': '24 hours',
      'Sunday': '24 hours'
    },
    services: ['Home Delivery', 'Online Orders', 'Prescription Refill', 'Health Checkup'],
    priceLevel: 2
  },
  {
    id: 'medplus-park-street',
    name: 'MedPlus Health Services',
    address: '456 Park Street, Mumbai, Maharashtra 400002',
    latitude: 19.0825,
    longitude: 72.8811,
    phone: '+91 98765 43211',
    website: 'https://www.medplusmart.com',
    rating: 4.3,
    reviewCount: 890,
    isOpen: true,
    hours: {
      'Monday': '8:00 AM - 10:00 PM',
      'Tuesday': '8:00 AM - 10:00 PM',
      'Wednesday': '8:00 AM - 10:00 PM',
      'Thursday': '8:00 AM - 10:00 PM',
      'Friday': '8:00 AM - 10:00 PM',
      'Saturday': '8:00 AM - 10:00 PM',
      'Sunday': '9:00 AM - 9:00 PM'
    },
    services: ['Home Delivery', 'Health Checkup', 'Insurance Accepted', 'Digital Prescription'],
    priceLevel: 2
  },
  {
    id: 'wellness-forever-linking',
    name: 'Wellness Forever',
    address: '789 Linking Road, Mumbai, Maharashtra 400003',
    latitude: 19.0544,
    longitude: 72.8369,
    phone: '+91 98765 43212',
    website: 'https://www.wellnessforever.com',
    rating: 4.2,
    reviewCount: 567,
    isOpen: false,
    hours: {
      'Monday': '9:00 AM - 9:00 PM',
      'Tuesday': '9:00 AM - 9:00 PM',
      'Wednesday': '9:00 AM - 9:00 PM',
      'Thursday': '9:00 AM - 9:00 PM',
      'Friday': '9:00 AM - 9:00 PM',
      'Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '10:00 AM - 8:00 PM'
    },
    services: ['Online Orders', 'Beauty Products', 'Health Supplements', 'Ayurvedic Medicines'],
    priceLevel: 1
  },
  {
    id: 'guardian-bkc',
    name: 'Guardian Pharmacy',
    address: '101 Bandra Kurla Complex, Mumbai, Maharashtra 400004',
    latitude: 19.0728,
    longitude: 72.8826,
    phone: '+91 98765 43213',
    rating: 4.6,
    reviewCount: 1456,
    isOpen: true,
    hours: {
      'Monday': '7:00 AM - 11:00 PM',
      'Tuesday': '7:00 AM - 11:00 PM',
      'Wednesday': '7:00 AM - 11:00 PM',
      'Thursday': '7:00 AM - 11:00 PM',
      'Friday': '7:00 AM - 11:00 PM',
      'Saturday': '7:00 AM - 11:00 PM',
      'Sunday': '8:00 AM - 10:00 PM'
    },
    services: ['Home Delivery', 'Digital Prescription', 'Senior Discounts', 'Emergency Services'],
    priceLevel: 3
  },
  {
    id: 'netmeds-andheri',
    name: 'Netmeds Pharmacy',
    address: '234 Andheri East, Mumbai, Maharashtra 400069',
    latitude: 19.1136,
    longitude: 72.8697,
    phone: '+91 98765 43214',
    website: 'https://www.netmeds.com',
    rating: 4.4,
    reviewCount: 2134,
    isOpen: true,
    hours: {
      'Monday': '8:00 AM - 10:00 PM',
      'Tuesday': '8:00 AM - 10:00 PM',
      'Wednesday': '8:00 AM - 10:00 PM',
      'Thursday': '8:00 AM - 10:00 PM',
      'Friday': '8:00 AM - 10:00 PM',
      'Saturday': '8:00 AM - 10:00 PM',
      'Sunday': '9:00 AM - 9:00 PM'
    },
    services: ['Home Delivery', 'Online Orders', 'Lab Tests', 'Subscription Refills'],
    priceLevel: 2
  },
  {
    id: 'dawai-dukan-bandra',
    name: 'Dawai Dukan',
    address: '567 Hill Road, Bandra West, Mumbai 400050',
    latitude: 19.0596,
    longitude: 72.8295,
    phone: '+91 98765 43215',
    rating: 4.1,
    reviewCount: 345,
    isOpen: true,
    hours: {
      'Monday': '9:00 AM - 11:00 PM',
      'Tuesday': '9:00 AM - 11:00 PM',
      'Wednesday': '9:00 AM - 11:00 PM',
      'Thursday': '9:00 AM - 11:00 PM',
      'Friday': '9:00 AM - 11:00 PM',
      'Saturday': '9:00 AM - 11:00 PM',
      'Sunday': '10:00 AM - 10:00 PM'
    },
    services: ['Home Delivery', 'Generic Medicines', 'Prescription Upload', 'Quick Delivery'],
    priceLevel: 1
  }
];

/**
 * Check if pharmacy is currently open based on current time
 */
function isPharmacyOpen(pharmacy: Pharmacy): boolean {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const todayHours = pharmacy.hours[currentDay];
  if (!todayHours) return false;

  if (todayHours.includes('24 hours')) return true;
  if (todayHours.toLowerCase().includes('closed')) return false;

  // Parse hours like "9:00 AM - 9:00 PM"
  const hoursMatch = todayHours.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)?/i);
  if (!hoursMatch) return false;

  const [, openTime, openPeriod, closeTime, closePeriod] = hoursMatch;
  
  // Convert to 24-hour format for comparison
  const parseTime = (time: string, period?: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period) {
      if (period.toUpperCase() === 'PM' && hours !== 12) hour24 += 12;
      if (period.toUpperCase() === 'AM' && hours === 12) hour24 = 0;
    }
    
    return hour24 * 100 + minutes; // HHMM format for easy comparison
  };

  const currentTimeNum = parseInt(currentTime.replace(':', ''));
  const openTimeNum = parseTime(openTime, openPeriod);
  const closeTimeNum = parseTime(closeTime, closePeriod);

  return currentTimeNum >= openTimeNum && currentTimeNum <= closeTimeNum;
}

/**
 * Search for pharmacies near a location
 */
export async function searchPharmacies(params: PharmacySearchParams): Promise<PharmacySearchResult> {
  const { latitude, longitude, radius = 10, query = '', limit = 20 } = params;

  try {
    // In production, this would be an API call to Google Places, Foursquare, or similar
    // For now, we'll use our sample data and filter/calculate distances
    
    let filteredPharmacies = samplePharmacies;

    // Filter by search query if provided
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredPharmacies = filteredPharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchTerm) ||
        pharmacy.address.toLowerCase().includes(searchTerm) ||
        pharmacy.services.some(service => service.toLowerCase().includes(searchTerm))
      );
    }

    // Calculate distances and filter by radius
    const pharmaciesWithDistance = filteredPharmacies
      .map(pharmacy => {
        const distance = calculateDistance(
          latitude, longitude,
          pharmacy.latitude, pharmacy.longitude
        );

        return {
          ...pharmacy,
          distance,
          distanceText: formatDistance(distance),
          isOpen: isPharmacyOpen(pharmacy)
        };
      })
      .filter(pharmacy => pharmacy.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return {
      pharmacies: pharmaciesWithDistance,
      totalCount: pharmaciesWithDistance.length,
      searchLocation: {
        latitude,
        longitude
      }
    };
  } catch (error) {
    console.error('Error searching pharmacies:', error);
    throw new Error('Failed to search pharmacies. Please try again.');
  }
}

/**
 * Get pharmacy details by ID
 */
export async function getPharmacyDetails(pharmacyId: string): Promise<Pharmacy | null> {
  const pharmacy = samplePharmacies.find(p => p.id === pharmacyId);
  if (!pharmacy) return null;

  return {
    ...pharmacy,
    isOpen: isPharmacyOpen(pharmacy)
  };
}

/**
 * Get popular pharmacy chains
 */
export function getPopularChains(): string[] {
  return [
    'Apollo Pharmacy',
    'MedPlus',
    'Wellness Forever',
    'Guardian Pharmacy',
    'Netmeds',
    '1mg',
    'PharmEasy',
    'Dawai Dukan'
  ];
}

/**
 * Generate directions URL for a pharmacy
 */
export function getDirectionsUrl(pharmacy: Pharmacy, userLocation?: { lat: number; lng: number }): string {
  const destination = `${pharmacy.latitude},${pharmacy.longitude}`;
  const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
  
  // Google Maps URL
  if (origin) {
    return `https://www.google.com/maps/dir/${origin}/${destination}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.address)}`;
  }
}

/**
 * Format phone number for calling
 */
export function formatPhoneForCalling(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Get today's hours for a pharmacy
 */
export function getTodayHours(pharmacy: Pharmacy): string {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return pharmacy.hours[today] || 'Hours not available';
}

export default {
  searchPharmacies,
  getPharmacyDetails,
  getPopularChains,
  getDirectionsUrl,
  formatPhoneForCalling,
  getTodayHours
};