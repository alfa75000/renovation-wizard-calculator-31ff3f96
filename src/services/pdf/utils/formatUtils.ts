// src/services/pdf/utils/formatUtils.ts

import { Travail } from '@/types'; // Assure-toi que ce chemin est correct

/**
 * Formate un prix avec séparateur de milliers français et 2 décimales
 * @param value - Valeur numérique à formater
 * @returns Chaîne formatée (ex: "1 588,02 €")
 */
export const formatPrice = (value: number | null | undefined): string => { 
  const numValue = Number(value); 
  if (isNaN(numValue)) {
    return '0,00 €'; 
  }
  // Utilise toLocaleString avec les bonnes options pour le format français
  return numValue.toLocaleString('fr-FR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: true // Active le séparateur de milliers
  }) + ' €'; 
}; 

/**
 * Formate une quantité (pourrait utiliser toLocaleString aussi si besoin de séparateurs)
 * @param quantity - Quantité à formater
 * @returns Chaîne formatée
 */
export const formatQuantity = (quantity: number | null | undefined): string => { 
  const numValue = Number(quantity);
  if (isNaN(numValue)) {
    return '0';
  }
  // Pour l'instant, formatage simple. Décommente si tu veux des séparateurs/décimales.
  // return numValue.toLocaleString('fr-FR', { maximumFractionDigits: 2, useGrouping: true });
  return `${numValue}`; 
}; 

/**
 * Formate les informations de main d'œuvre et fournitures + TVA
 * @param travail - Objet Travail contenant les données
 * @returns Chaîne formatée
 */
export const formatMOFournitures = (travail: Travail): string => { 
    if (!travail) return '';
    const qte = typeof travail.quantite === 'number' ? travail.quantite : 0;
    const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
    const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
    const tvaRate = typeof travail.tauxTVA === 'number' ? travail.tauxTVA : 0;
    const prixUnitaireHT = fourn + mo;
    const totalHTLigne = prixUnitaireHT * qte;
    const montantTVALigne = (totalHTLigne * tvaRate) / 100;
    const moFormatted = formatPrice(mo); // Utilise la nouvelle formatPrice
    const fournFormatted = formatPrice(fourn); // Utilise la nouvelle formatPrice
    const tvaAmountFormatted = formatPrice(montantTVALigne); // Utilise la nouvelle formatPrice
    // Retourne le format demandé
    return `[ MO: ${moFormatted}/u ]  [ Fourn: ${fournFormatted}/u ]  [ Total TVA (${tvaRate}%) : ${tvaAmountFormatted} ]`; 
};
