// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, StyleSheet, View } from '@react-pdf/renderer'; // Page et View pour la page de garde
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Importe le CONTENU de la page de garde et les COMPOSANTS DE PAGE complets pour les autres
import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
import { DetailsPage } from '../components/DetailsPage'; // Contient <Page>, Header, Footer
import { RecapPage } from '../components/RecapPage';   // Contient <Page>, Header, Footer
// import { CGVPage } from '../components/CGVPage';    // Contiendrait <Page>, Header, Footer

// Importe l'utilitaire de marges pour la page de garde UNIQUEMENT
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

      // --- Calcul des marges pour la page de garde ---
      const coverMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.cover as number[] | undefined
       );
      // --- Fin calcul marges ---

      // Structure du Document PDF complet
      const MyPdfDocument = (
        <Document 
          title={`Devis ${state.metadata.devisNumber || 'Nouveau'}`} 
          // ... autres props Document ...
        >
          {/* === PAGE 1 : Page de Garde === */}
          {/* On définit la Page ici car CoverDocumentContent n'en a pas */}
          <Page 
            size="A4" 
            style={[
              styles.page, // Style de base (fond, police par défaut)
              { // Marges spécifiques
                paddingTop: coverMargins[0],
                paddingRight: coverMargins[1],
                paddingBottom: coverMargins[2], // Le footer est DANS le contenu ici
                paddingLeft: coverMargins[3]
              }
            ]}
           >
             {/* Insère le CONTENU de la page de garde */}
             <CoverDocumentContent 
                pdfSettings={pdfSettings} 
                projectState={state} 
             />
             {/* Le footer de la page de garde est DANS CoverDocumentContent */}
             {/* Si CoverFooterSection doit être fixe en bas, il faudrait */}
             {/* l'extraire de CoverDocumentContent et le mettre ici avec */}
             {/* position:absolute, bottom, left, right et fixed=true */}
             {/* ET ajouter un contentGrower */}
             {/* <View style={styles.contentGrower} /> */}
             {/* <CoverFooterSection pdfSettings={pdfSettings} projectState={state} style={styles.fixedFooter} fixed /> */}

          </Page>

          {/* === PAGE(S) 2...N : Détails === */}
          {/* DetailsPage rend sa propre <Page> avec son header/footer fixes */}
          <DetailsPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
          />
           
          {/* === PAGE(S) N+1...M : Récap === */}
          {/* RecapPage rend sa propre <Page> avec son header/footer fixes */}
           <RecapPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
           />

          {/* === PAGE(S) M+1... : CGV === */}
          {/* <CGVPage pdfSettings={pdfSettings} /> */}

        </Document>
      );

      // Génération du blob
      const blob = await pdf(MyPdfDocument).toBlob();

      // ... (ouverture, toasts) ...
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

// Styles locaux MINIMAUX ici (juste le style de base pour la page de garde)
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', 
    // Le padding est ajouté dynamiquement
    // Le display:flex / flexDirection:column est utile SI on a un footer fixe DANS cette page
  },
  // contentGrower: { // Nécessaire seulement si le footer de la PAGE DE GARDE doit être fixe en bas
  //    flexGrow: 1 
  // },
  // fixedFooter: { // Style pour un éventuel footer fixe de PAGE DE GARDE
  //   position: 'absolute',
  //   bottom: 20, 
  //   left: 40, 
  //   right: 40, 
  //   textAlign: 'center',
  // }
});