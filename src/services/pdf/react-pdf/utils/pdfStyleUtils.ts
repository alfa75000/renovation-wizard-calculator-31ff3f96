
import { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

// Types for style options
type PdfStyleOptions = {
  isContainer?: boolean;
  inheritParentStyles?: boolean;
};

/**
 * Core function that generates PDF styles from settings
 * Properly handles style inheritance:
 * Base Styles < Default Element Settings < Specific Element Settings
 */
export const getPdfStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  options: PdfStyleOptions = {}
): Style => {
  const { isContainer = false, inheritParentStyles = true } = options;

  // Most minimal base styles - should almost never override anything
  const baseStyles: Style = {
    ...(inheritParentStyles && {
      textAlign: 'left'
    })
  };

  if (!pdfSettings?.elements) {
    return baseStyles;
  }

  // First apply default settings if available
  const defaultSettings = pdfSettings.elements['default'];
  const defaultStyles = defaultSettings
    ? applyElementSettingsToStyle({}, defaultSettings, isContainer)
    : {};

  // Then merge with element-specific settings (priority)
  const elementSettings = pdfSettings.elements[elementId];
  const elementSpecificStyles = elementSettings
    ? applyElementSettingsToStyle({}, elementSettings, isContainer)
    : {};

  // Apply the styles in the correct priority order:
  // Base styles (lowest priority) < Default styles < Element-specific styles (highest priority)
  return {
    ...baseStyles,
    ...defaultStyles,
    ...elementSpecificStyles
  };
};

/**
 * Converts ElementSettings object to React-PDF Style object
 * Ensuring proper mapping of all properties
 */
const applyElementSettingsToStyle = (
  baseStyle: Style,
  settings: ElementSettings,
  isContainer: boolean
): Style => {
  const style: Style = { ...baseStyle };

  // Text styling - directly mapping to React-PDF properties
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

  // Background styling
  if (settings.fillColor) {
    style.backgroundColor = settings.fillColor;
  }

  // Spacing (margin) - converting from custom spacing object to React-PDF margins
  if (settings.spacing) {
    if (typeof settings.spacing.top === 'number') style.marginTop = settings.spacing.top;
    if (typeof settings.spacing.right === 'number') style.marginRight = settings.spacing.right;
    if (typeof settings.spacing.bottom === 'number') style.marginBottom = settings.spacing.bottom;
    if (typeof settings.spacing.left === 'number') style.marginLeft = settings.spacing.left;
  }

  // Border styling with full configuration
  if (settings.border) {
    const { top, right, bottom, left, color, width = 1 } = settings.border;
    
    if (color) {
      style.borderColor = color;
    }

    // Only apply border style if at least one side has a border
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
 * Helper function for container styles
 * Keeps backward compatibility while using the new unified style system
 */
export const getContainerStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  // Get base styles from the unified system
  const baseStyles = getPdfStyles(pdfSettings, elementId, { isContainer: true });
  
  // Merge with any additional styles (lowest priority to preserve PDF settings)
  return { ...additionalStyles, ...baseStyles };
};

/**
 * Helper function for text styles
 * Keeps backward compatibility while using the new unified style system
 */
export const getTextStyles = (
  pdfSettings: PdfSettings | null | undefined,
  elementId: PdfElementId,
  additionalStyles: Style = {}
): Style => {
  // Get base styles from the unified system
  const baseStyles = getPdfStyles(pdfSettings, elementId, { isContainer: false });
  
  // Merge with any additional styles (lowest priority to preserve PDF settings)
  return { ...additionalStyles, ...baseStyles };
};
