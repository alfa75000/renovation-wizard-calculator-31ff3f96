import React from 'react';
import { Page, StyleSheet, View, Text } from '@react-pdf/renderer'; // Supprime Document ici
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 
import { DetailsPageContent } from './DetailsPageContent'; 
// Modifie les imports pour les composants communs
import { PageHeader } from './common/PageHeader'; 
import { PageFooter } from './common/PageFooter'; 
// Supprime getPdfStyles si plus utilisé directement ici

interface DetailsPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

// SUPPRIME les définitions locales de DetailsPageHeader et DetailsPageFooter

export const DetailsPage = ({ pdfSettings, projectState }: DetailsPageProps) => {
  const detailMarginsInput = pdfSettings.margins?.details || pdfSettings.margins?.cover;
  const margins: MarginTuple = convertPageMargins(
    detailMarginsInput as number[] | undefined
  );

  return (
    <Page 
      size="A4" 
      style={[
        styles.page,
        { 
          paddingTop: margins[0],
          paddingRight: margins[1],
          paddingBottom: margins[2], 
          paddingLeft: margins[3]
        }
      ]}
    >
      {/* En-tête fixe commun */}
      <PageHeader 
         pdfSettings={pdfSettings} 
         metadata={projectState.metadata}
         render={({ pageNumber, totalPages }) => ( // Passe la fonction render
            `DEVIS N° ${projectState.metadata?.devisNumber || 'XXXX-XX'} - page ${pageNumber}/${totalPages}`
         )} 
       />
      
      {/* Contenu principal */}
      <DetailsPageContent 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />

      {/* Pied de page fixe commun */}
      <PageFooter 
        pdfSettings={pdfSettings}
        company={projectState.metadata.company}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', 
    paddingBottom: 50, 
    paddingTop: 50,    
  },
  // Supprime headerContainer et footerContainer d'ici, ils sont dans les composants communs
});
