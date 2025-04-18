
import { getPdfSettings } from '../config/pdfSettingsManager';

/**
 * Fonction utilitaire pour récupérer les propriétés d'un élément avec les bonnes valeurs par défaut
 * et les types corrects
 */
export function getElementStyles(elementId: string, defaultProps: Record<string, any>): Record<string, any> {
  const pdfSettings = getPdfSettings();
  
  if (!pdfSettings?.elements || !pdfSettings.elements[elementId]) {
    return defaultProps;
  }
  
  const elementSettings = pdfSettings.elements[elementId];
  const result = { ...defaultProps };
  
  Object.keys(defaultProps).forEach(key => {
    if (key === 'bold' && defaultProps[key] === true) {
      result[key] = elementSettings.isBold === false ? false : true;
    } 
    else if (key === 'bold' && defaultProps[key] === false) {
      result[key] = elementSettings.isBold === true ? true : false;
    }
    else if (key === 'fontSize' && elementSettings.fontSize !== undefined) {
      result[key] = elementSettings.fontSize;
    }
    else if (key === 'color' && elementSettings.color !== undefined) {
      result[key] = elementSettings.color;
    }
    else if (key === 'alignment' && elementSettings.alignment !== undefined) {
      result[key] = elementSettings.alignment;
    }
    else if (key in elementSettings) {
      result[key] = elementSettings[key];
    }
  });
  
  return result;
}
