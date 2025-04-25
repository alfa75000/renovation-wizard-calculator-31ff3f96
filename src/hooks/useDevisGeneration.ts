
import { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { generateInsuranceInfoPdf } from '@/services/pdf/v2/generators/insuranceInfoGenerator';
import { toast } from 'sonner';

export const useDevisGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  const { pdfSettings } = usePdfSettings();
  
  const generateInsuranceInfo = async () => {
    try {
      setIsGenerating(true);
      
      if (!pdfSettings) {
        toast.error('Les paramètres PDF ne sont pas disponibles');
        return false;
      }
      
      await generateInsuranceInfoPdf(pdfSettings, state);
      toast.success('Section "Informations d\'assurance" générée avec succès');
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
    generateInsuranceInfo
  };
};
