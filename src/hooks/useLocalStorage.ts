
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // État pour stocker notre valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Récupérer depuis localStorage
      const item = window.localStorage.getItem(key);
      console.log(`[useLocalStorage] Lecture initiale de ${key}:`, item ? 'données trouvées' : 'aucune donnée');
      
      // Analyser le JSON stocké ou retourner initialValue
      const parsedItem = item ? JSON.parse(item) : initialValue;
      
      // Vérifier que la valeur est valide (pour éviter les tableaux vides ou objets mal formés)
      if (Array.isArray(parsedItem) && parsedItem.length === 0 && Array.isArray(initialValue) && initialValue.length > 0) {
        console.log(`[useLocalStorage] Tableau vide détecté pour ${key}, utilisation de la valeur initiale`);
        return initialValue;
      }
      
      return parsedItem;
    } catch (error) {
      console.error(`[useLocalStorage] Erreur lors de la récupération de ${key} dans localStorage:`, error);
      // Sauvegarder initialValue pour la prochaine fois
      if (initialValue) {
        try {
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          console.log(`[useLocalStorage] Valeur initiale sauvegardée pour ${key} après erreur`);
        } catch (e) {
          console.error(`[useLocalStorage] Impossible de sauvegarder la valeur initiale pour ${key}:`, e);
        }
      }
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur dans le state et localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Déterminer si c'est une fonction ou une valeur directe
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Vérification des données avant sauvegarde
      if (valueToStore === undefined || valueToStore === null) {
        console.warn(`[useLocalStorage] Tentative de sauvegarder une valeur ${valueToStore} pour ${key}`);
        return;
      }
      
      // Sauvegarder dans l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        try {
          const jsonValue = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, jsonValue);
          console.log(`[useLocalStorage] Sauvegarde dans localStorage - ${key} (${jsonValue.length} caractères)`);
          
          // Vérification immédiate que la sauvegarde a fonctionné
          const savedValue = window.localStorage.getItem(key);
          if (!savedValue) {
            console.error(`[useLocalStorage] Échec de vérification pour ${key} - données non trouvées après sauvegarde`);
          }
        } catch (e) {
          console.error(`[useLocalStorage] Erreur lors de la sauvegarde dans localStorage pour ${key}:`, e);
          
          // Si l'erreur est due à un quota dépassé, essayer de libérer de l'espace
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            console.warn('[useLocalStorage] Quota localStorage dépassé, tentative de libérer de l\'espace...');
            // Supprimer des éléments moins importants si nécessaire
          }
        }
      }
    } catch (error) {
      console.error(`[useLocalStorage] Erreur générale lors de la sauvegarde de ${key}:`, error);
    }
  };
  
  // Écouter les changements de localStorage sur d'autres onglets/fenêtres
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          console.log(`[useLocalStorage] Storage event détecté pour ${key}`);
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`[useLocalStorage] Erreur lors du parsing de la nouvelle valeur pour ${key}:`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier que la valeur est correctement enregistrée au montage
    const savedItem = window.localStorage.getItem(key);
    if (!savedItem && JSON.stringify(storedValue) !== JSON.stringify(initialValue)) {
      console.log(`[useLocalStorage] Valeur initiale sauvegardée pour ${key} au montage`);
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue];
}
