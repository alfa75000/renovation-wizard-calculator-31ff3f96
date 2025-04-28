
import React from 'react';
import { Page, StyleSheet, View } from '@react-pdf/renderer';
import { CGVPageContent } from './CGVPageContent';
import { PageFooter } from './common/PageFooter';
import { PageHeader } from './common/PageHeader';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils';

interface CGVPageProps {
  pdfSettings?: PdfSettings;
  projectState: ProjectState;
}

export const CGVPage: React.FC<CGVPageProps> = ({ pdfSettings, projectState }) => {
  // Calcul des marges pour la page
  const pageMargins: MarginTuple = convertPageMargins(
    pdfSettings?.margins?.cgv as number[] | undefined
  );
  
  // Ajoute de l'espace en bas pour le footer fixe
  const pagePaddingBottom = pageMargins[2] + 50;
  
  return (
    <Page
      size="A4"
      style={[
        styles.page,
        {
          paddingTop: pageMargins[0],
          paddingRight: pageMargins[1],
          paddingBottom: pagePaddingBottom,
          paddingLeft: pageMargins[3]
        }
      ]}
    >
      {/* En-tête (FIXE) */}
      <PageHeader
        pdfSettings={pdfSettings}
        devisNumber={projectState.metadata?.devisNumber}
      />
      
      {/* Contenu CGV */}
      <View style={styles.content}>
        <CGVPageContent pdfSettings={pdfSettings} />
      </View>
      
      {/* Pied de page (FIXE) */}
      <PageFooter
        pdfSettings={pdfSettings}
        company={projectState.metadata?.company}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  content: {
    flex: 1,
  }
});
