
import { useState, useEffect } from 'react';
import { ProjectState } from '@/types';

/**
 * Hook pour gérer les avertissements de modifications non sauvegardées
 * avec logique simplifiée et comparaison plus robuste
 */
export const useSaveLoadWarning = (state: ProjectState) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(false);

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

  // Version simplifiée de la détection des changements
  // Moins sensible aux différences mineures de formatage JSON
  const compareStates = (stateA: string, stateB: string): boolean => {
    if (!stateA || !stateB) return false;
    
    try {
      // Parsing + re-stringify pour normaliser la structure JSON
      const parsedA = JSON.parse(stateA);
      const parsedB = JSON.parse(stateB);
      
      // Comparaison des propriétés essentielles plutôt que des objets entiers
      const keysToCompare = ['property', 'rooms', 'travaux', 'metadata'];
      
      for (const key of keysToCompare) {
        const stringA = JSON.stringify(parsedA[key]);
        const stringB = JSON.stringify(parsedB[key]);
        
        if (stringA !== stringB) {
          return true; // Il y a une différence
        }
      }
      return false; // Pas de différence significative
    } catch (e) {
      console.error('[useSaveLoadWarning] Erreur lors de la comparaison des états:', e);
      return false;
    }
  };

  // Détecter les changements non sauvegardés avec la nouvelle méthode de comparaison
  useEffect(() => {
    // Ne pas mettre à jour l'état pendant le chargement d'un projet
    if (isLoadingProject) {
      console.log('[useSaveLoadWarning] Ignoré la détection de changements pendant le chargement');
      return;
    }
    
    // Protection contre le premier rendu ou l'absence d'état sauvegardé
    if (!lastSavedState) {
      // Si nous avons un état mais pas d'état sauvegardé, ne pas marquer comme non sauvegardé
      setHasUnsavedChanges(false);
      return;
    }
    
    const currentStateSnapshot = JSON.stringify(state);
    const hasChanges = compareStates(currentStateSnapshot, lastSavedState);
    
    if (hasChanges !== hasUnsavedChanges) {
      console.log(`[useSaveLoadWarning] Changement d'état détecté: ${hasChanges ? 'Modifications non sauvegardées' : 'Pas de modifications'}`);
      setHasUnsavedChanges(hasChanges);
    }
  }, [state, lastSavedState, hasUnsavedChanges, isLoadingProject]);

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
    resetSavedState,
    setIsLoadingProject
  };
};
