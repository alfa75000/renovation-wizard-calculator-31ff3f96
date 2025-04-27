// src/services/pdf/utils/formatUtils.ts

import { Travail } from '@/types';

/**
 * Formate un prix avec 2 décimales et le symbole €
 * @param value - Valeur numérique à formater
 * @returns Chaîne formatée
 */
export const formatPrice = (value: number): string => {
  // Gère les cas où value n'est pas un nombre
  if (typeof value !== 'number' || isNaN(value)) {
    return '0,00 €';
  }
  
  // Formater avec 2 décimales et remplacer le point par une virgule
  return `${value.toFixed(2).replace('.', ',')} €`;
};

/**
 * Formate une quantité
 * @param quantity - Quantité à formater
 * @returns Chaîne formatée
 */
export const formatQuantity = (quantity: number): string => {
  // Gère les cas où quantity n'est pas un nombre
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return '0';
  }
  
  // Si c'est un nombre entier, n'affiche pas les décimales
  if (Number.isInteger(quantity)) {
    return quantity.toString();
  }
  
  // Sinon, affiche jusqu'à 2 décimales (sans zéros inutiles)
  return quantity.toFixed(2).replace(/\.?0+$/, '');
};

/**
 * Formate les informations de main d'œuvre et fournitures
 * @param travail - Objet Travail contenant les données
 * @returns Chaîne formatée
 */
export const formatMOFournitures = (travail: Travail): string => {
  const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
  const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
  
  return `MO: ${formatPrice(mo)} | Fourn: ${formatPrice(fourn)}`;
};
