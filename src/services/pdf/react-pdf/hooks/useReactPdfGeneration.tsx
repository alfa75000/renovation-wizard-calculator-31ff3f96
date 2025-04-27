// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Import du composant de contenu réel pour la page de garde
import { CoverDocumentContent } from '../components/CoverDocumentContent';
// Les autres imports seront ajoutés progressivement
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

      // Calcul des marges pour la première page uniquement
      const coverMargins: MarginTuple = convertPageMargins(
        pdfSettings.margins?.cover as number[] | undefined
      );

      // Structure du Document PDF - PROGRESSION GRADUELLE
      const MyPdfDocument = (
        <Document
          title={`Devis ${state.metadata.devisNumber || 'Nouveau'}`}
          author={state.metadata.company?.name || 'Mon Entreprise'}
          subject={`Devis N°${state.metadata.devisNumber}`}
          creator="Mon Application Devis"
          producer="Mon Application Devis (@react-pdf/renderer)"
        >
          {/* Page 1: Composant réel de couverture */}
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

          {/* Page 2: Page simplifiée pour test */}
          <Page size="A4" style={styles.basicPage}>
            <Text style={styles.pageTitle}>PAGE 2 - DÉTAILS</Text>
            <View style={styles.contentBox}>
              <Text>Cette page est simplifiée pour tester le multi-pages</Text>
              <Text>Elle sera remplacée par votre composant DetailsPage</Text>
            </View>
          </Page>

          {/* Page 3: Page simplifiée pour test */}
          <Page size="A4" style={styles.basicPage}>
            <Text style={styles.pageTitle}>PAGE 3 - RÉCAPITULATIF</Text>
            <View style={styles.contentBox}>
              <Text>Cette page est simplifiée pour tester le multi-pages</Text>
              <Text>Elle sera remplacée par votre composant RecapPage</Text>
            </View>
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

// Styles pour les pages
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column'
  },
  // Styles pour les pages de test simplifiées
  basicPage: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentBox: {
    margin: 10,
    padding: 10,
    border: '1px solid #000',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentGrower: {
    flexGrow: 1
  }
});