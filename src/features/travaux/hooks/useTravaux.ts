
import { useCallback, useContext, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { v4 as uuidv4 } from 'uuid';
import { Travail } from '@/types';

// Nous définissons un type pour représenter l'état des travaux dans le context
interface TravauxState {
  travaux: Travail[];
  travailAModifier: string | null;
}

// Les types d'actions ajoutés au contexte ProjectContext
interface AddTravailAction {
  type: 'ADD_TRAVAIL';
  payload: Travail;
}

interface UpdateTravailAction {
  type: 'UPDATE_TRAVAIL';
  payload: Travail;
}

interface DeleteTravailAction {
  type: 'DELETE_TRAVAIL';
  payload: string;
}

// On augmente ProjectContext avec ces nouvelles actions
declare module '@/contexts/ProjectContext' {
  interface ProjectState {
    travaux: Travail[];
  }
  
  type ProjectAction = ProjectAction | AddTravailAction | UpdateTravailAction | DeleteTravailAction;
}

// Nous créons un état local pour gérer l'édition des travaux
export const useTravaux = () => {
  const { state, dispatch } = useProject();
  const [travailAModifier, setTravailAModifierState] = useState<string | null>(null);
  
  // Récupérer un travail par son ID
  const getTravailById = useCallback((id: string): Travail | undefined => {
    if (!state.travaux) return undefined;
    return state.travaux.find(t => t.id === id);
  }, [state.travaux]);

  // Définir un travail à modifier
  const setTravailAModifier = useCallback((id: string | null) => {
    setTravailAModifierState(id);
  }, []);
  
  // Réinitialiser le travail à modifier
  const resetTravailAModifier = useCallback(() => {
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
    if (travailAModifier) {
      const existingTravail = getTravailById(travailAModifier);
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
  }, [dispatch, travailAModifier, getTravailById, updateTravail]);

  // Supprimer un travail
  const deleteTravail = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
    });
    
    // Si on supprime le travail en cours d'édition
    if (travailAModifier === id) {
      setTravailAModifierState(null);
    }
  }, [dispatch, travailAModifier]);

  // Obtenir tous les travaux pour une pièce
  const getTravauxForPiece = useCallback((pieceId: string): Travail[] => {
    if (!state.travaux) return [];
    return state.travaux.filter(t => t.pieceId === pieceId);
  }, [state.travaux]);

  // Obtenir les détails du travail en cours d'édition
  const getTravailAModifier = useCallback((): Travail | null => {
    if (!travailAModifier) return null;
    const travail = getTravailById(travailAModifier);
    return travail || null;
  }, [travailAModifier, getTravailById]);

  return {
    travailAModifier: getTravailAModifier(),
    addTravail,
    updateTravail,
    deleteTravail,
    getTravauxForPiece,
    setTravailAModifier,
    resetTravailAModifier
  };
};
