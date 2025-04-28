
// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
// Importe les composants nécessaires de react-pdf
import { pdf, Document, Page, StyleSheet, View } from '@react-pdf/renderer'; 
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Importe le CONTENU de la page de garde
import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
// Importe les COMPOSANTS DE PAGE complets pour les autres sections
import { DetailsPage } from '../components/DetailsPage';
import { RecapPage } from '../components/RecapPage';
// === AJOUT : Import de la page CGV ===
import { CGVPage } from '../components/CGVPage'; 
// ====================================
// Importe le Footer commun pour la page de garde aussi
import { PageFooter } from '../components/common/PageFooter'; 

// Importe l'utilitaire de marges
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
      // Ajoute de l'espace en bas pour le footer fixe (ajuste 50 si besoin)
      const coverPagePaddingBottom = coverMargins[2] + 50; 
      // --- Fin calcul marges ---

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
              styles.pageBase, // Style de base (fond, police par défaut)
              { // Marges / Paddings spécifiques à la page de garde
                paddingTop: coverMargins[0],
                paddingRight: coverMargins[1],
                paddingBottom: coverPagePaddingBottom, // Espace pour le footer fixe
                paddingLeft: coverMargins[3]
              }
            ]}
           >
             {/* Contenu */}
             <CoverDocumentContent 
                pdfSettings={pdfSettings} 
                projectState={state} 
             />
             
             {/* Footer commun (FIXE) pour la page de garde */}
             {/* Note: La prop 'render' pour la pagination n'est pas utile ici car c'est toujours la page 1 */}
             <PageFooter 
               pdfSettings={pdfSettings} 
               company={state.metadata.company}
               // Supprimé la prop 'style' qui causait l'erreur TypeScript
             />
          </Page>

          {/* === PAGE(S) 2...N : Détails === */}
          {/* DetailsPage gère sa propre Page, Header, Footer fixes et marges */}
          <DetailsPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
          />
           
          {/* === PAGE(S) N+1...M : Récap === */}
          {/* RecapPage gère sa propre Page, Header, Footer fixes et marges */}
           <RecapPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
           />

          {/* === PAGE(S) M+1... : CGV === */}
          {/* CGVPage gère sa propre Page, Header, Footer fixes et marges */}
           <CGVPage 
              pdfSettings={pdfSettings} 
              projectState={state} 
           /> 
          {/* ========================== */}

        </Document>
      );

       // --- Génération et ouverture ---
       const blob = await pdf(MyPdfDocument).toBlob();
       const url = URL.createObjectURL(blob);
       window.open(url, '_blank'); 
       toast.success('PDF généré avec succès', { id: 'pdf-gen' });
       return true;

    } catch (error) {
       // --- Gestion Erreur ---
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

// Styles locaux MINIMAUX pour le hook (juste le style de base de la page de garde)
const styles = StyleSheet.create({
  pageBase: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', 
    // Pas besoin de display:flex ici car le footer est maintenant un composant fixe
    // importé directement dans la page de garde (comme dans DetailsPage)
  },
  // contentGrower n'est plus nécessaire ici car PageFooter est fixe
});
