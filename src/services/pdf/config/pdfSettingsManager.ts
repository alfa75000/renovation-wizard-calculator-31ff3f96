
import { PdfSettings } from './pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { getElementSettings as getElementStyleSettings } from '../utils/styleUtils';

let currentSettings: PdfSettings | null = null;

/**
 * Définit les paramètres PDF globaux
 * @param settings - Paramètres PDF à définir
 */
export const setPdfSettings = (settings: PdfSettings) => {
  currentSettings = settings;
};

/**
 * Récupère les paramètres PDF globaux
 * @returns PdfSettings | null - Paramètres PDF actuels ou null si non définis
 */
export const getPdfSettings = (): PdfSettings | null => {
  return currentSettings;
};

/**
 * Efface les paramètres PDF globaux
 */
export const clearPdfSettings = () => {
  currentSettings = null;
};

/**
 * Récupère les paramètres de style d'un élément spécifique
 * @param elementId - ID de l'élément
 * @returns ElementSettings - Paramètres de style pour l'élément
 */
export const getElementSettings = (elementId: string): ElementSettings => {
  return getElementStyleSettings(elementId, currentSettings);
};
