
import { Content } from 'pdfmake/interfaces';
import { PDF_TEXTS } from '../pdfConstants';
import { getPdfSettings } from '../config/pdfSettingsManager';
import { 
  ELEMENT_IDS, 
  convertToPdfStyle, 
  getElementSettings 
} from '../utils/styleUtils';

/**
 * Génère le contenu pour la section de signature
 * @returns Content[] - Contenu formaté pour la signature
 */
export const generateSignatureContent = (): Content[] => {
  const settings = getPdfSettings();
  const elements: Content[] = [];
  
  // Contenu principal
  elements.push({
    text: PDF_TEXTS.SIGNATURE.CONTENT,
    ...(convertToPdfStyle(ELEMENT_IDS.RECAP_SIGNATURE, settings))
  });
  
  // Points avec puces
  PDF_TEXTS.SIGNATURE.POINTS.forEach(point => {
    elements.push({
      text: point.text,
      ...(convertToPdfStyle(ELEMENT_IDS.RECAP_SIGNATURE, settings)),
      bold: point.bold || getElementSettings(ELEMENT_IDS.RECAP_SIGNATURE).isBold
    });
  });
  
  return elements;
};

/**
 * Génère le contenu pour la section de salutation
 * @returns Content - Contenu formaté pour la salutation
 */
export const generateSalutationContent = (): Content => {
  const settings = getPdfSettings();
  
  return {
    text: PDF_TEXTS.SALUTATION,
    ...(convertToPdfStyle(ELEMENT_IDS.RECAP_SALUTATION, settings))
  };
};
