// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Importez vos composants de contenu
import { CoverDocumentContent } from '../components/CoverDocumentContent';
import { DetailsPageContent } from '../components/DetailsPageContent';
import { RecapPageContent } from '../components/RecapPageContent';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils';

// Créez des composants spécifiques pour les en-têtes et pieds de page
// (à adapter selon votre structure existante)
const PageFooter = ({ pageNumber, pageCount }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      Page {pageNumber} sur {pageCount}
    </Text>
  </View>
);

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

      // Calcul des marges
      const coverMargins: MarginTuple = convertPageMargins(
        pdfSettings.margins?.cover as number[] | undefined
      );
      const detailsMargins: MarginTuple = convertPageMargins(
        pdfSettings.margins?.details as number[] | undefined
      );
      const recapMargins: MarginTuple = convertPageMargins(
        pdfSettings.margins?.recap as number[] | undefined
      );

      // Structure du Document PDF avec en-têtes et pieds de page correctement gérés
      const MyPdfDocument = (
        <Document
          title={`Devis ${state.metadata.devisNumber || 'Nouveau'}`}
          author={state.metadata.company?.name || 'Mon Entreprise'}
          subject={`Devis N°${state.metadata.devisNumber}`}
          creator="Mon Application Devis"
          producer="Mon Application Devis (@react-pdf/renderer)"
        >
          {/* Page 1: Page de garde avec pied de page externe */}
          <Page 
            size="A4" 
            style={[
              styles.page,
              {
                paddingTop: coverMargins[0],
                paddingRight: coverMargins[1],
                // Important: Augmentez le padding bottom pour faire place au pied de page
                paddingBottom: coverMargins[2] + 30, 
                paddingLeft: coverMargins[3]
              }
            ]}
          >
            <CoverDocumentContent
              pdfSettings={pdfSettings}
              projectState={state}
            />
            {/* Pied de page fixe externe au composant */}
            <PageFooter pageNumber={1} pageCount={3} />
          </Page>

          {/* Page 2: Page de détails avec pied de page externe */}
          <Page 
            size="A4" 
            style={[
              styles.page,
              {
                paddingTop: detailsMargins[0],
                paddingRight: detailsMargins[1],
                // Important: Augmentez le padding bottom pour faire place au pied de page
                paddingBottom: detailsMargins[2] + 30, 
                paddingLeft: detailsMargins[3]
              }
            ]}
          >
            <DetailsPageContent
              pdfSettings={pdfSettings}
              projectState={state}
            />
            {/* Pied de page fixe externe au composant */}
            <PageFooter pageNumber={2} pageCount={3} />
          </Page>

          {/* Page 3: Page récap avec pied de page externe */}
          <Page 
            size="A4" 
            style={[
              styles.page,
              {
                paddingTop: recapMargins[0],
                paddingRight: recapMargins[1],
                // Important: Augmentez le padding bottom pour faire place au pied de page
                paddingBottom: recapMargins[2] + 30, 
                paddingLeft: recapMargins[3]
              }
            ]}
          >
            <RecapPageContent
              pdfSettings={pdfSettings}
              projectState={state}
            />
            {/* Pied de page fixe externe au composant */}
            <PageFooter pageNumber={3} pageCount={3} />
          </Page>
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

// Styles pour les pages et les pieds de page
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 10,
    color: '#666',
  },
  contentGrower: {
    flexGrow: 1
  }
});