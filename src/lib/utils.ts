import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * lib/utils
 * Small UI and date/time helper utilities used across the app.
 * Exports:
 *  - cn(...): className merger using clsx + tailwind-merge
 *  - formatTime / convertTo24Hour / formatInputDate / createLocalDate: date/time helpers
 *  - formatCurrency: simple currency formatter
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timeStr: string) {
  // timeStr is like "12:45"
  if(timeStr) {
    // Handle both 24-hour format (HH:MM) and 12-hour format (H:MM AM/PM)
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      // Already in 12-hour format, return as-is
      return timeStr;
    }
    
    // Convert from 24-hour to 12-hour format
    const [hour, minute] = timeStr.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }
  return '';
}

 export function formatInputDate(date: Date | string){
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

export function formatCurrency(amount: number) {
  return amount
    .toFixed(2)                // always two decimals
    .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas
}

// Helper function to convert time from 12-hour to 24-hour format
export function convertTo24Hour(time12h: string): string {
  if (!time12h) return '';
  
  // If already in 24-hour format, return as-is
  if (!time12h.includes('AM') && !time12h.includes('PM')) {
    return time12h;
  }
  
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12h;
  
  let [, hours, minutes, period] = match;
  let hour24 = parseInt(hours);
  
  if (period.toUpperCase() === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
}

// Helper function to create a date in user's timezone
export function createLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  
  // If it's just a date string (YYYY-MM-DD), create it in local timezone
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Otherwise, parse normally
  return new Date(dateString);
}