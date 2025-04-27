// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page } from '@react-pdf/renderer'; 
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Imports des composants de contenu (sans les balises Page)
import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
import { DetailsPageContent } from '../components/DetailsPageContent';
import { RecapPageContent } from '../components/RecapPageContent';
// import { CGVPageContent } from '../components/CGVPageContent';

// Imports des utilitaires
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 
import { StyleSheet } from '@react-pdf/renderer'; 

export const useReactPdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  const { pdfSettings } = usePdfSettings();

  const generateReactPdf = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Génération du PDF en cours...', { id: 'pdf-gen' }); 

      if (!pdfSettings || !state || !state.metadata) {
        toast.error('Données ou paramètres PDF manquants.', { id: 'pdf-gen' });
        setIsGenerating(false); 
        return false;
      }

      console.log("Génération PDF avec settings:", pdfSettings);
      console.log("Et state:", state);

      // Calcul des marges pour la page de garde
      const coverMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.cover as number[] | undefined
       );
       
      // Calcul des marges pour les autres pages
      const detailsMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.details as number[] | undefined
       );
       
      const recapMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.recap as number[] | undefined
       );

      // Structure du Document PDF complet
      const MyPdfDocument = (
        <Document 
          title={`Devis ${state.metadata.devisNumber || 'Nouveau'}`} 
          author={state.metadata.company?.name || 'Mon Entreprise'}
          subject={`Devis N°${state.metadata.devisNumber}`}
          creator="Mon Application Devis" 
          producer="Mon Application Devis (@react-pdf/renderer)" 
        >
          {/* === PAGE 1 : Page de Garde === */}
          <Page 
            size="A4" 
            style={[
              styles.page,
              {
                paddingTop: coverMargins[0],
                paddingRight: coverMargins[1],
                paddingBottom: coverMargins[2],
                paddingLeft: coverMargins[3]
              }
            ]}
          >
             <CoverDocumentContent 
                pdfSettings={pdfSettings} 
                projectState={state} 
             />
          </Page>

          {/* === PAGE 2... : Détails === */}
          {/* IMPORTANT: Intégrez le contenu directement dans une balise Page ici */}
          <Page 
            size="A4" 
            style={[
              styles.page,
              {
                paddingTop: detailsMargins[0],
                paddingRight: detailsMargins[1],
                paddingBottom: detailsMargins[2],
                paddingLeft: detailsMargins[3]
              }
            ]}
          >
            <DetailsPageContent 
              pdfSettings={pdfSettings} 
              projectState={state} 
            />
          </Page>
           
          {/* === PAGE N+1... : Récap === */}
          {/* IMPORTANT: Intégrez le contenu directement dans une balise Page ici */}
          <Page 
            size="A4" 
            style={[
              styles.page,
              {
                paddingTop: recapMargins[0],
                paddingRight: recapMargins[1],
                paddingBottom: recapMargins[2],
                paddingLeft: recapMargins[3]
              }
            ]}
          >
            <RecapPageContent 
              pdfSettings={pdfSettings} 
              projectState={state} 
            />
          </Page>

          {/* === PAGE M+1... : CGV === */}
          {/* 
          <Page size="A4" style={styles.page}>
            <CGVPageContent pdfSettings={pdfSettings} />
          </Page>
          */}

        </Document>
      );

      // Génération du blob
      const blob = await pdf(MyPdfDocument).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); 
      toast.success('PDF généré avec succès', { id: 'pdf-gen' });
      return true;

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
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

// Styles locaux pour la page
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column'
  },
  contentGrower: {
    flexGrow: 1 
  }
});