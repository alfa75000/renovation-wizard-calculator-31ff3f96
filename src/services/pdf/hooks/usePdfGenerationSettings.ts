
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';

/**
 * Hook qui récupère les paramètres PDF directement depuis Supabase
 * pour être utilisé dans les services de génération PDF
 */
export const usePdfGenerationSettings = async (userId?: string): Promise<PdfSettings> => {
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
    return PdfSettingsSchema.parse(data?.pdf_settings || {});
  } catch (error) {
    console.error('Exception lors de la récupération des paramètres PDF:', error);
    return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
  }
};
