
import { getPdfSettings } from '../config/pdfSettingsManager';

/**
 * Fonction utilitaire pour récupérer les propriétés d'un élément avec les bonnes valeurs par défaut
 * et les types corrects
 */
export function getElementStyles<T extends Record<string, any>>(elementId: string, defaultProps: T): T {
  // Récupère les paramètres PDF globaux
  const pdfSettings = getPdfSettings();
  
  // Si aucun paramètre n'est défini ou si l'élément spécifique n'est pas configuré
  if (!pdfSettings?.elements || !pdfSettings.elements[elementId]) {
    return defaultProps;
  }
  
  // Récupère les paramètres de l'élément
  const elementSettings = pdfSettings.elements[elementId];
  
  // Crée un nouvel objet résultant avec les valeurs par défaut
  const result = { ...defaultProps };
  
  // Pour chaque propriété du style par défaut, applique la valeur personnalisée si elle existe
  Object.keys(defaultProps).forEach(key => {
    // Cas spécial pour les propriétés booléennes qui doivent être true
    if (key === 'bold' && defaultProps[key] === true) {
      // Force à true si la valeur personnalisée n'existe pas ou n'est pas un booléen
      result[key] = elementSettings.isBold === false ? false : true;
    } 
    // Cas spécial pour les propriétés booléennes qui doivent être false
    else if (key === 'bold' && defaultProps[key] === false) {
      result[key] = elementSettings.isBold === true ? true : false;
    }
    // Mapping des propriétés avec des noms différents
    else if (key === 'fontSize' && elementSettings.fontSize !== undefined) {
      result[key] = elementSettings.fontSize;
    }
    else if (key === 'color' && elementSettings.color !== undefined) {
      result[key] = elementSettings.color;
    }
    else if (key === 'alignment' && elementSettings.alignment !== undefined) {
      result[key] = elementSettings.alignment;
    }
    // Autres propriétés
    else if (key in elementSettings) {
      result[key] = elementSettings[key];
    }
  });
  
  return result;
}
