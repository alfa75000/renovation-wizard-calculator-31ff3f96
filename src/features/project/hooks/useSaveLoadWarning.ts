
import { useState, useEffect } from 'react';
import { ProjectState } from '@/types';

/**
 * Hook pour gérer les avertissements de modifications non sauvegardées
 */
export const useSaveLoadWarning = (state: ProjectState) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');

  // Mettre à jour l'état sauvegardé lors d'une sauvegarde
  const updateSavedState = () => {
    const stateSnapshot = JSON.stringify(state);
    setLastSavedState(stateSnapshot);
    setHasUnsavedChanges(false);
    console.log('[useSaveLoadWarning] État sauvegardé mis à jour');
  };

  // Réinitialiser l'état sauvegardé (par exemple lors de la création d'un nouveau projet)
  const resetSavedState = (initialState: ProjectState) => {
    const stateSnapshot = JSON.stringify(initialState);
    setLastSavedState(stateSnapshot);
    setHasUnsavedChanges(false);
    console.log('[useSaveLoadWarning] État sauvegardé réinitialisé');
  };

  // Détecter les changements non sauvegardés en comparant tout l'état
  useEffect(() => {
    if (lastSavedState) {
      const currentStateSnapshot = JSON.stringify(state);
      const hasChanges = currentStateSnapshot !== lastSavedState;
      
      if (hasChanges !== hasUnsavedChanges) {
        console.log(`[useSaveLoadWarning] Changement d'état détecté: ${hasChanges ? 'Modifications non sauvegardées' : 'Pas de modifications'}`);
        setHasUnsavedChanges(hasChanges);
      }
    }
  }, [state, lastSavedState, hasUnsavedChanges]);

  // Avertissement avant de quitter la page avec des modifications non sauvegardées
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Message d'avertissement standard pour tous les navigateurs
        const message = 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page?';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    updateSavedState,
    resetSavedState
  };
};
