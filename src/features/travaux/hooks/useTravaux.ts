
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProject } from '@/contexts/ProjectContext';
import { Travail } from '@/types';
import { parseStringToNumber } from '@/lib/utils';

export const useTravaux = () => {
  const { state, dispatch } = useProject();
  const { travaux } = state;

  // Ajouter un nouveau travail
  const addTravail = useCallback((travailData: Omit<Travail, 'id'>) => {
    const newTravail: Travail = {
      id: uuidv4(),
      ...travailData
    };
    
    dispatch({ type: 'ADD_TRAVAIL', payload: newTravail });
    return newTravail;
  }, [dispatch]);

  // Mettre à jour un travail existant
  const updateTravail = useCallback((travail: Travail) => {
    dispatch({ type: 'UPDATE_TRAVAIL', payload: travail });
  }, [dispatch]);

  // Supprimer un travail
  const deleteTravail = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRAVAIL', payload: id });
  }, [dispatch]);

  // Récupérer les travaux pour une pièce spécifique
  const getTravauxForPiece = useCallback((pieceId: string) => {
    return travaux.filter(travail => travail.pieceId === pieceId);
  }, [travaux]);

  // Calculer le total des travaux pour une pièce
  const calculateTotalForPiece = useCallback((pieceId: string) => {
    const piecesTravaux = getTravauxForPiece(pieceId);
    
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;
    
    piecesTravaux.forEach(travail => {
      const prixUnitaireHT = parseStringToNumber(travail.prixUnitaire);
      const quantite = parseStringToNumber(travail.quantite);
      const tauxTVA = parseStringToNumber(travail.tauxTVA);
      
      const montantHT = prixUnitaireHT * quantite;
      const montantTVA = montantHT * (tauxTVA / 100);
      
      totalHT += montantHT;
      totalTVA += montantTVA;
      totalTTC += montantHT + montantTVA;
    });
    
    return { totalHT, totalTVA, totalTTC };
  }, [getTravauxForPiece]);

  // Calculer le total global de tous les travaux
  const calculateGlobalTotal = useCallback(() => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;
    let totalFournitures = 0;
    let totalMainOeuvre = 0;
    
    travaux.forEach(travail => {
      const prixFournitures = parseStringToNumber(travail.prixFournitures);
      const prixMainOeuvre = parseStringToNumber(travail.prixMainOeuvre);
      const quantite = parseStringToNumber(travail.quantite);
      const tauxTVA = parseStringToNumber(travail.tauxTVA);
      
      const montantFournitures = prixFournitures * quantite;
      const montantMainOeuvre = prixMainOeuvre * quantite;
      const montantHT = montantFournitures + montantMainOeuvre;
      const montantTVA = montantHT * (tauxTVA / 100);
      
      totalFournitures += montantFournitures;
      totalMainOeuvre += montantMainOeuvre;
      totalHT += montantHT;
      totalTVA += montantTVA;
      totalTTC += montantHT + montantTVA;
    });
    
    return { totalHT, totalTVA, totalTTC, totalFournitures, totalMainOeuvre };
  }, [travaux]);

  return {
    travaux,
    addTravail,
    updateTravail,
    deleteTravail,
    getTravauxForPiece,
    calculateTotalForPiece,
    calculateGlobalTotal
  };
};
