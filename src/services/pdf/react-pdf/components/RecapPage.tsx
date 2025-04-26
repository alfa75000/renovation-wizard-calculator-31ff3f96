// src/services/pdf/react-pdf/components/RecapPage.tsx

import React from 'react';
import { Page, StyleSheet, View, Text } from '@react-pdf/renderer'; // Import Document si génération isolée
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; // Utilise les marges spécifiques au récap

// Importe le contenu principal
import { RecapPageContent } from './RecapPageContent'; 
// Importe les composants Header/Footer (peut réutiliser ceux de DetailsPage)
import { DetailsPageHeader, DetailsPageFooter } from './DetailsPage'; // Assure-toi que ces composants sont exportés

interface RecapPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPage = ({ pdfSettings, projectState }: RecapPageProps) => {
  // Utilise les marges spécifiques au récap si définies, sinon fallback
  const recapMarginsInput = pdfSettings.margins?.recap || pdfSettings.margins?.cover;
  const margins: MarginTuple = convertPageMargins(
    recapMarginsInput as number[] | undefined
  );

  return (
    // Si tu génères cette page isolément, décommente Document
    // <Document> 
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
        {/* En-tête fixe */}
        <DetailsPageHeader 
           pdfSettings={pdfSettings} 
           metadata={projectState.metadata}
           // La numérotation continue automatiquement
           render={({ pageNumber, totalPages }) => ( 
              `DEVIS N° ${projectState.metadata?.devisNumber || 'XXXX-XX'} - page ${pageNumber}/${totalPages}`
           )} 
         />
        
        {/* Contenu principal */}
        <RecapPageContent 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />

        {/* Pied de page fixe */}
        <DetailsPageFooter 
          pdfSettings={pdfSettings}
          company={projectState.metadata.company}
        />
      </Page>
    // </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', 
    paddingBottom: 50, // Espace pour le footer fixe
    paddingTop: 50,    // Espace pour le header fixe
  }
  // Les styles de header/footer sont dans DetailsPage.tsx (ou leurs propres fichiers)
});
