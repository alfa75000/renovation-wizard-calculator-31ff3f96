
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/hooks/useAppState';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';
import { toast } from 'sonner';

export const usePdfSettings = () => {
  const { currentUser, appState } = useAppState();
  const [pdfSettings, setPdfSettings] = useState<PdfSettings>(
    PdfSettingsSchema.parse(appState?.pdf_settings || {})
  );

  const updatePdfSettings = useCallback(async (newSettings: Partial<PdfSettings>) => {
    if (!currentUser) {
      toast.error('Aucun utilisateur connecté');
      return false;
    }

    try {
      const updatedSettings = PdfSettingsSchema.parse({
        ...pdfSettings,
        ...newSettings
      });

      const { error } = await supabase
        .from('app_state')
        .update({ pdf_settings: updatedSettings })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setPdfSettings(updatedSettings);
      toast.success('Paramètres PDF mis à jour');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres PDF:', error);
      toast.error('Impossible de mettre à jour les paramètres PDF');
      return false;
    }
  }, [currentUser, pdfSettings]);

  const resetPdfSettings = useCallback(async () => {
    const defaultSettings = PdfSettingsSchema.parse({});
    return updatePdfSettings(defaultSettings);
  }, [updatePdfSettings]);

  return {
    pdfSettings,
    updatePdfSettings,
    resetPdfSettings
  };
};
