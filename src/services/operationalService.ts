import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  DeliveryZone,
  DeliveryAddressValidation,
  HoursOperation,
  HolidayHours,
  RestaurantStatus
} from '../types/operational.types';

const HOURS_COLLECTION = 'hours_of_operation';
const HOLIDAY_COLLECTION = 'holiday_hours';
const DELIVERY_ZONES_COLLECTION = 'delivery_zones';

const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'default-gulgasht',
    name: 'Gulgasht Zone',
    areas: ['Gulgasht Colony', 'Gulgasht A Block', 'Gulgasht B Block', 'Bosan Road'],
    deliveryFee: 99,
    minimumOrder: 499,
    freeDeliveryThreshold: 1500,
    estimatedTime: '25-35 min',
    isActive: true
  },
  {
    id: 'default-cantt',
    name: 'Cantt Zone',
    areas: ['Cantt', 'Askari', 'Mall Road', 'Shah Rukn-e-Alam'],
    deliveryFee: 129,
    minimumOrder: 699,
    freeDeliveryThreshold: 1800,
    estimatedTime: '30-45 min',
    isActive: true
  },
  {
    id: 'default-city',
    name: 'City Zone',
    areas: ['New Multan', 'Model Town', 'Nishtar Road', 'Chungi No 6', 'Chungi No 9'],
    deliveryFee: 149,
    minimumOrder: 799,
    freeDeliveryThreshold: 2200,
    estimatedTime: '35-50 min',
    isActive: true
  }
];

const DEFAULT_HOURS: HoursOperation[] = [
  { id: 'sun', dayOfWeek: 0, dayName: 'Sunday', isOpen: true, openTime: '12:00', closeTime: '23:00' },
  { id: 'mon', dayOfWeek: 1, dayName: 'Monday', isOpen: true, openTime: '12:00', closeTime: '23:00' },
  { id: 'tue', dayOfWeek: 2, dayName: 'Tuesday', isOpen: true, openTime: '12:00', closeTime: '23:00' },
  { id: 'wed', dayOfWeek: 3, dayName: 'Wednesday', isOpen: true, openTime: '12:00', closeTime: '23:00' },
  { id: 'thu', dayOfWeek: 4, dayName: 'Thursday', isOpen: true, openTime: '12:00', closeTime: '23:00' },
  { id: 'fri', dayOfWeek: 5, dayName: 'Friday', isOpen: true, openTime: '12:00', closeTime: '23:30' },
  { id: 'sat', dayOfWeek: 6, dayName: 'Saturday', isOpen: true, openTime: '12:00', closeTime: '23:30' }
];

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const mapHoliday = (id: string, data: any): HolidayHours => ({
  id,
  date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
  isOpen: !!data.isOpen,
  openTime: data.openTime,
  closeTime: data.closeTime,
  reason: data.reason || ''
});

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const getHoursOfOperation = async (): Promise<HoursOperation[]> => {
  try {
    const q = query(collection(db, HOURS_COLLECTION), orderBy('dayOfWeek', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return DEFAULT_HOURS;
    }

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data()
    })) as HoursOperation[];
  } catch (error) {
    console.error('Error getting hours of operation:', error);
    return DEFAULT_HOURS;
  }
};

export const updateHours = async (id: string, updates: Partial<HoursOperation>): Promise<void> => {
  const ref = doc(db, HOURS_COLLECTION, id);
  await updateDoc(ref, updates);
};

export const getHolidayHours = async (): Promise<HolidayHours[]> => {
  try {
    const q = query(collection(db, HOLIDAY_COLLECTION), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapHoliday(d.id, d.data()));
  } catch (error) {
    console.error('Error getting holiday hours:', error);
    return [];
  }
};

export const addHolidayHours = async (holiday: Omit<HolidayHours, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, HOLIDAY_COLLECTION), {
    ...holiday,
    date: Timestamp.fromDate(holiday.date)
  });
  return docRef.id;
};

