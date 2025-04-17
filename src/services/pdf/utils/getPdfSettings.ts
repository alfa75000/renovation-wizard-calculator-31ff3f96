
import { supabase } from '@/lib/supabase';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';

/**
 * Fonction utilitaire qui récupère les paramètres PDF directement depuis Supabase
 * de manière synchrone pour être utilisée dans les services de génération PDF
 */
export const getPdfSettings = async (userId?: string): Promise<PdfSettings> => {
  try {
    if (!userId) {
      console.warn('Aucun ID utilisateur fourni pour récupérer les paramètres PDF');
      return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
    }

    const { data, error } = await supabase
      .from('app_state')
      .select('pdf_settings')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération des paramètres PDF:', error);
      return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
    }
    
    // Valider les données avec Zod
    const pdfSettings = PdfSettingsSchema.parse(data?.pdf_settings || {});
    console.log('Paramètres PDF récupérés:', pdfSettings);
    return pdfSettings;
  } catch (error) {
    console.error('Exception lors de la récupération des paramètres PDF:', error);
    return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
  }
};
