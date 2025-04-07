
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction pour arrondir un nombre à 2 décimales
export function arrondir2Decimales(nombre: number): number {
  return Math.round(nombre * 100) / 100;
}

// Fonction pour formater un prix avec le symbole €
export function formaterPrix(prix: number): string {
  const prixArrondi = arrondir2Decimales(prix);
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(prixArrondi);
}

// Fonction pour formater une quantité
export function formaterQuantite(quantite: number): string {
  const quantiteArrondie = arrondir2Decimales(quantite);
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(quantiteArrondie);
}
