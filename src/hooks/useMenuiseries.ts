
import { useState } from 'react';
import { Menuiserie } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { createRoomMenuiserie, deleteRoomMenuiserie, updateRoomMenuiserie } from '@/services/menuiseriesService';

export const useMenuiseries = () => {
  const [menuiseries, setMenuiseries] = useState<Menuiserie[]>([]);

  // Générer un nom pour une menuiserie
  const generateMenuiserieName = (type: string, largeur: number, hauteur: number): string => {
    const nextIndex = menuiseries.length + 1;
    const baseInfo = type ? `(${type} (${largeur}×${hauteur} cm))` : '';
    return `Menuiserie n° ${nextIndex} ${baseInfo}`;
  };

  // Ajouter une menuiserie
  const addMenuiserie = (
    menuiserie: Omit<Menuiserie, 'id' | 'surface'>, 
    quantity: number = 1
  ): Menuiserie => {
    const surface = (menuiserie.largeur * menuiserie.hauteur) / 10000; // Convert cm² to m²
    
    // Créer la nouvelle menuiserie
    const newMenuiserie: Menuiserie = {
      ...menuiserie,
      id: uuidv4(),
      quantity,
      surface,
      name: menuiserie.name || generateMenuiserieName(menuiserie.type, menuiserie.largeur, menuiserie.hauteur)
    };

    setMenuiseries(prevMenuiseries => {
      // Ajouter la nouvelle menuiserie
      const updatedMenuiseries = [...prevMenuiseries, newMenuiserie];
      return updatedMenuiseries;
    });
    
    // Appel à l'API pour sauvegarder dans Supabase sera fait au niveau du composant parent
    
    return newMenuiserie;
  };

  // Mettre à jour une menuiserie
  const updateMenuiserie = (
    id: string, 
    updates: Partial<Omit<Menuiserie, 'id' | 'surface'>>
  ): Menuiserie | null => {
    let updatedMenuiserie: Menuiserie | null = null;

    setMenuiseries(prevMenuiseries => {
      return prevMenuiseries.map(menuiserie => {
        if (menuiserie.id === id) {
          // Calculer la nouvelle surface si les dimensions ont changé
          const newLargeur = updates.largeur !== undefined ? updates.largeur : menuiserie.largeur;
          const newHauteur = updates.hauteur !== undefined ? updates.hauteur : menuiserie.hauteur;
          const newSurface = (newLargeur * newHauteur) / 10000; // Convert cm² to m²

          updatedMenuiserie = {
            ...menuiserie,
            ...updates,
            largeur: newLargeur,
            hauteur: newHauteur,
            surface: newSurface
          };
          
          return updatedMenuiserie;
        }
        return menuiserie;
      });
    });

    // Appel à l'API pour mettre à jour dans Supabase sera fait au niveau du composant parent
    
    return updatedMenuiserie;
  };

  // Supprimer une menuiserie
  const deleteMenuiserie = (id: string): void => {
    setMenuiseries(prevMenuiseries => 
      prevMenuiseries.filter(menuiserie => menuiserie.id !== id)
    );
    
    // Appel à l'API pour supprimer dans Supabase sera fait au niveau du composant parent
  };

  return {
    menuiseries,
    setMenuiseries,
    addMenuiserie,
    updateMenuiserie,
    deleteMenuiserie,
    generateMenuiserieName
  };
};
