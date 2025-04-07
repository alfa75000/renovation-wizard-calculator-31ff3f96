
import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour interagir avec localStorage
 * @param key La clé pour stocker les données dans localStorage
 * @param initialValue La valeur initiale si aucune donnée n'existe
 * @returns Un tableau contenant la valeur stockée et une fonction pour la mettre à jour
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Fonction pour obtenir la valeur initiale
  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
      return initialValue;
    }
  };

  // État local pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Fonction pour mettre à jour la valeur dans localStorage et l'état local
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permet de passer une fonction comme pour useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Mettre à jour l'état local
      setStoredValue(valueToStore);
      
      // Mettre à jour localStorage
      if (valueToStore === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${key} dans localStorage:`, error);
    }
  };

  // Écouter les changements de localStorage depuis d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          // Ne mettre à jour que si la valeur a changé pour éviter une boucle
          if (JSON.stringify(newValue) !== JSON.stringify(storedValue)) {
            setStoredValue(newValue);
          }
        } catch (error) {
          console.error("Erreur lors du traitement de l'événement de stockage:", error);
        }
      }
    };

    // Ajouter l'écouteur d'événements
    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyer l'écouteur à la destruction du composant
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, storedValue, initialValue]);

  return [storedValue, setValue];
}
