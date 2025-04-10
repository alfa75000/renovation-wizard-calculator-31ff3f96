
/**
 * Adapte les valeurs de type de surface entre le frontend et la base de données
 */

export type SurfaceImpactee = 'mur' | 'plafond' | 'sol';
export type SurfaceImpacteeDB = 'Mur' | 'Plafond' | 'Sol' | 'Aucune';

/**
 * Convertit une valeur de type de surface du format frontend au format BDD
 */
export function surfaceTypeToDb(type?: string): SurfaceImpacteeDB {
  if (!type) return 'Mur';
  
  const lowerType = type.toLowerCase();
  
  switch (lowerType) {
    case 'mur':
    case 'murs':
      return 'Mur';
    case 'plafond':
    case 'plafonds':
      return 'Plafond';
    case 'sol':
    case 'sols':
      return 'Sol';
    default:
      return 'Mur';
  }
}

/**
 * Convertit une valeur de type de surface du format BDD au format frontend
 */
export function surfaceTypeFromDb(type?: string): SurfaceImpactee {
  if (!type) return 'mur';
  
  const lowerType = type.toLowerCase();
  
  switch (lowerType) {
    case 'mur':
      return 'mur';
    case 'plafond':
      return 'plafond';
    case 'sol':
      return 'sol';
    default:
      return 'mur';
  }
}
