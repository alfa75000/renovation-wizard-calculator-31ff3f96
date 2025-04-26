
import { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

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
    textAlign: 'left'
  };

  // Si aucun paramètre PDF n'est fourni, retourner les styles par défaut
  if (!pdfSettings?.elements) {
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

const applyElementSettingsToStyle = (baseStyle: Style, settings: ElementSettings): Style => {
  const style: Style = { ...baseStyle };

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
  
  if (settings.color) {
    style.color = settings.color;
  }
  
  if (settings.alignment) {
    style.textAlign = settings.alignment;
  }
  
  if (settings.fillColor) {
    style.backgroundColor = settings.fillColor;
  }
  
  if (settings.spacing) {
    if (settings.spacing.top !== undefined) style.marginTop = settings.spacing.top;
    if (settings.spacing.right !== undefined) style.marginRight = settings.spacing.right;
    if (settings.spacing.bottom !== undefined) style.marginBottom = settings.spacing.bottom;
    if (settings.spacing.left !== undefined) style.marginLeft = settings.spacing.left;
  }
  
  if (settings.border) {
    if (settings.border.top || settings.border.right || 
        settings.border.bottom || settings.border.left) {
      style.borderColor = settings.border.color || '#000000';
      style.borderStyle = 'solid';
      
      if (settings.border.top) {
        style.borderTopWidth = settings.border.width || 1;
      }
      if (settings.border.right) {
        style.borderRightWidth = settings.border.width || 1;
      }
      if (settings.border.bottom) {
        style.borderBottomWidth = settings.border.width || 1;
      }
      if (settings.border.left) {
        style.borderLeftWidth = settings.border.width || 1;
      }
    }
  }

  return style;
};

export const getContainerStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  const baseStyles = getElementPdfStyles(pdfSettings, elementId);
  return { ...baseStyles, ...additionalStyles };
};

export const getTextStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  const baseStyles = getElementPdfStyles(pdfSettings, elementId);
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
