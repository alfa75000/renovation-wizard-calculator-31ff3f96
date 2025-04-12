
import { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectState } from '@/types';

/**
 * Utilitaire pour normaliser un objet avant de le convertir en JSON
 * Cela garantit que l'ordre des propriétés est constant
 */
const normalizeObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(normalizeObject);
  }
  
  // Trier les clés pour garantir un ordre constant
  const sortedKeys = Object.keys(obj).sort();
  const normalized: Record<string, any> = {};
  
  for (const key of sortedKeys) {
    normalized[key] = normalizeObject(obj[key]);
  }
  
  return normalized;
};

/**
 * Hook pour gérer les avertissements de modifications non sauvegardées
 */
export const useSaveLoadWarning = (state: ProjectState) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  // Variable pour suivre si nous avons forcé hasUnsavedChanges à false
  const forcingNoChanges = useRef<boolean>(false);
  
  // Mettre à jour l'état sauvegardé lors d'une sauvegarde
  const updateSavedState = useCallback(() => {
    // Normaliser l'état pour garantir un ordre constant des propriétés
    const normalizedState = normalizeObject(state);
    const stateSnapshot = JSON.stringify(normalizedState);
    setLastSavedState(stateSnapshot);
    setHasUnsavedChanges(false);
    console.log('[useSaveLoadWarning] État sauvegardé mis à jour');
  }, [state]);

  // Réinitialiser l'état sauvegardé (par exemple lors de la création d'un nouveau projet)
  const resetSavedState = useCallback((initialState: ProjectState) => {
    // Normaliser l'état initial pour garantir un ordre constant des propriétés
    const normalizedState = normalizeObject(initialState);
    const stateSnapshot = JSON.stringify(normalizedState);
    setLastSavedState(stateSnapshot);
    setHasUnsavedChanges(false);
    console.log('[useSaveLoadWarning] État sauvegardé réinitialisé');
  }, []);

  // Nouvelle fonction pour forcer hasUnsavedChanges à false quand nécessaire
  const forceNoUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false);
    // Mettre à jour l'état sauvegardé pour correspondre à l'état actuel
    const normalizedState = normalizeObject(state);
    const stateSnapshot = JSON.stringify(normalizedState);
    setLastSavedState(stateSnapshot);
    
    // Marquer que nous forçons l'état à "non modifié"
    forcingNoChanges.current = true;
    
    // Réinitialiser le flag après un court délai
    setTimeout(() => {
      forcingNoChanges.current = false;
    }, 500);
    
    console.log('[useSaveLoadWarning] Force hasUnsavedChanges à false et mise à jour du lastSavedState');
  }, [state]);

  // Détecter les changements non sauvegardés en comparant tout l'état
  useEffect(() => {
    // Ignorer les vérifications de changement si nous forçons l'état à "non modifié"
    if (forcingNoChanges.current) {
      console.log('[useSaveLoadWarning] Vérification ignorée car forceNoUnsavedChanges actif');
      return;
    }
    
    if (lastSavedState) {
      // Normaliser l'état actuel avant la comparaison
      const normalizedState = normalizeObject(state);
      const currentStateSnapshot = JSON.stringify(normalizedState);
      const hasChanges = currentStateSnapshot !== lastSavedState;
      
      if (hasChanges !== hasUnsavedChanges) {
        console.log(`[useSaveLoadWarning] Changement d'état détecté: ${hasChanges ? 'Modifications non sauvegardées' : 'Pas de modifications'}`);
        console.log(`[useSaveLoadWarning] État actuel (${currentStateSnapshot.length} chars) vs sauvegardé (${lastSavedState.length} chars)`);
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
    resetSavedState,
    forceNoUnsavedChanges
  };
};
