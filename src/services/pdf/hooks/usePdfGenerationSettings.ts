
import { useState, useEffect, useCallback } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { PdfSettings, PdfSettingsSchema } from '../config/pdfSettingsTypes';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

/**
 * Hook central pour gérer les paramètres de génération PDF
 * Stocke les paramètres en mémoire et les charge/sauvegarde dans la base de données
 */
export const usePdfGenerationSettings = () => {
  const { currentUser, appState } = useAppState();
  const [pdfSettings, setPdfSettings] = useState<PdfSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres depuis l'état de l'application au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        console.log('[usePdfGenerationSettings] Chargement des paramètres PDF');
        
        // Si on a déjà des paramètres dans l'appState, on les utilise
        if (appState?.pdf_settings) {
          console.log('[usePdfGenerationSettings] Paramètres trouvés dans appState:', appState.pdf_settings);
          try {
            // Validation avec Zod
            const validatedSettings = PdfSettingsSchema.parse(appState.pdf_settings);
            setPdfSettings(validatedSettings);
            console.log('[usePdfGenerationSettings] Paramètres validés et définis:', validatedSettings);
          } catch (error) {
            console.error('[usePdfGenerationSettings] Erreur de validation:', error);
            // En cas d'erreur, on utilise les valeurs par défaut
            const defaultSettings = PdfSettingsSchema.parse({});
            setPdfSettings(defaultSettings);
            console.log('[usePdfGenerationSettings] Utilisation des paramètres par défaut:', defaultSettings);
          }
        } else if (currentUser?.id) {
          // Si on n'a pas de paramètres mais qu'on a un utilisateur, on essaie de les récupérer depuis la base
          console.log('[usePdfGenerationSettings] Récupération des paramètres depuis la base pour l\'utilisateur:', currentUser.id);
          const { data, error } = await supabase
            .from('app_state')
            .select('pdf_settings')
            .eq('user_id', currentUser.id)
            .single();

          if (error) {
            console.error('[usePdfGenerationSettings] Erreur lors de la récupération:', error);
            // En cas d'erreur, on utilise les valeurs par défaut
            const defaultSettings = PdfSettingsSchema.parse({});
            setPdfSettings(defaultSettings);
            setError('Erreur lors de la récupération des paramètres. Utilisation des valeurs par défaut.');
          } else if (data?.pdf_settings) {
            try {
              console.log('[usePdfGenerationSettings] Données récupérées:', data.pdf_settings);
              // Validation avec Zod
              const validatedSettings = PdfSettingsSchema.parse(data.pdf_settings);
              setPdfSettings(validatedSettings);
              console.log('[usePdfGenerationSettings] Paramètres validés et définis:', validatedSettings);
            } catch (validationError) {
              console.error('[usePdfGenerationSettings] Erreur de validation:', validationError);
              // En cas d'erreur, on utilise les valeurs par défaut
              const defaultSettings = PdfSettingsSchema.parse({});
              setPdfSettings(defaultSettings);
              setError('Format de paramètres invalide. Utilisation des valeurs par défaut.');
            }
          } else {
            // Pas de paramètres trouvés, utilisation des valeurs par défaut
            console.log('[usePdfGenerationSettings] Aucun paramètre trouvé, utilisation des valeurs par défaut');
            const defaultSettings = PdfSettingsSchema.parse({});
            setPdfSettings(defaultSettings);
          }
        } else {
          // Pas d'utilisateur connecté, utilisation des valeurs par défaut
          console.log('[usePdfGenerationSettings] Aucun utilisateur connecté, utilisation des valeurs par défaut');
          const defaultSettings = PdfSettingsSchema.parse({});
          setPdfSettings(defaultSettings);
        }
      } catch (e) {
        console.error('[usePdfGenerationSettings] Exception non gérée:', e);
        setError('Une erreur inattendue est survenue. Utilisation des valeurs par défaut.');
        // En cas d'erreur, on utilise les valeurs par défaut
        const defaultSettings = PdfSettingsSchema.parse({});
        setPdfSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [appState?.pdf_settings, currentUser?.id]);

  // Fonction pour mettre à jour les paramètres
  const updatePdfSettings = useCallback(async (newSettings: Partial<PdfSettings>): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Aucun utilisateur connecté');
      return false;
    }

    try {
      console.log('[usePdfGenerationSettings] Mise à jour des paramètres:', newSettings);
      
      // Fusion des paramètres existants avec les nouveaux
      const updatedSettings = pdfSettings 
        ? { ...pdfSettings, ...newSettings }
        : PdfSettingsSchema.parse(newSettings);
        
      // Validation avec Zod
      const validatedSettings = PdfSettingsSchema.parse(updatedSettings);
      
      console.log('[usePdfGenerationSettings] Paramètres validés:', validatedSettings);
      
      // Mise à jour dans la base de données
      const { error } = await supabase
        .from('app_state')
        .update({ pdf_settings: validatedSettings })
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error('[usePdfGenerationSettings] Erreur lors de la mise à jour dans la base:', error);
        toast.error('Erreur lors de la sauvegarde des paramètres');
        return false;
      }
      
      // Mise à jour de l'état local
      setPdfSettings(validatedSettings);
      console.log('[usePdfGenerationSettings] Paramètres mis à jour avec succès:', validatedSettings);
      toast.success('Paramètres PDF mis à jour');
      return true;
    } catch (error) {
      console.error('[usePdfGenerationSettings] Erreur lors de la validation/mise à jour:', error);
      toast.error('Paramètres PDF invalides');
      return false;
    }
  }, [currentUser, pdfSettings]);

  // Fonction pour réinitialiser les paramètres
  const resetPdfSettings = useCallback(async (): Promise<boolean> => {
    console.log('[usePdfGenerationSettings] Réinitialisation des paramètres');
    // Utiliser les valeurs par défaut du schéma
    const defaultSettings = PdfSettingsSchema.parse({});
    return updatePdfSettings(defaultSettings);
  }, [updatePdfSettings]);

  // Fonction utilitaire pour obtenir les paramètres actuels ou par défaut
  const getCurrentSettings = useCallback((): PdfSettings => {
    if (pdfSettings) {
      return pdfSettings;
    }
    
    console.log('[usePdfGenerationSettings] Aucun paramètre défini, retour aux valeurs par défaut');
    return PdfSettingsSchema.parse({});
  }, [pdfSettings]);

  return {
    pdfSettings: getCurrentSettings(),
    isLoading,
    error,
    updatePdfSettings,
    resetPdfSettings
  };
};
