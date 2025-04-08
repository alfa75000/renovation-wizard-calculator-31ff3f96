
import { useState } from 'react';
import { Menuiserie } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { createRoomMenuiserie, deleteRoomMenuiserie, updateRoomMenuiserie } from '@/services/menuiseriesService';

export const useMenuiseries = () => {
  const [menuiseries, setMenuiseries] = useState<Menuiserie[]>([]);

  // Générer un nom pour une menuiserie avec numérotation (pour la liste)
  const generateMenuiserieName = (type: string, largeur: number, hauteur: number): string => {
    const nextIndex = menuiseries.length + 1;
    const baseInfo = type ? `${type} (${largeur}×${hauteur} cm)` : '';
    return `Menuiserie n° ${nextIndex} ${baseInfo}`;
  };

  // Générer juste le nom du type de menuiserie sans numérotation (pour le formulaire)
  const getMenuiserieTypeName = (type: string, largeur: number, hauteur: number): string => {
    return type ? `${type} (${largeur}×${hauteur} cm)` : '';
  };

  // Ajouter une menuiserie
  const addMenuiserie = (
    menuiserie: Omit<Menuiserie, 'id' | 'surface'>, 
    quantity: number = 1
  ): Menuiserie => {
    const surface = (menuiserie.largeur * menuiserie.hauteur) / 10000; // Convert cm² to m²
    
    // Créer la nouvelle menuiserie avec un nom formaté pour la liste
    const newMenuiserie: Menuiserie = {
      ...menuiserie,
      id: uuidv4(),
      quantity,
      surface,
      name: generateMenuiserieName(menuiserie.type, menuiserie.largeur, menuiserie.hauteur)
    };

    setMenuiseries(prevMenuiseries => {
      // Ajouter la nouvelle menuiserie
      const updatedMenuiseries = [...prevMenuiseries, newMenuiserie];
      return updatedMenuiseries;
    });
    
    // Appel à l'API pour sauvegarder dans Supabase
    if (menuiserie.roomId) {
      createRoomMenuiserie(menuiserie.roomId, newMenuiserie)
        .catch(error => console.error('Erreur lors de la création de la menuiserie dans Supabase:', error));
    }
    
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
          
          // Appel à l'API pour mettre à jour dans Supabase
          if (menuiserie.roomId) {
            updateRoomMenuiserie(menuiserie.roomId, id, updatedMenuiserie)
              .catch(error => console.error('Erreur lors de la mise à jour de la menuiserie dans Supabase:', error));
          }
          
          return updatedMenuiserie;
        }
        return menuiserie;
      });
    });
    
    return updatedMenuiserie;
  };

  // Supprimer une menuiserie
  const deleteMenuiserie = (id: string, roomId?: string): void => {
    // Trouver la menuiserie avant de la supprimer
    const menuiserieToDelete = menuiseries.find(m => m.id === id);
    
    setMenuiseries(prevMenuiseries => 
      prevMenuiseries.filter(menuiserie => menuiserie.id !== id)
    );
    
    // Appel à l'API pour supprimer dans Supabase
    if (menuiserieToDelete && menuiserieToDelete.roomId) {
      const actualRoomId = roomId || menuiserieToDelete.roomId;
      deleteRoomMenuiserie(actualRoomId, id)
        .catch(error => console.error('Erreur lors de la suppression de la menuiserie dans Supabase:', error));
    }
  };

  return {
    menuiseries,
    setMenuiseries,
    addMenuiserie,
    updateMenuiserie,
    deleteMenuiserie,
    generateMenuiserieName,
    getMenuiserieTypeName
  };
};
