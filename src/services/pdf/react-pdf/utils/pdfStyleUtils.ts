
import { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

/**
 * Convertit les paramètres ElementSettings en styles compatibles avec React-PDF
 */
export const getElementPdfStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId
): Style => {
  // Valeurs par défaut pour les styles React-PDF
  const defaultStyles: Style = {
    fontFamily: 'Helvetica',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000000',
    textAlign: 'left',
    margin: [0, 0, 0, 0], // [left, top, right, bottom]
    padding: [0, 0, 0, 0], // [left, top, right, bottom]
  };

  // Si aucun paramètre PDF n'est fourni, retourner les styles par défaut
  if (!pdfSettings || !pdfSettings.elements) {
    return defaultStyles;
  }

  // Appliquer les styles par défaut de l'utilisateur s'ils existent
  let styles: Style = { ...defaultStyles };
  const defaultUserSettings = pdfSettings.elements['default'];
  
  if (defaultUserSettings) {
    styles = applyElementSettingsToStyle(styles, defaultUserSettings);
  }

  // Appliquer les styles spécifiques à l'élément s'ils existent
  const elementSettings = pdfSettings.elements[elementId];
  if (elementSettings) {
    styles = applyElementSettingsToStyle(styles, elementSettings);
  }

  return styles;
};

/**
 * Applique les paramètres ElementSettings à un objet Style React-PDF
 */
const applyElementSettingsToStyle = (baseStyle: Style, settings: ElementSettings): Style => {
  const style: Style = { ...baseStyle };

  // Appliquer les paramètres de typographie
  if (settings.fontFamily) {
    style.fontFamily = ensureSupportedFont(settings.fontFamily);
  }
  
  if (settings.fontSize) {
    style.fontSize = settings.fontSize;
  }
  
  if (settings.isBold !== undefined) {
    style.fontWeight = settings.isBold ? 'bold' : 'normal';
  }
  
  if (settings.isItalic !== undefined) {
    style.fontStyle = settings.isItalic ? 'italic' : 'normal';
  }
  
  // Appliquer les paramètres d'apparence
  if (settings.color) {
    style.color = settings.color;
  }
  
  if (settings.alignment) {
    style.textAlign = settings.alignment;
  }
  
  if (settings.fillColor) {
    style.backgroundColor = settings.fillColor;
  }
  
  // Appliquer les paramètres d'espacement (margins)
  if (settings.spacing) {
    // React-PDF utilise [left, top, right, bottom] pour les marges
    style.margin = [
      settings.spacing.left ?? 0,
      settings.spacing.top ?? 0,
      settings.spacing.right ?? 0,
      settings.spacing.bottom ?? 0
    ];
  }
  
  // Appliquer les paramètres de bordure
  if (settings.border) {
    const hasBorder = settings.border.top || settings.border.right || 
                      settings.border.bottom || settings.border.left;
    
    if (hasBorder) {
      // Définir la couleur de bordure globale si au moins une bordure est active
      style.borderColor = settings.border.color || '#000000';
      style.borderStyle = 'solid';
      
      // Appliquer les bordures individuelles selon les paramètres
      if (settings.border.top) {
        style.borderTopWidth = settings.border.width || 1;
      } else if (settings.border.top === false) {
        style.borderTopWidth = 0;
      }
      
      if (settings.border.right) {
        style.borderRightWidth = settings.border.width || 1;
      } else if (settings.border.right === false) {
        style.borderRightWidth = 0;
      }
      
      if (settings.border.bottom) {
        style.borderBottomWidth = settings.border.width || 1;
      } else if (settings.border.bottom === false) {
        style.borderBottomWidth = 0;
      }
      
      if (settings.border.left) {
        style.borderLeftWidth = settings.border.width || 1;
      } else if (settings.border.left === false) {
        style.borderLeftWidth = 0;
      }
    }
  }

  return style;
};

/**
 * Utilitaire pour créer un style de conteneur avec des paramètres spécifiques
 * tout en conservant les styles de texte et d'apparence
 */
export const getContainerStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  const baseStyles = getElementPdfStyles(pdfSettings, elementId);
  
  // Exclure les propriétés spécifiques au texte pour un conteneur
  const containerStyles: Style = {
    ...baseStyles,
    ...additionalStyles
  };
  
  return containerStyles;
};

/**
 * Utilitaire pour créer un style de texte avec des paramètres spécifiques
 */
export const getTextStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  const baseStyles = getElementPdfStyles(pdfSettings, elementId);
  
  // Extraire uniquement les propriétés pertinentes pour le texte
  const textStyles: Style = {
    fontFamily: baseStyles.fontFamily,
    fontSize: baseStyles.fontSize,
    fontWeight: baseStyles.fontWeight,
    fontStyle: baseStyles.fontStyle,
    color: baseStyles.color,
    textAlign: baseStyles.textAlign,
    ...additionalStyles
  };
  
  return textStyles;
};
