
import { Travail } from '@/types';
import { formatPrice } from './pdfConstants';

/**
 * Formate les informations de main d'œuvre et fournitures pour un travail
 * @param travail - Objet travail à formater
 * @returns string - Chaîne formatée avec les informations de MO, fournitures et TVA
 */
export const formatMOFournitures = (travail: Travail): string => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = (totalHT * travail.tauxTVA) / 100;
  
  return `[ MO: ${formatPrice(travail.prixMainOeuvre)}/u ] [ Fourn: ${formatPrice(travail.prixFournitures)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formatPrice(montantTVA)} ]`;
};

/**
 * Convertit un objet de style en chaîne de style pour pdfmake
 * @param style - Objet contenant les propriétés de style
 * @returns string - Chaîne de style formatée
 */
export const formatStyle = (style: Record<string, any>): string => {
  return Object.entries(style)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ');
};
