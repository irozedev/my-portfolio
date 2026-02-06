export interface WorkingHours {
  day: string;
  hours: string;
  available: boolean;
}

export interface AvailabilityConfig {
  status: 'available' | 'limited' | 'busy';
  timezone: string;
  regularHours: WorkingHours[];
  specialNotice?: {
    message: string;
    until: string;
  };
}

// Days of the week translations
export const dayTranslations = {
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  uk: ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'],
  nl: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
};

export const availabilityConfig: AvailabilityConfig = {
  status: 'limited',
  timezone: 'CET (UTC+1)',
  regularHours: [
    { day: 'Monday', hours: '09:00 - 12:00', available: true },
    { day: 'Tuesday', hours: '09:00 - 12:00', available: true },
    { day: 'Wednesday', hours: '09:00 - 12:00', available: true },
    { day: 'Thursday', hours: '09:00 - 12:00', available: true },
    { day: 'Friday', hours: '09:00 - 12:00', available: true },
    { day: 'Saturday', hours: 'Off', available: false },
    { day: 'Sunday', hours: 'Off', available: false },
  ],
  specialNotice: {
    message: 'Currently working on learning projects',
    until: 'Mar 1, 2026'
  }
};

// Helper to get current availability status
export const getCurrentAvailability = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check if it's weekend
  if (currentDay === 0 || currentDay === 6) {
    return { available: false, message: 'Weekend - Limited availability' };
  }
  
  // Check working hours (09:00 - 12:00 CET)
  if (currentHour >= 9 && currentHour < 12) {
    return { available: true, message: 'Available now' };
  } else {
    return { available: false, message: 'Outside working hours' };
  }
};