export const updateHolidayHours = async (
  id: string,
  updates: Partial<Omit<HolidayHours, 'id'>>
): Promise<void> => {
  const ref = doc(db, HOLIDAY_COLLECTION, id);
  const payload = {
    ...updates,
    ...(updates.date ? { date: Timestamp.fromDate(updates.date) } : {})
  };
  await updateDoc(ref, payload);
};

export const deleteHolidayHours = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, HOLIDAY_COLLECTION, id));
};

export const getDeliveryZones = async (): Promise<DeliveryZone[]> => {
  try {
    const snapshot = await getDocs(collection(db, DELIVERY_ZONES_COLLECTION));
    if (snapshot.empty) {
      return DEFAULT_DELIVERY_ZONES;
    }
    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }) as DeliveryZone)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting delivery zones:', error);
    return DEFAULT_DELIVERY_ZONES;
  }
};

export const validateDeliveryAddress = async (
  area: string,
  _city: string
): Promise<DeliveryAddressValidation> => {
  const normalizedArea = area.trim().toLowerCase();
  const zones = await getDeliveryZones();
  const zone = zones.find(
    (z) => z.isActive && z.areas.some((a) => a.trim().toLowerCase() === normalizedArea)
  );

  if (!zone) {
    return {
      isValid: false,
      message: 'Sorry, delivery is not available in this area yet.',
      deliveryFee: 0
    };
  }

  return {
    isValid: true,
    zone,
    message: `Delivery available in ${zone.name}.`,
    deliveryFee: zone.deliveryFee,
    estimatedTime: zone.estimatedTime,
    minimumOrder: zone.minimumOrder
  };
};

export const getRestaurantStatus = async (): Promise<RestaurantStatus> => {
  const now = new Date();
  const hours = await getHoursOfOperation();
  const holidays = await getHolidayHours();
  const todayHoliday = holidays.find((h) => isSameDay(h.date, now));

  if (todayHoliday) {
    if (!todayHoliday.isOpen) {
      return {
        isOpen: false,
        currentTime: now,
        message: todayHoliday.reason || 'Closed today',
        specialHours: todayHoliday
      };
    }

    const currentMins = now.getHours() * 60 + now.getMinutes();
    const openMins = toMinutes(todayHoliday.openTime || '00:00');
    const closeMins = toMinutes(todayHoliday.closeTime || '23:59');
    const isOpen = currentMins >= openMins && currentMins < closeMins;

    return {
      isOpen,
      currentTime: now,
      message: isOpen
        ? `Open until ${todayHoliday.closeTime}`
        : `Closed. Opens at ${todayHoliday.openTime}`,
      specialHours: todayHoliday,
      nextOpenTime: !isOpen && todayHoliday.openTime
        ? new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            Number(todayHoliday.openTime.split(':')[0]),
            Number(todayHoliday.openTime.split(':')[1])
          )
        : undefined
    };
  }

  const todayHours = hours.find((h) => h.dayOfWeek === now.getDay());
  if (!todayHours || !todayHours.isOpen) {
    return {
      isOpen: false,
      currentTime: now,
      message: 'Closed today',
      hoursToday: todayHours
    };
  }

  const currentMins = now.getHours() * 60 + now.getMinutes();
  const openMins = toMinutes(todayHours.openTime);
  const closeMins = toMinutes(todayHours.closeTime);
  const isOpen = currentMins >= openMins && currentMins < closeMins;

  return {
    isOpen,
    currentTime: now,
    hoursToday: todayHours,
    message: isOpen
      ? `Open until ${todayHours.closeTime}`
      : `Closed. Opens at ${todayHours.openTime}`,
    nextOpenTime: !isOpen
      ? new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          Number(todayHours.openTime.split(':')[0]),
          Number(todayHours.openTime.split(':')[1])
        )
      : undefined
  };
};

export const isOrderingEnabled = async (): Promise<boolean> => {
  const status = await getRestaurantStatus();
  return status.isOpen;
};

export type { DeliveryZone, DeliveryAddressValidation, HoursOperation, HolidayHours, RestaurantStatus };
