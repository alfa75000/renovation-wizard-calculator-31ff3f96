
import { PdfSettings } from './pdfSettingsTypes';

// Variable globale pour stocker les paramètres
let currentPdfSettings: PdfSettings | null = null;

// Fonction pour définir les paramètres
export const setPdfSettingsForGeneration = (settings: PdfSettings) => {
  currentPdfSettings = settings;
};

// Fonction pour obtenir les paramètres
export const getPdfSettings = (): PdfSettings | null => {
  return currentPdfSettings;
};
