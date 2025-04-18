
import { PdfSettings } from './pdfSettingsTypes';

let currentSettings: PdfSettings | null = null;

export const setPdfSettings = (settings: PdfSettings) => {
  currentSettings = settings;
};

export const getPdfSettings = (): PdfSettings | null => {
  return currentSettings;
};

export const clearPdfSettings = () => {
  currentSettings = null;
};
