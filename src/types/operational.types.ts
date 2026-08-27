export interface DeliveryZone {
  id: string;
  name: string; // e.g., "Gulgasht Colony"
  areas: string[]; // Specific areas within zone
  deliveryFee: number;
  minimumOrder: number;
  freeDeliveryThreshold?: number; // Order value for free delivery
  estimatedTime: string; // e.g., "30-45 min"
  isActive: boolean;
  coordinates?: {
    // For potential Google Maps integration
    center: { lat: number; lng: number };
    radius: number; // in km
  };
}

export interface DeliveryAddressValidation {
  isValid: boolean;
  zone?: DeliveryZone;
  message: string;
  deliveryFee: number;
  estimatedTime?: string;
  minimumOrder?: number;
}

export interface HoursOperation {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  isOpen: boolean;
  openTime: string; // "11:00"
  closeTime: string; // "23:00"
  breakStart?: string; // For restaurants that close between lunch and dinner
  breakEnd?: string;
  specialDate?: Date; // For holidays/special hours
  note?: string;
}

export interface HolidayHours {
  id: string;
  date: Date;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  reason: string; // "Eid Holiday", "New Year", etc.
}

export interface RestaurantStatus {
  isOpen: boolean;
  currentTime: Date;
  nextOpenTime?: Date;
  message: string;
  hoursToday?: HoursOperation;
  specialHours?: HolidayHours;
}