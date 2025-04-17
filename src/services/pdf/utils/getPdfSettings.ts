
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';
import { getUserPdfSettings } from '@/services/pdfGenerationService';

/**
 * Récupère les paramètres PDF pour un utilisateur donné
 * Si aucun ID utilisateur n'est fourni, utilise les paramètres par défaut
 * 
 * @param userId ID de l'utilisateur
 * @returns Paramètres PDF récupérés ou par défaut
 */
export const getPdfSettings = async (userId?: string): Promise<PdfSettings> => {
  if (!userId) {
    console.log('Utilisation des paramètres PDF par défaut (aucun ID utilisateur)');
    return PdfSettingsSchema.parse({});
  }
  
  try {
    const settings = await getUserPdfSettings(userId);
    console.log('Paramètres PDF récupérés avec succès:', settings);
    return settings;
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres PDF:', error);
    console.log('Utilisation des paramètres PDF par défaut suite à une erreur');
    return PdfSettingsSchema.parse({});
  }
};
