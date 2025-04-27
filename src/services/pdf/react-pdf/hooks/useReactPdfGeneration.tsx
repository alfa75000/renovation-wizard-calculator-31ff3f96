// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
// Importe Page ici aussi !
import { pdf, Document, Page } from '@react-pdf/renderer'; 
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Importe le contenu et les autres pages
import { CoverDocumentContent } from '../components/CoverDocumentContent'; 
import { DetailsPage } from '../components/DetailsPage';
import { RecapPage } from '../components/RecapPage';
// import { CGVPage } from '../components/CGVPage';

// Importe l'utilitaire de marges (si tu l'utilises toujours pour la page de garde ici)
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 
// Importe aussi le StyleSheet si tu veux définir le style de page ici
import { StyleSheet } from '@react-pdf/renderer'; 


export const useReactPdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  const { pdfSettings } = usePdfSettings();

  const generateReactPdf = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Génération du PDF en cours...', { id: 'pdf-gen' }); 

      if (!pdfSettings || !state || !state.metadata) { // Simplifie la vérification
        toast.error('Données ou paramètres PDF manquants.', { id: 'pdf-gen' });
        setIsGenerating(false); 
        return false;
      }

      console.log("Génération PDF avec settings:", pdfSettings);
      console.log("Et state:", state);

      // --- Calcul des marges pour la page de garde ---
      // (On le fait ici car la <Page> est ici)
      const coverMargins: MarginTuple = convertPageMargins(
         pdfSettings.margins?.cover as number[] | undefined
       );
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
            style={[ // Applique le style de page et les marges
              styles.page,
              {
                paddingTop: coverMargins[0],
                paddingRight: coverMargins[1],
                paddingBottom: coverMargins[2], // Attention au footer fixe !
                paddingLeft: coverMargins[3]
              }
            ]}
           >
             {/* Insère le CONTENU de la page de garde ici */}
             <CoverDocumentContent 
                pdfSettings={pdfSettings} 
                projectState={state} 
             />
              {/* Ajoute le "pousseur" ici si le footer de la page de garde doit être en bas */}
             {/* <View style={styles.contentGrower} /> */}
             {/* Le footer de la page de garde est DANS CoverDocumentContent */}
          </Page>

          {/* === PAGE(S) 2...N : Détails === */}
          {/* DetailsPage contient déjà sa propre balise <Page> */}
          <DetailsPage 
             pdfSettings={pdfSettings} 
             projectState={state} 
          />
           
          {/* === PAGE(S) N+1...M : Récap === */}
          {/* RecapPage contient déjà sa propre balise <Page> */}
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

      // ... (reste : ouvrir blob, toast, etc.) ...
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

// Styles locaux pour la page (si nécessaire, ex: pour le contentGrower)
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', // Police par défaut si non surchargée globalement
    // --- IMPORTANT pour le footer fixe ---
    // On ajoute le padding pour header/footer ici si CoverDocumentContent
    // ne les gère pas avec position:absolute et fixed=true
    // Si CoverFooterSection utilise marginTop:auto, il faut le flex ici :
     display: 'flex',       
     flexDirection: 'column'
    // paddingBottom: 50, // Espace pour footer fixe
    // paddingTop: 50,    // Espace pour header fixe
  },
  contentGrower: {
     flexGrow: 1 
  }
});