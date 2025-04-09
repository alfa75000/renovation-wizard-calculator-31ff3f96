
import { useState } from 'react';
import { AutreSurface, TypeAutreSurface } from '@/types';
import { arrondir2Decimales } from '@/lib/utils';

export const useAutresSurfaces = () => {
  const [autresSurfaces, setAutresSurfaces] = useState<AutreSurface[]>([]);
  
  // Obtenir les infos de base depuis un type d'autre surface
  const getDefaultFromType = (type: TypeAutreSurface): Partial<AutreSurface> => {
    return {
      type: type.nom,
      designation: type.nom,
      surfaceImpactee: type.surfaceImpacteeParDefaut,
      estDeduction: type.estDeduction,
      impactePlinthe: type.impactePlinthe,
      description: type.description
    };
  };
  
  // Ajouter une autre surface
  const addAutreSurface = (
    surface: Omit<AutreSurface, 'id' | 'surface'>, 
    quantity: number = 1
  ): AutreSurface[] => {
    const surfaceM2 = arrondir2Decimales(surface.largeur * surface.hauteur);
    
    const typeCount = autresSurfaces.filter(s => s.type === surface.type)
      .reduce((sum, item) => sum + item.quantity, 0);
      
    const newSurfaces: AutreSurface[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const itemNumber = typeCount + i + 1;
      const autoName = surface.name || `${surface.type} ${itemNumber}`;
      
      newSurfaces.push({
        id: Date.now().toString() + i,
        type: surface.type,
        name: autoName,
        designation: surface.designation,
        largeur: surface.largeur,
        hauteur: surface.hauteur,
        quantity: 1,
        surface: surfaceM2,
        surfaceImpactee: surface.surfaceImpactee,
        estDeduction: surface.estDeduction,
        impactePlinthe: surface.impactePlinthe,
        description: surface.description
      });
    }
    
    const updatedSurfaces = [...autresSurfaces, ...newSurfaces];
    setAutresSurfaces(updatedSurfaces);
    
    return newSurfaces;
  };
  
  // Mettre à jour une autre surface
  const updateAutreSurface = (id: string, surface: Partial<Omit<AutreSurface, 'id' | 'surface'>>): AutreSurface | null => {
    let updatedSurface: AutreSurface | null = null;
    
    setAutresSurfaces(prevSurfaces => {
      const updated = prevSurfaces.map(item => {
        if (item.id === id) {
          const newSurface = surface.largeur && surface.hauteur
            ? arrondir2Decimales(surface.largeur * surface.hauteur)
            : item.surface;
            
          updatedSurface = {
            ...item,
            ...surface,
            surface: newSurface
          };
          
          return updatedSurface;
        }
        return item;
      });
      
      return updated;
    });
    
    return updatedSurface;
  };
  
  // Supprimer une autre surface
  const deleteAutreSurface = (id: string): void => {
    setAutresSurfaces(prevSurfaces => 
      prevSurfaces.filter(item => item.id !== id)
    );
  };
  
  // Réinitialiser les autres surfaces
  const resetAutresSurfaces = (): void => {
    setAutresSurfaces([]);
  };
  
  return {
    autresSurfaces,
    setAutresSurfaces,
    getDefaultFromType,
    addAutreSurface,
    updateAutreSurface,
    deleteAutreSurface,
    resetAutresSurfaces
  };
};
