
import { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

// Types spécifiques pour les styles PDF
type PdfStyleOptions = {
  isContainer?: boolean;
  inheritParentStyles?: boolean;
};

// Fonction principale pour obtenir les styles PDF
export const getPdfStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  options: PdfStyleOptions = {}
): Style => {
  const { isContainer = false, inheritParentStyles = true } = options;

  // Styles de base pour tous les éléments
  const baseStyles: Style = {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000000',
    ...(inheritParentStyles && {
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal'
    })
  };

  if (!pdfSettings?.elements) {
    return baseStyles;
  }

  // Appliquer les styles par défaut si disponibles
  const defaultSettings = pdfSettings.elements['default'];
  let mergedStyles = defaultSettings 
    ? applyElementSettingsToStyle(baseStyles, defaultSettings, isContainer)
    : baseStyles;

  // Appliquer les styles spécifiques à l'élément
  const elementSettings = pdfSettings.elements[elementId];
  if (elementSettings) {
    mergedStyles = applyElementSettingsToStyle(mergedStyles, elementSettings, isContainer);
  }

  return mergedStyles;
};

// Fonction pour appliquer les paramètres d'un élément aux styles PDF
const applyElementSettingsToStyle = (
  baseStyle: Style,
  settings: ElementSettings,
  isContainer: boolean
): Style => {
  const style: Style = { ...baseStyle };

  // Application des styles de texte
  if (settings.fontFamily) {
    style.fontFamily = ensureSupportedFont(settings.fontFamily);
  }

  if (typeof settings.fontSize === 'number') {
    style.fontSize = settings.fontSize;
  }

  if (settings.color) {
    style.color = settings.color;
  }

  if (settings.isBold !== undefined) {
    style.fontWeight = settings.isBold ? 'bold' : 'normal';
  }

  if (settings.isItalic !== undefined) {
    style.fontStyle = settings.isItalic ? 'italic' : 'normal';
  }

  if (settings.alignment) {
    style.textAlign = settings.alignment;
  }

  // Application du fond si spécifié
  if (settings.fillColor) {
    style.backgroundColor = settings.fillColor;
  }

  // Application de l'espacement
  if (settings.spacing) {
    const { top, right, bottom, left } = settings.spacing;
    
    if (typeof top === 'number') style.marginTop = top;
    if (typeof right === 'number') style.marginRight = right;
    if (typeof bottom === 'number') style.marginBottom = bottom;
    if (typeof left === 'number') style.marginLeft = left;
  }

  // Application des bordures
  if (settings.border) {
    const { top, right, bottom, left, color, width = 1 } = settings.border;
    
    if (color) {
      style.borderColor = color;
    }

    if (top || right || bottom || left) {
      style.borderStyle = 'solid';
      
      if (top) style.borderTopWidth = width;
      if (right) style.borderRightWidth = width;
      if (bottom) style.borderBottomWidth = width;
      if (left) style.borderLeftWidth = width;
    }
  }

  return style;
};

// Fonctions d'aide pour la compatibilité avec l'ancien code
export const getContainerStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  const baseStyles = getPdfStyles(pdfSettings, elementId, { isContainer: true });
  return { ...baseStyles, ...additionalStyles };
};

export const getTextStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  const baseStyles = getPdfStyles(pdfSettings, elementId, { isContainer: false });
  return { ...baseStyles, ...additionalStyles };
};

