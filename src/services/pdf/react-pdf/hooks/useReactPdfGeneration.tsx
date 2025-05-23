// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer'; 
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
import { DetailsPage } from '../components/DetailsPage';
import { RecapPage } from '../components/RecapPage';
// Import du composant CGVPage
import { CGVPage } from '../components/CGVPage';
import { PageFooter } from '../components/common/PageFooter'; 

import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 

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

      const coverMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.cover as number[] | undefined
      );
      
      // Utilisez la même approche que DetailsPage.tsx - ajout d'espace fixe pour le footer
      const footerSpace = 50; // Le même que dans DetailsPage.tsx
      const pagePaddingBottom = coverMargins[2] + footerSpace;

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
                paddingBottom: pagePaddingBottom, // Même approche que DetailsPage.tsx
                paddingLeft: coverMargins[3]
              }
            ]}
           >
             {/* Contenu principal - IMPORTANT : Enveloppé dans une View pour éviter les espaces textuels */}
             <View style={styles.contentWrapper}>
               <CoverDocumentContent 
                  pdfSettings={pdfSettings} 
                  projectState={state} 
               />
             </View>
             
             {/* Footer - utiliser le même PageFooter que les autres pages */}
             <PageFooter 
               pdfSettings={pdfSettings} 
               company={state.metadata.company}
             />
          </Page>

          {/* === PAGE(S) 2...N : Détails === */}
          <DetailsPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
          />
           
          {/* === PAGE(S) N+1...M : Récap === */}
           <RecapPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
           />

          {/* === PAGE(S) M+1... : CGV === */}
          <CGVPage 
            pdfSettings={pdfSettings} 
            projectState={state}
          />

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

// Styles simplifiés
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
});