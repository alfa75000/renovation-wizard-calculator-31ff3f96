
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

export type MarginTuple = [number, number, number, number];

export const convertPageMargins = (margins: number[] | undefined): MarginTuple => { 
  const defaultMargins: MarginTuple = [40, 40, 40, 40]; 

  if (!margins || !Array.isArray(margins) || margins.length === 0) {
    console.warn('Invalid or empty margins format, using defaults [40, 40, 40, 40]');
    return defaultMargins;
  }

  // Create the tuple with valid values or defaults
  return [
    typeof margins[0] === 'number' ? margins[0] : defaultMargins[0],
    typeof margins[1] === 'number' ? margins[1] : defaultMargins[1],
    typeof margins[2] === 'number' ? margins[2] : defaultMargins[2],
    typeof margins[3] === 'number' ? margins[3] : defaultMargins[3]
  ];
};
