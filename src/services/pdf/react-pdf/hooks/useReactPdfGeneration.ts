
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';
import { CoverDocument } from '../components/CoverDocument';

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
      
      const blob = await pdf(
        <CoverDocument
          pdfSettings={pdfSettings}
          projectState={state}
        />
      ).toBlob();
      
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
