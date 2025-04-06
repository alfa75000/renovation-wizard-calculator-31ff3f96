
import { useCallback, useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { v4 as uuidv4 } from 'uuid';
import { Travail } from '@/types';

// Hook pour gérer les travaux
export const useTravaux = () => {
  const { state, dispatch } = useProject();
  const [travailAModifierState, setTravailAModifierState] = useState<string | null>(null);
  
  // Récupérer un travail par son ID
  const getTravailById = useCallback((id: string): Travail | undefined => {
    return state.travaux.find(t => t.id === id);
  }, [state.travaux]);

  // Définir un travail à modifier
  const setTravailAModifier = useCallback((id: string | null) => {
    console.log("Setting travail à modifier ID:", id);
    setTravailAModifierState(id);
  }, []);
  
  // Réinitialiser le travail à modifier
  const resetTravailAModifier = useCallback(() => {
    console.log("Resetting travail à modifier");
    setTravailAModifierState(null);
  }, []);

  // Mettre à jour un travail existant
  const updateTravail = useCallback((travail: Travail) => {
    dispatch({
      type: 'UPDATE_TRAVAIL',
      payload: travail
    });
    setTravailAModifierState(null);
  }, [dispatch]);

  // Ajouter un nouveau travail
  const addTravail = useCallback((travailData: Omit<Travail, 'id'>) => {
    // Si on est en train de modifier, on met à jour plutôt que d'ajouter
    if (travailAModifierState) {
      const existingTravail = getTravailById(travailAModifierState);
      if (existingTravail) {
        updateTravail({
          ...existingTravail,
          ...travailData
        });
        return;
      }
    }

    // Sinon on ajoute un nouveau travail
    const travail: Travail = {
      id: uuidv4(),
      ...travailData
    };

    dispatch({
      type: 'ADD_TRAVAIL',
      payload: travail
    });
    
    // Réinitialiser les champs après ajout
    resetTravailAModifier();
  }, [dispatch, travailAModifierState, getTravailById, updateTravail, resetTravailAModifier]);

  // Supprimer un travail
  const deleteTravail = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
    });
    
    // Si on supprime le travail en cours d'édition
    if (travailAModifierState === id) {
      setTravailAModifierState(null);
    }
  }, [dispatch, travailAModifierState]);

  // Obtenir tous les travaux pour une pièce
  const getTravauxForPiece = useCallback((pieceId: string): Travail[] => {
    return state.travaux.filter(t => t.pieceId === pieceId);
  }, [state.travaux]);

  // Obtenir les détails du travail en cours d'édition
  const getTravailAModifier = useCallback((): Travail | null => {
    if (!travailAModifierState) return null;
    const travail = getTravailById(travailAModifierState);
    return travail || null;
  }, [travailAModifierState, getTravailById]);

  return {
    travailAModifier: getTravailAModifier(),
    travailAModifierId: travailAModifierState,
    addTravail,
    updateTravail,
    deleteTravail,
    getTravauxForPiece,
    setTravailAModifier,
    resetTravailAModifier
  };
};
