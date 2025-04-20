import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { LIGHT_GREY } from '../constants/pdfConstants';

/**
 * Détermine les bordures à appliquer à un élément en fonction des paramètres
 * @param borderSettings - Paramètres des bordures (haut, droite, bas, gauche)
 * @returns Un tableau de nombres représentant les bordures [gauche, haut, droite, bas]
 */
export const getElementBorders = (borderSettings: { top: boolean; right: boolean; bottom: boolean; left: boolean }): [number, number, number, number] => {
  const borderWidth = 0.5; // épaisseur de la bordure
  return [
    borderSettings.left ? borderWidth : 0,
    borderSettings.top ? borderWidth : 0,
    borderSettings.right ? borderWidth : 0,
    borderSettings.bottom ? borderWidth : 0
  ];
};

/**
 * Enveloppe un élément avec des bordures en utilisant les paramètres spécifiés.
 * @param element L'élément à envelopper avec des bordures.
 * @param borderSettings Paramètres pour chaque bordure (gauche, haut, droite, bas).
 * @returns L'élément enveloppé avec les bordures spécifiées.
 */
export const wrapWithBorders = (
  element: any,
  borderSettings: { top: boolean; right: boolean; bottom: boolean; left: boolean }
) => {
  const borderThickness = 0.5; // Ajustez selon l'épaisseur désirée
  const borderColor = LIGHT_GREY; // Ajustez selon la couleur désirée

  element.border = [
    borderSettings.left ? borderThickness : 0,
    borderSettings.top ? borderThickness : 0,
    borderSettings.right ? borderThickness : 0,
    borderSettings.bottom ? borderThickness : 0,
  ];
  element.borderColor = borderColor;
  return element;
};

/**
 * Applique les styles par défaut à un élément texte.
 * @param element - L'élément texte à styliser.
 * @param defaultStyles - Les styles par défaut à appliquer.
 * @returns L'élément texte avec les styles appliqués.
 */
const applyDefaultStyles = (
  element: any,
  defaultStyles?: {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    color?: string;
    alignment?: string;
    spacing?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }
) => {
  const styledElement = { ...element };
  
  if (defaultStyles?.fontSize) {
    styledElement.fontSize = defaultStyles.fontSize;
  }
  if (defaultStyles?.color) {
    styledElement.color = defaultStyles.color;
  }
  if (defaultStyles?.alignment) {
    styledElement.alignment = defaultStyles.alignment;
  }
  if (defaultStyles?.spacing) {
    styledElement.margin = [
      defaultStyles.spacing.left || 0,
      defaultStyles.spacing.top || 0,
      defaultStyles.spacing.right || 0,
      defaultStyles.spacing.bottom || 0
    ];
  }
  
  const textStyle = [];
  if (defaultStyles?.isBold) {
    textStyle.push('bold');
  }
  if (defaultStyles?.isItalic) {
    textStyle.push('italic');
  }
  if (defaultStyles?.isUnderline) {
    textStyle.push('underline');
  }
  if (textStyle.length > 0) {
    styledElement.style = textStyle;
  }
  
  return styledElement;
};

/**
 * Applique des styles à un élément texte selon les paramètres PDF personnalisés
 */
export const applyElementStyles = (
  element: any, 
  elementId: string, 
  pdfSettings?: PdfSettings,
  defaultStyles?: {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    color?: string;
    alignment?: string;
    spacing?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }
) => {
  console.log(`[pdfUtils] Applying styles to element ID: ${elementId}`);
  
  // Si aucun paramètre ou élément spécifique n'est trouvé, utiliser les styles par défaut
  if (!pdfSettings || !elementId) {
    console.log(`[pdfUtils] No specific settings found for element ID: ${elementId}, using defaults`);
    return applyDefaultStyles(element, defaultStyles);
  }
  
  // Vérifier si des styles spécifiques sont définis pour cet élément
  const elementSettings = pdfSettings.elements[elementId];
  console.log(`[pdfUtils] Element settings for ${elementId}:`, elementSettings);
  
  if (elementSettings) {
    console.log(`[pdfUtils] Custom settings found for element ID: ${elementId}`);
    
    // Appliquer les styles personnalisés
    const styledElement = { ...element };
    
    // Police et taille
    if (elementSettings.fontSize) {
      styledElement.fontSize = elementSettings.fontSize;
      console.log(`[pdfUtils] Applied fontSize: ${elementSettings.fontSize}`);
    }
    
    // Style du texte (gras, italique, souligné)
    const textStyle = [];
    if (elementSettings.isBold) {
      textStyle.push('bold');
      console.log(`[pdfUtils] Applied bold style`);
    }
    if (elementSettings.isItalic) {
      textStyle.push('italic');
      console.log(`[pdfUtils] Applied italic style`);
    }
    if (textStyle.length > 0) {
      styledElement.style = textStyle;
    }
    
    // Couleur du texte
    if (elementSettings.color) {
      styledElement.color = elementSettings.color;
      console.log(`[pdfUtils] Applied color: ${elementSettings.color}`);
    }
    
    // Alignement
    if (elementSettings.alignment) {
      styledElement.alignment = elementSettings.alignment;
      console.log(`[pdfUtils] Applied alignment: ${elementSettings.alignment}`);
    }
    
    // Marges/espacement
    if (elementSettings.spacing) {
      const margin = [
        elementSettings.spacing.left || 0,
        elementSettings.spacing.top || 0,
        elementSettings.spacing.right || 0,
        elementSettings.spacing.bottom || 0
      ];
      styledElement.margin = margin;
      console.log(`[pdfUtils] Applied margins: [${margin.join(', ')}]`);
    }
    
    // Bordures
    if (elementSettings.border) {
      styledElement.border = getElementBorders(elementSettings.border);
      console.log(`[pdfUtils] Applied borders:`, styledElement.border);
    }
    
    return styledElement;
  } else {
    console.log(`[pdfUtils] No custom settings for element ID: ${elementId}, using defaults`);
    return applyDefaultStyles(element, defaultStyles);
  }
};
