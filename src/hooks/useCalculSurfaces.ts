
import { arrondir2Decimales } from '@/lib/utils';
import { Room, Menuiserie, AutreSurface } from '@/types';

export const useCalculSurfaces = () => {
  // Calculer la surface brute d'une pièce
  const calculerSurfaceBrute = (longueur: number, largeur: number): number => {
    return arrondir2Decimales(longueur * largeur);
  };
  
  // Calculer la surface murale brute d'une pièce
  const calculerSurfaceMuraleBrute = (longueur: number, largeur: number, hauteur: number): number => {
    const perimetre = 2 * (longueur + largeur);
    return arrondir2Decimales(perimetre * hauteur);
  };
  
  // Calculer le périmètre d'une pièce
  const calculerPerimetre = (longueur: number, largeur: number): number => {
    return arrondir2Decimales(2 * (longueur + largeur));
  };
  
  // Calculer la longueur de plinthe (en tenant compte des portes)
  const calculerLongueurPlinthe = (perimetre: number, menuiseries: Menuiserie[]): number => {
    let doorWidths = 0;
    
    menuiseries.forEach(item => {
      // Vérifier que type existe et n'est pas undefined avant d'appeler toLowerCase
      const impactePlinthe = item.impactePlinthe || false;
      const typeLowerCase = item.type?.toLowerCase() || '';
      const surfaceImpactee = item.surfaceImpactee || 'mur';
      const quantity = item.quantity || 1;
      
      if ((typeLowerCase.includes('porte') || impactePlinthe) && surfaceImpactee === 'mur') {
        doorWidths += (item.largeur / 100) * quantity;
      }
    });
    
    return arrondir2Decimales(perimetre - doorWidths);
  };
  
  // Calculer la surface des plinthes
  const calculerSurfacePlinthe = (longueurPlinthe: number, hauteurPlinthe: number): number => {
    return arrondir2Decimales(longueurPlinthe * hauteurPlinthe);
  };
  
  // Calculer la surface des menuiseries sur un type d'impact (mur, sol, plafond)
  const calculerSurfaceMenuiseries = (menuiseries: Menuiserie[], surfaceImpactee: 'mur' | 'plafond' | 'sol'): number => {
    return arrondir2Decimales(
      menuiseries
        .filter(m => (m.surfaceImpactee || 'mur') === surfaceImpactee)
        .reduce((total, m) => total + m.surface * (m.quantity || 1), 0)
    );
  };
  
  // Calculer la surface des autres surfaces
  const calculerSurfaceAutres = (
    autresSurfaces: AutreSurface[], 
    surfaceImpactee: 'mur' | 'plafond' | 'sol', 
    estDeduction: boolean
  ): number => {
    return arrondir2Decimales(
      autresSurfaces
        .filter(s => (s.surfaceImpactee || 'mur') === surfaceImpactee && (s.estDeduction || false) === estDeduction)
        .reduce((total, s) => total + s.surface * (s.quantity || 1), 0)
    );
  };
  
  // Calculer la surface nette des murs
  const calculerSurfaceNetteMurs = (
    surfaceBrute: number,
    surfaceMenuiseries: number,
    surfacePlinthe: number,
    surfaceAutresAjout: number,
    surfaceAutresDeduction: number
  ): number => {
    return arrondir2Decimales(
      surfaceBrute - surfaceMenuiseries - surfacePlinthe + surfaceAutresAjout - surfaceAutresDeduction
    );
  };
  
  // Calculer la surface nette du sol ou du plafond
  const calculerSurfaceNetteSolPlafond = (
    surfaceBrute: number,
    surfaceMenuiseries: number,
    surfaceAutresAjout: number,
    surfaceAutresDeduction: number
  ): number => {
    return arrondir2Decimales(
      surfaceBrute - surfaceMenuiseries + surfaceAutresAjout - surfaceAutresDeduction
    );
  };
  
  // Calculer toutes les surfaces pour une pièce
  const calculerToutesSurfaces = (room: Omit<Room, 'id'>): Partial<Room> => {
    // Extraire les valeurs
    const { length, width, height, plinthHeight, menuiseries = [], autresSurfaces = [] } = room;
    
    // Calculs de base
    const surfaceBruteSol = calculerSurfaceBrute(length, width);
    const surfaceBrutePlafond = surfaceBruteSol;
    const perimetre = calculerPerimetre(length, width);
    const surfaceBruteMurs = calculerSurfaceMuraleBrute(length, width, height);
    
    // Calculs des menuiseries
    const menuiseriesMursSurface = calculerSurfaceMenuiseries(menuiseries, 'mur');
    const menuiseriesPlafondSurface = calculerSurfaceMenuiseries(menuiseries, 'plafond');
    const menuiseriesSolSurface = calculerSurfaceMenuiseries(menuiseries, 'sol');
    const totalMenuiserieSurface = menuiseriesMursSurface + menuiseriesPlafondSurface + menuiseriesSolSurface;
    
    // Calculs des autres surfaces
    const autresMursAjout = calculerSurfaceAutres(autresSurfaces, 'mur', false);
    const autresMursDeduction = calculerSurfaceAutres(autresSurfaces, 'mur', true);
    const autresPlafondAjout = calculerSurfaceAutres(autresSurfaces, 'plafond', false);
    const autresPlafondDeduction = calculerSurfaceAutres(autresSurfaces, 'plafond', true);
    const autresSolAjout = calculerSurfaceAutres(autresSurfaces, 'sol', false);
    const autresSolDeduction = calculerSurfaceAutres(autresSurfaces, 'sol', true);
    
    // Calculs des plinthes
    const totalPlinthLength = calculerLongueurPlinthe(perimetre, menuiseries);
    const totalPlinthSurface = calculerSurfacePlinthe(totalPlinthLength, plinthHeight);
    
    // Calculs des surfaces nettes
    const netWallSurface = calculerSurfaceNetteMurs(
      surfaceBruteMurs,
      menuiseriesMursSurface,
      totalPlinthSurface,
      autresMursAjout,
      autresMursDeduction
    );
    
    const surfaceNetteMurs = netWallSurface;
    const surfaceMenuiseries = totalMenuiserieSurface;
    
    const surfaceNetteSol = calculerSurfaceNetteSolPlafond(
      surfaceBruteSol,
      menuiseriesSolSurface,
      autresSolAjout,
      autresSolDeduction
    );
    
    const surfaceNettePlafond = calculerSurfaceNetteSolPlafond(
      surfaceBrutePlafond,
      menuiseriesPlafondSurface,
      autresPlafondAjout,
      autresPlafondDeduction
    );
    
    return {
      // Surfaces brutes
      surface: surfaceBruteSol,
      wallSurfaceRaw: surfaceBruteMurs,
      surfaceBruteSol,
      surfaceBrutePlafond,
      surfaceBruteMurs,
      
      // Linéaires
      lineaireBrut: perimetre,
      lineaireNet: totalPlinthLength,
      totalPlinthLength,
      totalPlinthSurface,
      
      // Menuiseries
      menuiseriesMursSurface,
      menuiseriesPlafondSurface,
      menuiseriesSolSurface,
      surfaceMenuiseries,
      totalMenuiserieSurface,
      
      // Autres surfaces
      autresSurfacesMurs: autresMursAjout - autresMursDeduction,
      autresSurfacesPlafond: autresPlafondAjout - autresPlafondDeduction,
      autresSurfacesSol: autresSolAjout - autresSolDeduction,
      
      // Surfaces nettes
      netWallSurface,
      surfaceNetteMurs,
      surfaceNetteSol,
      surfaceNettePlafond,
    };
  };
  
  return {
    calculerSurfaceBrute,
    calculerSurfaceMuraleBrute,
    calculerPerimetre,
    calculerLongueurPlinthe,
    calculerSurfacePlinthe,
    calculerSurfaceMenuiseries,
    calculerSurfaceAutres,
    calculerSurfaceNetteMurs,
    calculerSurfaceNetteSolPlafond,
    calculerToutesSurfaces,
  };
};
