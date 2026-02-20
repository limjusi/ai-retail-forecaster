import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateFormat('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'electronics': 'electronics',
    'mobile': 'electronics',
    'computers': 'electronics',
    'gadgets': 'electronics',
    'fashion': 'fashion',
    'clothing': 'fashion',
    'apparel': 'fashion',
    'shoes': 'fashion',
    'beauty': 'beauty',
    'cosmetics': 'beauty',
    'skincare': 'beauty',
    'makeup': 'beauty',
    'home': 'home-living',
    'furniture': 'home-living',
    'decor': 'home-living',
    'toys': 'toys',
    'games': 'toys',
    'food': 'groceries',
    'groceries': 'groceries',
    'sports': 'sports',
    'fitness': 'sports',
    'books': 'books',
    'health': 'health',
    'wellness': 'health',
    'baby': 'baby',
    'automotive': 'automotive',
    'pets': 'pets',
  };

  const normalized = category.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  return 'other';
}
