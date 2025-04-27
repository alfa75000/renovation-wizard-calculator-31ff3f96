
import { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

// Types pour les options de style
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

  const baseStyles: Style = {
    ...(inheritParentStyles && {
      textAlign: 'left'
    })
  };

  if (!pdfSettings?.elements) {
    return baseStyles;
  }

  const defaultSettings = pdfSettings.elements['default'];
  const defaultStyles = defaultSettings
    ? applyElementSettingsToStyle({}, defaultSettings)
    : {};

  const elementSettings = pdfSettings.elements[elementId];
  const elementSpecificStyles = elementSettings
    ? applyElementSettingsToStyle({}, elementSettings)
    : {};

  // Fusion des styles: base + défaut + spécifique
  let mergedStyles: Style = {
    ...baseStyles,
    ...defaultStyles,
    ...elementSpecificStyles
  };

  // Si ce n'est pas un conteneur, on supprime les propriétés spécifiques aux conteneurs
  if (!isContainer) {
    const containerProperties: (keyof Style)[] = [
      // Marges externes (spacing)
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      // Bordures
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'borderColor', 'borderStyle', 'backgroundColor',
      // Padding (espacement interne) - ajouté à la liste des propriétés à supprimer pour les textes
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'
    ];
    
    containerProperties.forEach(prop => {
      if (prop in mergedStyles) {
        delete mergedStyles[prop];
      }
    });
  }
  
  return mergedStyles;
};

// Fonctions helper pour simplifier l'utilisation dans les composants
// Ces fonctions sont des wrappers autour de getPdfStyles avec des options préconfigurées
export const getContainerStyles = (pdfSettings: PdfSettings, elementId: PdfElementId, additionalStyles: Style = {}): Style => {
  return { ...getPdfStyles(pdfSettings, elementId, { isContainer: true }), ...additionalStyles };
};

export const getTextStyles = (pdfSettings: PdfSettings, elementId: PdfElementId, additionalStyles: Style = {}): Style => {
  return { ...getPdfStyles(pdfSettings, elementId, { isContainer: false }), ...additionalStyles };
};

const applyElementSettingsToStyle = (
  baseStyle: Style,
  settings: ElementSettings
): Style => {
  const style: Style = { ...baseStyle };

  // Application des propriétés de police et texte
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

  if (typeof settings.lineHeight === 'number') {
    style.lineHeight = settings.lineHeight;
  }

  if (settings.fillColor) {
    style.backgroundColor = settings.fillColor;
  }

  // Application des marges externes (spacing)
  if (settings.spacing) {
    const { top, right, bottom, left } = settings.spacing;
    if (typeof top === 'number') style.marginTop = top;
    if (typeof right === 'number') style.marginRight = right;
    if (typeof bottom === 'number') style.marginBottom = bottom;
    if (typeof left === 'number') style.marginLeft = left;
  }

  // Application des marges internes (padding)
  if (settings.padding) {
    const { top, right, bottom, left } = settings.padding;
    if (typeof top === 'number') style.paddingTop = top;
    if (typeof right === 'number') style.paddingRight = right;
    if (typeof bottom === 'number') style.paddingBottom = bottom;
    if (typeof left === 'number') style.paddingLeft = left;
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
