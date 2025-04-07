
import { useState } from 'react';
import { Menuiserie, TypeMenuiserie } from '@/types';
import { convertirDimensionsEnSurface, arrondir2Decimales } from '@/lib/utils';

export const useMenuiseries = () => {
  const [menuiseries, setMenuiseries] = useState<Menuiserie[]>([]);
  
  // Obtenir les infos de base depuis un type de menuiserie
  const getDefaultFromType = (type: TypeMenuiserie): Partial<Menuiserie> => {
    return {
      type: type.nom,
      largeur: type.largeur,
      hauteur: type.hauteur,
      impactePlinthe: type.impactePlinthe,
      surfaceImpactee: getDefaultSurfaceImpactee(type.nom),
    };
  };
  
  // Déterminer la surface impactée par défaut en fonction du type
  const getDefaultSurfaceImpactee = (type: string): "mur" | "plafond" | "sol" => {
    const lowerType = type.toLowerCase();
    if (
      lowerType.includes('toit') || 
      lowerType.includes('velux') || 
      lowerType.includes('vélux') || 
      lowerType.includes('plafond')
    ) {
      return "plafond";
    } else if (
      lowerType.includes('trappe') || 
      lowerType.includes('sol')
    ) {
      return "sol";
    }
    return "mur";
  };
  
  // Ajouter une menuiserie
  const addMenuiserie = (menuiserie: Omit<Menuiserie, 'id' | 'surface'>, quantity: number = 1): Menuiserie[] => {
    const surfaceM2 = convertirDimensionsEnSurface(menuiserie.largeur, menuiserie.hauteur);
    
    const typeCount = menuiseries.filter(m => m.type === menuiserie.type)
      .reduce((sum, item) => sum + item.quantity, 0);
      
    const newMenuiseries: Menuiserie[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const itemNumber = typeCount + i + 1;
      const autoName = menuiserie.name || `${menuiserie.type} ${itemNumber}`;
      
      newMenuiseries.push({
        id: Date.now().toString() + i,
        type: menuiserie.type,
        name: autoName,
        largeur: menuiserie.largeur,
        hauteur: menuiserie.hauteur,
        quantity: 1,
        surface: surfaceM2,
        surfaceImpactee: menuiserie.surfaceImpactee,
        impactePlinthe: menuiserie.impactePlinthe
      });
    }
    
    const updatedMenuiseries = [...menuiseries, ...newMenuiseries];
    setMenuiseries(updatedMenuiseries);
    
    return newMenuiseries;
  };
  
  // Mettre à jour une menuiserie
  const updateMenuiserie = (id: string, menuiserie: Partial<Omit<Menuiserie, 'id' | 'surface'>>): Menuiserie | null => {
    let updatedMenuiserie: Menuiserie | null = null;
    
    setMenuiseries(prevMenuiseries => {
      const updated = prevMenuiseries.map(item => {
        if (item.id === id) {
          const newSurface = menuiserie.largeur && menuiserie.hauteur
            ? convertirDimensionsEnSurface(menuiserie.largeur, menuiserie.hauteur)
            : item.surface;
            
          updatedMenuiserie = {
            ...item,
            ...menuiserie,
            surface: newSurface
          };
          
          return updatedMenuiserie;
        }
        return item;
      });
      
      return updated;
    });
    
    return updatedMenuiserie;
  };
  
  // Supprimer une menuiserie
  const deleteMenuiserie = (id: string): void => {
    setMenuiseries(prevMenuiseries => 
      prevMenuiseries.filter(item => item.id !== id)
    );
  };
  
  // Réinitialiser les menuiseries
  const resetMenuiseries = (): void => {
    setMenuiseries([]);
  };
  
  return {
    menuiseries,
    setMenuiseries,
    getDefaultFromType,
    getDefaultSurfaceImpactee,
    addMenuiserie,
    updateMenuiserie,
    deleteMenuiserie,
    resetMenuiseries
  };
};
