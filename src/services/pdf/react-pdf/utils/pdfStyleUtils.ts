
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

/**
 * Fonction principale qui génère les styles PDF à partir des paramètres
 * Gère correctement l'héritage des styles:
 * Styles de base < Paramètres d'éléments par défaut < Paramètres d'éléments spécifiques
 */
export const getPdfStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  options: PdfStyleOptions = {}
): Style => {
  const { isContainer = false, inheritParentStyles = true } = options;

  // Styles de base minimaux - ne devraient presque jamais écraser quoi que ce soit
  const baseStyles: Style = {
    ...(inheritParentStyles && {
      textAlign: 'left'
    })
  };

  if (!pdfSettings?.elements) {
    return baseStyles;
  }

  // D'abord appliquer les paramètres par défaut si disponibles
  const defaultSettings = pdfSettings.elements['default'];
  const defaultStyles = defaultSettings
    ? applyElementSettingsToStyle({}, defaultSettings, isContainer)
    : {};

  // Puis fusionner avec les paramètres spécifiques à l'élément (prioritaires)
  const elementSettings = pdfSettings.elements[elementId];
  const elementSpecificStyles = elementSettings
    ? applyElementSettingsToStyle({}, elementSettings, isContainer)
    : {};

  // Appliquer les styles dans l'ordre de priorité correct:
  // Styles de base (priorité la plus basse) < Styles par défaut < Styles spécifiques à l'élément (priorité la plus haute)
  return {
    ...baseStyles,
    ...defaultStyles,
    ...elementSpecificStyles
  };
};

/**
 * Convertit un objet ElementSettings en objet Style de React-PDF
 * Assure une correspondance correcte de toutes les propriétés
 */
const applyElementSettingsToStyle = (
  baseStyle: Style,
  settings: ElementSettings,
  isContainer: boolean
): Style => {
  const style: Style = { ...baseStyle };

  // Style de texte - correspondance directe avec les propriétés React-PDF
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

  // Style d'arrière-plan
  if (settings.fillColor) {
    style.backgroundColor = settings.fillColor;
  }

  // Espacement (margin) - conversion de l'objet spacing personnalisé en marges React-PDF
  // N'appliquer l'espacement qu'aux conteneurs
  if (isContainer && settings.spacing) {
    if (typeof settings.spacing.top === 'number') style.marginTop = settings.spacing.top;
    if (typeof settings.spacing.right === 'number') style.marginRight = settings.spacing.right;
    if (typeof settings.spacing.bottom === 'number') style.marginBottom = settings.spacing.bottom;
    if (typeof settings.spacing.left === 'number') style.marginLeft = settings.spacing.left;
  }

  // Style de bordure avec configuration complète - UNIQUEMENT pour les conteneurs
  if (isContainer && settings.border) {
    const { top, right, bottom, left, color, width = 1 } = settings.border;
    
    if (color) {
      style.borderColor = color;
    }

    // N'appliquer le style de bordure que si au moins un côté a une bordure
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

/**
 * Fonction d'aide pour les styles de conteneur
 * Maintient la compatibilité descendante tout en utilisant le nouveau système de style unifié
 */
export const getContainerStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  // Obtenir les styles de base du système unifié
  const baseStyles = getPdfStyles(pdfSettings, elementId, { isContainer: true });
  
  // Fusionner avec les styles supplémentaires (priorité la plus basse pour préserver les paramètres PDF)
  return { ...additionalStyles, ...baseStyles };
};

/**
 * Fonction d'aide pour les styles de texte
 * Maintient la compatibilité descendante tout en utilisant le nouveau système de style unifié
 */
export const getTextStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  // Obtenir les styles de base du système unifié
  const baseStyles = getPdfStyles(pdfSettings, elementId, { isContainer: false });
  
  // Fusionner avec les styles supplémentaires (priorité la plus basse pour préserver les paramètres PDF)
  return { ...additionalStyles, ...baseStyles };
};
