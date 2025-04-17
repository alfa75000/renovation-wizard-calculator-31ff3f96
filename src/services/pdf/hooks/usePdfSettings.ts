
import { useState, useCallback, useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';
import { toast } from 'sonner';

export const usePdfSettings = () => {
  const { currentUser, appState, updatePdfSettings: updateAppStatePdfSettings } = useAppState();
  const [pdfSettings, setPdfSettings] = useState<PdfSettings>(() => {
    try {
      // Valider les données avec le schéma Zod
      return PdfSettingsSchema.parse(appState?.pdf_settings || {});
    } catch (error) {
      console.error("Erreur de validation des paramètres PDF:", error);
      // Retourner les valeurs par défaut en cas d'erreur
      return PdfSettingsSchema.parse({});
    }
  });

  // S'assurer que les paramètres sont mis à jour quand l'état de l'application change
  useEffect(() => {
    if (appState?.pdf_settings) {
      try {
        const validatedSettings = PdfSettingsSchema.parse(appState.pdf_settings);
        setPdfSettings(validatedSettings);
      } catch (error) {
        console.error("Erreur lors de la validation des paramètres PDF depuis l'appState:", error);
        // En cas d'erreur, rester avec les paramètres actuels
      }
    }
  }, [appState?.pdf_settings]);

  const updatePdfSettings = useCallback(async (newSettings: Partial<PdfSettings>) => {
    if (!currentUser) {
      toast.error('Aucun utilisateur connecté');
      return false;
    }

    try {
      // Valider les paramètres mis à jour avec le schéma Zod
      const updatedSettings = PdfSettingsSchema.parse({
        ...pdfSettings,
        ...newSettings
      });

      // Mettre à jour l'état local
      setPdfSettings(updatedSettings);
      
      // Persister les changements via useAppState
      const success = await updateAppStatePdfSettings(updatedSettings);
      
      if (success) {
        toast.success('Paramètres PDF mis à jour');
      }
      
      return success;
    } catch (error) {
      console.error('Erreur lors de la validation des paramètres PDF:', error);
      toast.error('Paramètres PDF invalides');
      return false;
    }
  }, [currentUser, pdfSettings, updateAppStatePdfSettings]);

  const resetPdfSettings = useCallback(async () => {
    // Utiliser les valeurs par défaut du schéma
    const defaultSettings = PdfSettingsSchema.parse({});
    return updatePdfSettings(defaultSettings);
  }, [updatePdfSettings]);

  return {
    pdfSettings,
    updatePdfSettings,
    resetPdfSettings
  };
};
