
import { Travail } from '@/types';

export const TABLE_COLUMN_WIDTHS = {
  DETAILS: ['*', 50, 50, 30, 60],
  TOTALS: [50, 80]
};

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(value).replace(/\s/g, '\u00A0') + '€';
};

export const formatQuantity = (quantity: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(quantity).replace(/\s/g, '\u00A0');
};

export const formatMOFournitures = (travail: Travail): string => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = (totalHT * travail.tauxTVA) / 100;
  
  return `[ MO: ${formatPrice(travail.prixMainOeuvre)}/u ] [ Fourn: ${formatPrice(travail.prixFournitures)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formatPrice(montantTVA)} ]`;
};
