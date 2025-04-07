
import { arrondir2Decimales } from './utils';

// Convertir des dimensions en cm en surface m²
export function convertirDimensionsEnSurface(largeur: number, hauteur: number): number {
  return arrondir2Decimales((largeur / 100) * (hauteur / 100));
}

// Calculer la surface au sol
export function calculerSurfaceSol(longueur: number, largeur: number): number {
  return arrondir2Decimales(longueur * largeur);
}

// Calculer la surface murale
export function calculerSurfaceMurale(longueur: number, largeur: number, hauteur: number): number {
  const perimetre = 2 * (longueur + largeur);
  return arrondir2Decimales(perimetre * hauteur);
}

// Calculer le périmètre d'une pièce
export function calculerPerimetre(longueur: number, largeur: number): number {
  return arrondir2Decimales(2 * (longueur + largeur));
}

// Calculer la surface des plinthes
export function calculerSurfacePlinthes(longueur: number, largeur: number, hauteurPlinthe: number, menuiseriesImpactantes: { largeur: number; quantity: number }[]): number {
  const perimetre = calculerPerimetre(longueur, largeur);
  
  // Soustraire la largeur des menuiseries qui impactent les plinthes
  const largeurTotaleImpactante = menuiseriesImpactantes.reduce(
    (total, item) => total + (item.largeur / 100) * item.quantity, 
    0
  );
  
  const longueurPlinthes = perimetre - largeurTotaleImpactante;
  return arrondir2Decimales(longueurPlinthes * hauteurPlinthe);
}
