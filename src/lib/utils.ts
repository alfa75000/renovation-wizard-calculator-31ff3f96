
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
export function formaterPrix(prix: number | string): string {
  // Conversion en nombre si c'est une chaîne
  const prixNumber = typeof prix === 'string' ? parseFloat(prix) : prix;
  const prixArrondi = arrondir2Decimales(prixNumber);
  
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(prixArrondi);
}

// Fonction pour formater une quantité
export function formaterQuantite(quantite: number | string): string {
  // Conversion en nombre si c'est une chaîne
  const quantiteNumber = typeof quantite === 'string' ? parseFloat(quantite) : quantite;
  const quantiteArrondie = arrondir2Decimales(quantiteNumber);
  
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(quantiteArrondie);
}

// Convertir une chaîne en nombre en gérant les valeurs invalides
export function parseStringToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

// Convertir un nombre en chaîne avec 2 décimales
export function formatNumberToString(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

// Calculer la surface
export function calculerSurface(longueur: string | number, largeur: string | number): number {
  const l = parseStringToNumber(longueur);
  const w = parseStringToNumber(largeur);
  return arrondir2Decimales(l * w);
}

// Valider si une valeur est un nombre positif
export function estNombrePositif(valeur: string | number): boolean {
  const nombre = typeof valeur === 'string' ? parseFloat(valeur) : valeur;
  return !isNaN(nombre) && nombre >= 0;
}
