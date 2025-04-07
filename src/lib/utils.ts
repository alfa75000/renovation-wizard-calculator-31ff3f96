
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formater un prix en euros avec le format français
 */
export function formaterPrix(prix: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(prix);
}

/**
 * Formater une quantité avec deux décimales
 */
export function formaterQuantite(quantite: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(quantite);
}

/**
 * Arrondir un nombre à 2 décimales
 */
export function arrondir2Decimales(nombre: number): number {
  return Math.round(nombre * 100) / 100;
}

/**
 * Convertir une chaîne en nombre, avec une valeur par défaut en cas d'échec
 */
export function parseFloatSafe(value: string | number | undefined | null, defaultValue: number = 0): number {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'number') return value;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}
