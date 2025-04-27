// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react'; // NECESSAIRE POUR LE JSX DU DOCUMENT
import { useState } from 'react';
import { pdf, Document } from '@react-pdf/renderer'; // Importe aussi Document
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Importe TOUS les composants de page que tu veux inclure
import { CoverDocumentContent } from '../components/CoverDocumentContent'; // Renomme CoverDocument pour clarifier que c'est le contenu
import { DetailsPage } from '../components/DetailsPage';
import { RecapPage } from '../components/RecapPage';
// Importe CGVPage quand elle sera prête
// import { CGVPage } from '../components/CGVPage';

export const useReactPdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  const { pdfSettings } = usePdfSettings();

  const generateReactPdf = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Génération du PDF en cours...', { id: 'pdf-gen' }); // Ajoute un indicateur de chargement

      if (!pdfSettings) {
        toast.error('Les paramètres PDF ne sont pas disponibles', { id: 'pdf-gen' });
        setIsGenerating(false); // N'oublie pas de reset ici
        return false;
      }
      if (!state || !state.metadata) { // Ajoute une vérification de base sur les données
          toast.error('Les données du projet sont incomplètes.', { id: 'pdf-gen' });
          setIsGenerating(false); 
          return false;
      }

      console.log("Génération PDF avec settings:", pdfSettings);
      console.log("Et state:", state);

      // Structure du Document PDF complet
      const MyPdfDocument = (
        <Document 
           title={`Devis ${state.metadata.devisNumber || 'Nouveau'}`} 
           author={state.metadata.company?.name || 'Mon Entreprise'}
           subject={`Devis N°${state.metadata.devisNumber}`}
           creator="Mon Application Devis" // Nom de ton appli
           producer="Mon Application Devis (@react-pdf/renderer)" // Info technique
        >
          {/* Page de Garde - Utilise le composant CoverDocumentContent SANS <Document> ni <Page> */}
          <CoverDocumentContent 
             pdfSettings={pdfSettings} 
             projectState={state} 
           />

          {/* Page(s) de Détails - Le composant DetailsPage contient déjà <Page> */}
          <DetailsPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
           />
           
          {/* Page(s) Récapitulative - Le composant RecapPage contient déjà <Page> */}
           <RecapPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
           />

          {/* Page(s) CGV - À ajouter quand le composant sera prêt */}
          {/* <CGVPage pdfSettings={pdfSettings} /> */}

        </Document>
      );

      // Génération du blob
      const blob = await pdf(MyPdfDocument).toBlob();

      // Ouverture dans un nouvel onglet
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // Ouvre dans un nouvel onglet

      toast.success('PDF généré avec succès', { id: 'pdf-gen' });
      return true;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      // Affiche une erreur plus détaillée si possible
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur PDF: ${errorMessage}`, { id: 'pdf-gen' });
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
