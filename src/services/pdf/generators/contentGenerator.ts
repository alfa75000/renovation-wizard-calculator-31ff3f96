
import { Content } from 'pdfmake/interfaces';
import { PDF_TEXTS } from '../pdfConstants';
import { getPdfSettings } from '../config/pdfSettingsManager';

export const generateSignatureContent = (): Content[] => {
  const settings = getPdfSettings();
  const elements = [];
  
  elements.push({
    text: PDF_TEXTS.SIGNATURE.CONTENT,
    fontSize: settings?.fontSize?.signature || 8,
    margin: [0, 0, 0, 5]
  });
  
  PDF_TEXTS.SIGNATURE.POINTS.forEach(point => {
    elements.push({
      text: point.text,
      bold: point.bold,
      fontSize: settings?.fontSize?.signature || 8,
      margin: [0, 3, 0, 0]
    });
  });
  
  return elements;
};

export const generateSalutationContent = (): Content => {
  const settings = getPdfSettings();
  return {
    text: PDF_TEXTS.SALUTATION,
    fontSize: settings?.fontSize?.salutation || 9,
    margin: [0, 10, 0, 0],
    alignment: 'justify'
  };
};
