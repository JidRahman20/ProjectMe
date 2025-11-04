import { GuestType, TimePeriod } from "../types";
import { menuByTimeAndGuest } from "../constants/menuData";

export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getAvailableMenu = (waktu: string, tamu: string): string[] => {
  if (!waktu || !tamu) return [];
  
  let period: TimePeriod = "Pagi";
  const waktuLower = waktu.toLowerCase();
  
  // Mapping waktu ke periode menu
  if (waktuLower.includes("sahur") || waktuLower.includes("pagi")) {
    period = "Pagi";
  } else if (waktuLower.includes("siang")) {
    period = "Siang";
  } else if (waktuLower.includes("sore") || waktuLower.includes("buka")) {
    period = "Sore";
  } else if (waktuLower.includes("malam") || waktuLower.includes("tengah")) {
    period = "Malam";
  }
  
  const guestType = tamu as GuestType;
  const timeMenu = menuByTimeAndGuest[period];
  
  if (!timeMenu) return [];
  
  return timeMenu[guestType] || [];
};

export const formatDate = (dateString: string): string => {
  return dateString.split("-").reverse().join("-");
};

export const generateOrderId = (): string => {
  return `ORD/${Date.now()}`;
};
