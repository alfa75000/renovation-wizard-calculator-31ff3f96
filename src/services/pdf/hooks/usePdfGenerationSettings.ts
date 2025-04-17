
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';

/**
 * Hook qui récupère les paramètres PDF directement depuis Supabase
 * pour être utilisé dans les services de génération PDF
 */
export const usePdfGenerationSettings = (userId?: string) => {
  const [settings, setSettings] = useState<PdfSettings>(PdfSettingsSchema.parse({}));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) {
        console.warn('Aucun ID utilisateur fourni pour récupérer les paramètres PDF');
        setSettings(PdfSettingsSchema.parse({}));
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('app_state')
          .select('pdf_settings')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error('Erreur lors de la récupération des paramètres PDF:', error);
          setError(error);
          setSettings(PdfSettingsSchema.parse({}));
        } else {
          setSettings(PdfSettingsSchema.parse(data?.pdf_settings || {}));
        }
      } catch (err) {
        console.error('Exception lors de la récupération des paramètres PDF:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setSettings(PdfSettingsSchema.parse({}));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  return { settings, isLoading, error };
};
