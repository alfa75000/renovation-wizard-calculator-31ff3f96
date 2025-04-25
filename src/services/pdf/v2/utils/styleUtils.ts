import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

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
    fontFamily: pdfSettings.fontFamily || 'Roboto',
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
    fontFamily: elementSettings.fontFamily || defaultStyle.fontFamily,
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
  return {
    font: style.fontFamily,
    fontSize: style.fontSize,
    bold: style.bold,
    italics: style.italic,
    color: style.color,
    alignment: style.alignment,
    margin: style.margins,
    padding: style.padding,
    fillColor: style.fillColor,
    border: style.border === false ? undefined : [
      style.border === true || (style.border as any)?.top ? (style.border as any)?.width || 1 : 0,
      style.border === true || (style.border as any)?.right ? (style.border as any)?.width || 1 : 0,
      style.border === true || (style.border as any)?.bottom ? (style.border as any)?.width || 1 : 0,
      style.border === true || (style.border as any)?.left ? (style.border as any)?.width || 1 : 0
    ]
  };
};

export type MarginTuple = [number, number, number, number];

export const convertPageMargins = (margins: number[] | undefined): MarginTuple => {
  const defaultMargins: MarginTuple = [40, 40, 40, 40];
  
  if (!margins || !Array.isArray(margins) || margins.length < 4) {
    console.warn('Invalid margins format, using defaults');
    return defaultMargins;
  }
  
  const validMargins: MarginTuple = [
    Number(margins[0]) || defaultMargins[0],
    Number(margins[1]) || defaultMargins[1],
    Number(margins[2]) || defaultMargins[2],
    Number(margins[3]) || defaultMargins[3]
  ];
  
  return validMargins;
};
