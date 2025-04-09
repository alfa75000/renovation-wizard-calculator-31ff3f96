
import { useState, useEffect } from 'react';

/**
 * @deprecated Ce hook est déprécié et ne devrait plus être utilisé.
 * Utilisez directement les services Supabase pour la synchronisation et la persistance des données.
 */
export function useLocalStorageSync<T>(
  key: string,
  initialState: T,
  options: {
    syncOnMount?: boolean;
    autoSave?: boolean;
    debounce?: number;
  } = {}
): [T, (value: T | ((prevState: T) => T)) => void, () => void, () => void] {
  console.warn(
    `[DEPRECATED] useLocalStorageSync est déprécié et ne devrait plus être utilisé. 
     Clé: ${key}. 
     Utilisez le contexte ProjectContext qui gère la persistance avec Supabase.`
  );
  
  // Options par défaut
  const { syncOnMount = true, autoSave = true, debounce = 500 } = options;
  
  // État local
  const [state, setState] = useState<T>(initialState);
  // État pour suivre si le chargement initial a été effectué
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Charger les données depuis localStorage
  const loadFromStorage = () => {
    try {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        const parsedValue = JSON.parse(savedValue) as T;
        setState(parsedValue);
      }
      setInitialLoadDone(true);
    } catch (error) {
      console.error(`Erreur lors du chargement de ${key} depuis localStorage:`, error);
      setInitialLoadDone(true);
    }
  };
  
  // Sauvegarder les données dans localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key} dans localStorage:`, error);
    }
  };
  
  // Charger les données au montage si syncOnMount est true
  useEffect(() => {
    if (syncOnMount && !initialLoadDone) {
      loadFromStorage();
    }
  }, [syncOnMount, initialLoadDone]);
  
  // Sauvegarder les données quand l'état change si autoSave est true
  useEffect(() => {
    if (!initialLoadDone) return;
    
    if (autoSave) {
      const timer = setTimeout(() => {
        saveToStorage();
      }, debounce);
      
      return () => clearTimeout(timer);
    }
  }, [state, autoSave, initialLoadDone, debounce]);
  
  return [state, setState, saveToStorage, loadFromStorage];
}
