
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
      // Analyser le JSON stocké ou retourner initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key} dans localStorage:`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur dans le state et localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Déterminer si c'est une fonction ou une valeur directe
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Sauvegarder dans l'état
      setStoredValue(valueToStore);
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        // Log pour le débogage
        console.log(`Sauvegarde dans localStorage - ${key}:`, valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key} dans localStorage:`, error);
    }
  };
  
  // Écouter les changements de localStorage sur d'autres onglets/fenêtres
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          console.log(`Storage event détecté pour ${key}:`, event.newValue);
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Erreur lors du parsing de la nouvelle valeur pour ${key}:`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier que la valeur est correctement enregistrée au montage
    const savedItem = window.localStorage.getItem(key);
    if (!savedItem && storedValue !== initialValue) {
      console.log(`Valeur initiale sauvegardée pour ${key}:`, storedValue);
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue];
}
