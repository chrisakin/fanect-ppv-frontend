import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timeStr: string) {
  // timeStr is like "12:45"
  const [hour, minute] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

 export function formatInputDate(date: Date){
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