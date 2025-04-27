import React from 'react';
import { Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 
import { RecapPageContent } from './RecapPageContent'; 
// Modifie les imports pour les composants communs
import { PageHeader } from './common/PageHeader'; 
import { PageFooter } from './common/PageFooter'; 

interface RecapPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPage = ({ pdfSettings, projectState }: RecapPageProps) => {
  const recapMarginsInput = pdfSettings.margins?.recap || pdfSettings.margins?.cover;
  const margins: MarginTuple = convertPageMargins(
    recapMarginsInput as number[] | undefined
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
           render={({ pageNumber, totalPages }) => ( 
              `DEVIS N° ${projectState.metadata?.devisNumber || 'XXXX-XX'} - page ${pageNumber}/${totalPages}`
           )} 
         />
        
        {/* Contenu principal */}
        <RecapPageContent 
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
  }
});