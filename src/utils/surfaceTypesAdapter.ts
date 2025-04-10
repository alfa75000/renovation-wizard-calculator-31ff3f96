
import { SurfaceImpactee } from "@/types/supabase";

/**
 * Convertit une valeur de type de surface du format de l'application au format de la base de données
 */
export function surfaceTypeToDb(type?: string): SurfaceImpactee {
  if (!type) return 'Aucune';
  
  switch (type.toLowerCase()) {
    case 'mur':
      return 'Mur';
    case 'plafond':
      return 'Plafond';
    case 'sol':
      return 'Sol';
    default:
      return 'Aucune';
  }
}

/**
 * Convertit une valeur de type de surface du format de la base de données au format de l'application
 */
export function surfaceTypeFromDb(type?: string): 'mur' | 'plafond' | 'sol' | 'aucune' {
  if (!type) return 'aucune';
  
  switch (type) {
    case 'Mur':
      return 'mur';
    case 'Plafond':
      return 'plafond';
    case 'Sol':
      return 'sol';
    default:
      return 'aucune';
  }
}
