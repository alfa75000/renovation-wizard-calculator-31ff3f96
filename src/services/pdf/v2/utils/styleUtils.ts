import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

export interface StyleOptions {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  margins?: [number, number, number, number]; // [top, right, bottom, left]
  padding?: [number, number, number, number]; // [top, right, bottom, left]
  fillColor?: string;
  border?: boolean | {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    color?: string;
    width?: number;
  };
}

export const getElementStyle = (pdfSettings: PdfSettings, elementId: string): StyleOptions => {
  const defaultStyle: StyleOptions = {
    fontFamily: ensureSupportedFont(pdfSettings.fontFamily),
    fontSize: 12,
    bold: false,
    italic: false,
    color: pdfSettings.colors.mainText || '#333333',
    alignment: 'left',
    margins: [0, 0, 0, 0],
    padding: [0, 0, 0, 0]
  };

  if (!pdfSettings.elements || !pdfSettings.elements[elementId]) {
    return defaultStyle;
  }

  const elementSettings = pdfSettings.elements[elementId] as ElementSettings;
  
  return {
    fontFamily: ensureSupportedFont(elementSettings.fontFamily) || defaultStyle.fontFamily,
    fontSize: elementSettings.fontSize || defaultStyle.fontSize,
    bold: elementSettings.isBold || defaultStyle.bold,
    italic: elementSettings.isItalic || defaultStyle.italic,
    color: elementSettings.color || defaultStyle.color,
    alignment: elementSettings.alignment || defaultStyle.alignment,
    margins: [
      elementSettings.spacing?.top || 0,
      elementSettings.spacing?.right || 0,
      elementSettings.spacing?.bottom || 0,
      elementSettings.spacing?.left || 0
    ],
    padding: [0, 0, 0, 0], // Default padding
    fillColor: elementSettings.fillColor,
    border: elementSettings.border ? {
      top: elementSettings.border.top || false,
      right: elementSettings.border.right || false,
      bottom: elementSettings.border.bottom || false,
      left: elementSettings.border.left || false,
      color: elementSettings.border.color || '#000000',
      width: elementSettings.border.width || 1,
    } : false
  };
};

export const convertStyleToPdfStyle = (style: StyleOptions) => {
  const pdfStyle: any = {
    font: ensureSupportedFont(style.fontFamily),
    fontSize: style.fontSize,
    bold: style.bold,
    italics: style.italic,
    color: style.color,
    alignment: style.alignment,
    margin: style.margins || [0, 0, 0, 0],
    fillColor: style.fillColor
  };

  // Handle padding separately as it needs to be applied to table cells
  if (style.padding) {
    pdfStyle.padding = style.padding;
  }

  // Handle border configuration
  if (style.border) {
    if (typeof style.border === 'boolean') {
      pdfStyle.border = style.border ? [1, 1, 1, 1] : undefined;
    } else {
      pdfStyle.border = [
        style.border.top ? (style.border.width || 1) : 0,
        style.border.right ? (style.border.width || 1) : 0,
        style.border.bottom ? (style.border.width || 1) : 0,
        style.border.left ? (style.border.width || 1) : 0
      ];
      
      if (style.border.color) {
        pdfStyle.borderColor = [
          style.border.color,
          style.border.color,
          style.border.color,
          style.border.color
        ];
      }
    }
  }

  return pdfStyle;
};

export type MarginTuple = [number, number, number, number];

export const convertPageMargins = (margins: number[] | undefined): number[] => { 
  const defaultMargins: MarginTuple = [40, 40, 40, 40]; 

  if (!margins || !Array.isArray(margins) || margins.length === 0) {
    console.warn('Invalid or empty margins format, using defaults [40, 40, 40, 40]');
    return defaultMargins.slice(0); // Return a copy to avoid accidental mutations
  }

  const resultMargins: number[] = [
    typeof margins[0] === 'number' ? margins[0] : defaultMargins[0],
    typeof margins[1] === 'number' ? margins[1] : defaultMargins[1],
    typeof margins[2] === 'number' ? margins[2] : defaultMargins[2],
    typeof margins[3] === 'number' ? margins[3] : defaultMargins[3]
  ];
  
  return resultMargins.slice(0, 4);
};
