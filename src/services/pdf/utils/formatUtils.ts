// src/services/pdf/utils/formatUtils.ts

import { Travail } from '@/types'; // Assure-toi que ce chemin est correct

/**
 * Formate un prix avec séparateur de milliers français (espace normal) et 2 décimales
 * @param value - Valeur numérique à formater
 * @returns Chaîne formatée (ex: "1 588,02 €")
 */
export const formatPrice = (value: number | null | undefined): string => { 
  const numValue = Number(value); 
  if (isNaN(numValue)) {
    return '0,00 €'; 
  }
  
  // Formate en utilisant les standards français (peut utiliser espace insécable)
  const formatted = numValue.toLocaleString('fr-FR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: true 
  });

  // *** AJOUT : Remplace l'espace insécable (code 160) par un espace normal (code 32) ***
  const spaceFixed = formatted.replace(/\s/g, ' '); 

  return spaceFixed + ' €'; 
}; 

/**
 * Formate une quantité 
 */
export const formatQuantity = (quantity: number | null | undefined): string => { 
  const numValue = Number(quantity);
  if (isNaN(numValue)) {
    return '0';
  }
  return `${numValue}`; 
}; 

/**
 * Formate les informations de main d'œuvre et fournitures + TVA
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
    // Utilise la fonction formatPrice mise à jour
    const moFormatted = formatPrice(mo); 
    const fournFormatted = formatPrice(fourn); 
    const tvaAmountFormatted = formatPrice(montantTVALigne); 
    return `[ MO: ${moFormatted}/u ]  [ Fourn: ${fournFormatted}/u ]  [ Total TVA (${tvaRate}%) : ${tvaAmountFormatted} ]`; 
};
