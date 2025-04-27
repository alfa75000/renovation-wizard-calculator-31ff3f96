// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, StyleSheet, View } from '@react-pdf/renderer'; 
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
import { DetailsPage } from '../components/DetailsPage';
import { RecapPage } from '../components/RecapPage';
import { CoverFooterSection } from '../components/CoverFooterSection'; // Importe le footer spécifique
// import { CGVPage } from '../components/CGVPage';

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
       // Ajuste cette valeur si ton footer a une hauteur différente
       const coverPaddingBottom = coverMargins[2] + 50; 

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
                paddingBottom: coverPaddingBottom, 
                paddingLeft: coverMargins[3]
              }
            ]}
           >
             {/* Contenu */}
             <CoverDocumentContent 
                pdfSettings={pdfSettings} 
                projectState={state} 
             />
             {/* Pousseur */}
             <View style={styles.contentGrower} /> 
             {/* Footer Fixe */}
             <CoverFooterSection 
               pdfSettings={pdfSettings} 
               projectState={state} 
               // PAS DE PROP 'style' ICI 
               fixed={true} // <-- La prop fixed suffit
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
          {/* <CGVPage pdfSettings={pdfSettings} /> */}

        </Document>
      );

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

// Styles locaux pour la page et le footer fixe de la page de garde
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', 
    display: 'flex',       
    flexDirection: 'column'
  },
  contentGrower: { 
     flexGrow: 1 
  },
  // Supprime fixedFooter car le style est interne au composant CoverFooterSection
  // fixedFooter: { ... } 
});
