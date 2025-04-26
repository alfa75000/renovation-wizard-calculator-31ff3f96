
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';
import { CoverDocument } from '../components/CoverDocument';
import React from 'react';

export const useReactPdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  const { pdfSettings } = usePdfSettings();
  
  const generateReactPdf = async () => {
    try {
      setIsGenerating(true);
      
      if (!pdfSettings) {
        toast.error('Les paramètres PDF ne sont pas disponibles');
        return false;
      }
      
      // Génération du document PDF
      const blob = await pdf(
        React.createElement(CoverDocument, {
          pdfSettings: pdfSettings,
          projectState: state
        })
      ).toBlob();
      
      // Ouverture du PDF dans un nouvel onglet
      const url = URL.createObjectURL(blob);
      window.open(url);
      
      toast.success('PDF généré avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReactPdf
  };
};
