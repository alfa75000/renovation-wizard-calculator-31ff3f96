// src/services/pdf/react-pdf/components/CGVPage.tsx
// VERSION CORRIGÉE - Élimination de tous les espaces textuels

import React from 'react';
import { Page, StyleSheet, View } from '@react-pdf/renderer'; 
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types'; 
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 
import { CGVPageContent } from './CGVPageContent'; 
import { PageHeader } from './common/PageHeader'; 
import { PageFooter } from './common/PageFooter'; 

interface CGVPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const CGVPage = ({ pdfSettings, projectState }: CGVPageProps) => {
  // Utilise les marges de Récap par défaut pour les CGV
  const cgvMarginsInput = pdfSettings.margins?.recap || pdfSettings.margins?.cover;
  const margins: MarginTuple = convertPageMargins(
    cgvMarginsInput as number[] | undefined
  );

  const pagePaddingTop = margins[0] + 50; 
  const pagePaddingBottom = margins[2] + 50; 

  return (
    <Page 
      size="A4" 
      style={[
        styles.pageBase, 
        { 
          paddingTop: pagePaddingTop,      
          paddingRight: margins[1],     
          paddingBottom: pagePaddingBottom, 
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
      
      {/* Contenu principal des CGV - enveloppé dans une View pour éviter les espaces */}
      <View style={styles.contentWrapper}>
        <CGVPageContent 
          pdfSettings={pdfSettings}
        />
      </View>

      {/* Pied de page fixe commun */}
      <PageFooter 
        pdfSettings={pdfSettings}
        company={projectState.metadata?.company} 
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  pageBase: {
    backgroundColor: '#ffffff', 
    fontFamily: 'Helvetica'
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
});
