
import { useState, useEffect } from 'react';

// Hook générique pour gérer localStorage avec typage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  // Passe la fonction d'initialisation à useState pour que la logique ne s'exécute qu'une fois
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Récupérer depuis localStorage par clé
      const item = window.localStorage.getItem(key);
      // Parser le JSON stocké ou retourner la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // En cas d'erreur, retourner la valeur initiale
      console.log(error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour localStorage et l'état local
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour suivre la même API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Sauvegarder l'état
      setStoredValue(valueToStore);
      // Sauvegarder dans localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Une erreur plus descriptive
      console.error(`Impossible de stocker la valeur pour la clé ${key}:`, error);
    }
  };

  // Synchroniser avec localStorage quand la clé change
  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        setStoredValue(JSON.parse(item));
      } catch (error) {
        console.error(`Erreur lors de la lecture de la clé ${key}:`, error);
      }
    }
  }, [key]);

  return [storedValue, setValue] as const;
}
