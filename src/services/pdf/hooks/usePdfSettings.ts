
import { useState, useCallback, useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';
import { toast } from 'sonner';

export const usePdfSettings = () => {
  const { currentUser, appState, updatePdfSettings: updateAppStatePdfSettings } = useAppState();
  const [pdfSettings, setPdfSettings] = useState<PdfSettings>(() => {
    try {
      if (!appState?.pdf_settings) {
        console.log("Aucun paramètre PDF trouvé, utilisation des valeurs par défaut");
        return PdfSettingsSchema.parse({});
      }
      
      // Valider les données avec le schéma Zod
      console.log("Paramètres PDF trouvés dans appState:", appState.pdf_settings);
      return PdfSettingsSchema.parse(appState.pdf_settings);
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
        console.log("Mise à jour des paramètres PDF depuis appState:", appState.pdf_settings);
        const validatedSettings = PdfSettingsSchema.parse(appState.pdf_settings);
        setPdfSettings(validatedSettings);
        
        // Vérifier si des éléments sont définis
        if (validatedSettings.elements && Object.keys(validatedSettings.elements).length > 0) {
          console.log("Éléments personnalisés trouvés:", Object.keys(validatedSettings.elements));
          // Ajout d'un log détaillé pour débogage
          Object.entries(validatedSettings.elements).forEach(([key, element]) => {
            console.log(`Element ${key}:`, element);
          });
        } else {
          console.log("Aucun élément personnalisé trouvé");
        }
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

      console.log("Mise à jour des paramètres PDF:", updatedSettings);
      
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
