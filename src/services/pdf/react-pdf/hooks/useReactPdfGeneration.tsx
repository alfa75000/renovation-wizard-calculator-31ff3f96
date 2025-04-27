// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, StyleSheet, View } from '@react-pdf/renderer'; // Ajout de View
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
import { DetailsPage } from '../components/DetailsPage';
import { RecapPage } from '../components/RecapPage';
// Importe aussi CoverFooterSection spécifiquement pour la page de garde
import { CoverFooterSection } from '../components/CoverFooterSection'; 
// import { CGVPage } from '../components/CGVPage';

import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 

export const useReactPdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  const { pdfSettings } = usePdfSettings();

  const generateReactPdf = async () => {
    try {
      // ... (début try, vérifications) ...

      console.log("Génération PDF avec settings:", pdfSettings);
      console.log("Et state:", state);

      const coverMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.cover as number[] | undefined
      );
       // Calcule les paddings nécessaires pour le footer fixe de la page de garde
       const coverPaddingBottom = coverMargins[2] + 50; // Marge user + espace footer (ajuste 50)

      const MyPdfDocument = (
        <Document /* ...props Document... */ >
          
          {/* === PAGE 1 : Page de Garde === */}
          <Page 
            size="A4" 
            style={[
              styles.page, // Style de base
              { // Marges / Paddings
                paddingTop: coverMargins[0],
                paddingRight: coverMargins[1],
                paddingBottom: coverPaddingBottom, // Espace pour le footer fixe
                paddingLeft: coverMargins[3]
              }
            ]}
           >
             {/* Contenu de la page de garde */}
             <CoverDocumentContent 
                pdfSettings={pdfSettings} 
                projectState={state} 
             />

             {/* Ajoute le "pousseur" pour caler le footer en bas */}
             <View style={styles.contentGrower} /> 

             {/* Ajoute le Footer spécifique à la page de garde ici */}
             {/* Il faut lui appliquer les styles pour le fixer */}
             <CoverFooterSection 
               pdfSettings={pdfSettings} 
               projectState={state} 
               // Applique les styles + la prop fixed
               style={styles.fixedFooter} 
               fixed={true} 
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

      // ... (génération blob, ouverture, toasts) ...
       const blob = await pdf(MyPdfDocument).toBlob();
       const url = URL.createObjectURL(blob);
       window.open(url, '_blank'); 
       toast.success('PDF généré avec succès', { id: 'pdf-gen' });
       return true;

    } catch (error) {
       // ... (gestion erreur) ...
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

// Styles locaux pour la page et le footer fixe
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', 
    display: 'flex',       
    flexDirection: 'column'
    // Le padding est ajouté dynamiquement ci-dessus
  },
  contentGrower: { 
     flexGrow: 1 // Nécessaire pour pousser le footer fixe
  },
  // Style pour le footer fixe (similaire à celui dans PageFooter.tsx)
  fixedFooter: { 
    position: 'absolute',
    bottom: 20, // Position verticale depuis le bas
    left: 40,  // Doit correspondre à la marge gauche (coverMargins[3])
    right: 40, // Doit correspondre à la marge droite (coverMargins[1])
    textAlign: 'center', // Ou utilise le style dynamique 'cover_footer'
  }
});