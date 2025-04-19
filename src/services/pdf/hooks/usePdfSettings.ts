
import { useState, useEffect } from 'react';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { DEFAULT_FONT } from '../constants/pdfConstants';

export const usePdfSettings = () => {
  const [pdfSettings, setPdfSettings] = useState<PdfSettings>(() => {
    // Récupérer les paramètres PDF du localStorage s'ils existent
    const storedSettings = localStorage.getItem('pdf_settings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        
        // Vérifier si nous avons un logo stocké
        const storedLogo = localStorage.getItem('lrs_logo_data_url');
        if (storedLogo && (!parsed.logoSettings || !parsed.logoSettings.logoUrl)) {
          parsed.logoSettings = parsed.logoSettings || {};
          parsed.logoSettings.logoUrl = storedLogo;
        }
        
        return parsed;
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres PDF:', e);
      }
    }
    
    // Paramètres par défaut
    return {
      fontFamily: DEFAULT_FONT,
      fontSize: 10,
      margins: {
        cover: { top: 20, right: 20, bottom: 20, left: 20 },
        details: { top: 20, right: 20, bottom: 20, left: 20 },
        recap: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      logoSettings: {
        useDefaultLogo: true,
        logoUrl: localStorage.getItem('lrs_logo_data_url') || null,
        width: 172,
        height: 72,
        alignment: 'left',
      },
    };
  });

  useEffect(() => {
    // Sauvegarder les paramètres dans le localStorage à chaque modification
    localStorage.setItem('pdf_settings', JSON.stringify(pdfSettings));
  }, [pdfSettings]);

  const updatePdfSettings = async (newSettings: Partial<PdfSettings>): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setPdfSettings((prevSettings) => {
        const updatedSettings: PdfSettings = {
          ...prevSettings,
          ...newSettings,
          logoSettings: {
            ...prevSettings.logoSettings,
            ...(newSettings.logoSettings || {}),
          },
          margins: {
            ...prevSettings.margins,
            ...(newSettings.margins || {}),
          },
        };
        localStorage.setItem('pdf_settings', JSON.stringify(updatedSettings));
        resolve(true);
        return updatedSettings;
      });
    });
  };

  // Ajout de la fonction resetPdfSettings pour réinitialiser les paramètres
  const resetPdfSettings = async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const defaultSettings: PdfSettings = {
        fontFamily: DEFAULT_FONT,
        fontSize: 10,
        margins: {
          cover: { top: 20, right: 20, bottom: 20, left: 20 },
          details: { top: 20, right: 20, bottom: 20, left: 20 },
          recap: { top: 20, right: 20, bottom: 20, left: 20 }
        },
        logoSettings: {
          useDefaultLogo: true,
          logoUrl: localStorage.getItem('lrs_logo_data_url') || null,
          width: 172,
          height: 72,
          alignment: 'left',
        },
      };
      
      setPdfSettings(defaultSettings);
      localStorage.setItem('pdf_settings', JSON.stringify(defaultSettings));
      console.log('Paramètres PDF réinitialisés aux valeurs par défaut');
      resolve(true);
    });
  };

  return { pdfSettings, updatePdfSettings, resetPdfSettings };
};
