// src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx

import React from 'react';
import { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useProject } from '@/contexts/ProjectContext';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { toast } from 'sonner';

// Importez directement tous les composants dont vous avez besoin
import { CoverDocumentContent } from '../components/CoverDocumentContent';
import { DetailsPageContent } from '../components/DetailsPageContent';
import { RecapPageContent } from '../components/RecapPageContent';
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

      // Vérifier si le PDF a bien plus d'une page (pour debug)
      console.log("Structure du document: 1 page de garde + details + recap");

      // Structure du Document PDF - SIMPLIFIÉE AU MAXIMUM
      const MyPdfDocument = (
        <Document>
          {/* Test simple pour vérifier si plusieurs pages fonctionnent */}
          <Page size="A4" style={styles.basicPage}>
            <Text style={styles.pageTitle}>PAGE 1 - COUVERTURE</Text>
            <View style={styles.contentBox}>
              <Text>Contenu de la page de couverture</Text>
            </View>
          </Page>

          <Page size="A4" style={styles.basicPage}>
            <Text style={styles.pageTitle}>PAGE 2 - DÉTAILS</Text>
            <View style={styles.contentBox}>
              <Text>Contenu de la page de détails</Text>
            </View>
          </Page>

          <Page size="A4" style={styles.basicPage}>
            <Text style={styles.pageTitle}>PAGE 3 - RÉCAPITULATIF</Text>
            <View style={styles.contentBox}>
              <Text>Contenu de la page de récapitulatif</Text>
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

// Styles simplifiés pour le test
const styles = StyleSheet.create({
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