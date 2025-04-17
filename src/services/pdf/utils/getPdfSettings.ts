
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';
import { supabase } from '@/lib/supabase';
import { getUserPdfSettings } from '@/services/pdfGenerationService';

// Fonction d'utilitaire pour obtenir les paramètres PDF
export const getPdfSettings = async (userId?: string): Promise<PdfSettings> => {
  try {
    return await getUserPdfSettings(userId);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres PDF:', error);
    return PdfSettingsSchema.parse({});
  }
};
