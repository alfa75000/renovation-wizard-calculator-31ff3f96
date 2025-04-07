
import { useState, useEffect } from 'react';

type StorageOptions = {
  syncOnMount?: boolean;
  autoSave?: boolean;
  debounce?: number;
};

/**
 * Hook personnalisé pour la synchronisation bidirectionnelle avec localStorage
 * @param key La clé pour stocker dans localStorage
 * @param initialState État initial si rien n'est trouvé dans localStorage
 * @param options Options de configuration
 * @returns [state, setState, saveToStorage, loadFromStorage]
 */
export function useLocalStorageSync<T>(
  key: string,
  initialState: T,
  options: StorageOptions = {}
): [T, (value: T | ((prevState: T) => T)) => void, () => void, () => void] {
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
