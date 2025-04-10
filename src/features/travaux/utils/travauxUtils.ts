
import { Travail } from "@/types";

/**
 * Filtre les travaux par pièce
 * @param travaux Liste complète des travaux
 * @param pieceId ID de la pièce pour laquelle filtrer les travaux
 * @returns Travaux filtrés pour la pièce spécifiée
 */
export const filtrerTravauxParPiece = (travaux: Travail[], pieceId: string): Travail[] => {
  return travaux.filter(travail => travail.pieceId === pieceId);
};

/**
 * Calcule le prix unitaire HT d'un travail
 * @param travail Le travail pour lequel calculer le prix unitaire
 * @returns Prix unitaire HT
 */
export const calculerPrixUnitaireHT = (travail: Travail): number => {
  return travail.prixFournitures + travail.prixMainOeuvre;
};

/**
 * Calcule le prix total HT d'un travail
 * @param travail Le travail pour lequel calculer le prix total
 * @returns Prix total HT
 */
export const calculerTotalHT = (travail: Travail): number => {
  const prixUnitaireHT = calculerPrixUnitaireHT(travail);
  return prixUnitaireHT * travail.quantite;
};

/**
 * Calcule le montant de TVA d'un travail
 * @param travail Le travail pour lequel calculer la TVA
 * @returns Montant de TVA
 */
export const calculerMontantTVA = (travail: Travail): number => {
  const totalHT = calculerTotalHT(travail);
  return totalHT * (travail.tauxTVA / 100);
};

/**
 * Calcule le prix total TTC d'un travail
 * @param travail Le travail pour lequel calculer le prix TTC
 * @returns Prix total TTC
 */
export const calculerTotalTTC = (travail: Travail): number => {
  const totalHT = calculerTotalHT(travail);
  const montantTVA = calculerMontantTVA(travail);
  return totalHT + montantTVA;
};

/**
 * Calcule le total HT pour une liste de travaux
 * @param travaux Liste des travaux
 * @returns Total HT de tous les travaux
 */
export const calculerTotalHTTravaux = (travaux: Travail[]): number => {
  return travaux.reduce((total, travail) => total + calculerTotalHT(travail), 0);
};

/**
 * Calcule le total TTC pour une liste de travaux
 * @param travaux Liste des travaux
 * @returns Total TTC de tous les travaux
 */
export const calculerTotalTTCTravaux = (travaux: Travail[]): number => {
  return travaux.reduce((total, travail) => total + calculerTotalTTC(travail), 0);
};

/**
 * Regroupe les travaux par leur taux de TVA
 * @param travaux Liste des travaux
 * @returns Objet avec les taux de TVA comme clés et les travaux correspondants comme valeurs
 */
export const grouperTravauxParTVA = (travaux: Travail[]): Record<number, Travail[]> => {
  return travaux.reduce((groups, travail) => {
    const tauxTVA = travail.tauxTVA;
    if (!groups[tauxTVA]) {
      groups[tauxTVA] = [];
    }
    groups[tauxTVA].push(travail);
    return groups;
  }, {} as Record<number, Travail[]>);
};
