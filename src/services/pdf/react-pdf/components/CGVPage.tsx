// src/services/pdf/react-pdf/components/CGVPage.tsx

import React from 'react';
import { Page, StyleSheet } from '@react-pdf/renderer'; 
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
// Importe ProjectState seulement si PageHeader/PageFooter en ont besoin
import { ProjectState } from '@/types'; 
// Utilise les marges de Récap ou Cover par défaut ? Ou ajoute des marges CGV ?
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; 
import { CGVPageContent } from './CGVPageContent'; 
// Réutilise les Header/Footer communs
import { PageHeader } from './common/PageHeader'; 
import { PageFooter } from './common/PageFooter'; 

interface CGVPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState; // Gardé si PageHeader/Footer l'utilisent
}

export const CGVPage = ({ pdfSettings, projectState }: CGVPageProps) => {
  // Utilise les marges de Récap par défaut pour les CGV, ou ajoute pdfSettings.margins.cgv
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
        
        {/* Contenu principal des CGV */}
        <CGVPageContent 
          pdfSettings={pdfSettings}
          // projectState n'est probablement pas nécessaire ici
        />

        {/* Pied de page fixe commun (utilise l'ID 'cgv_footer' ou 'cover_footer') */}
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
    fontFamily: 'Helvetica',   
  }
});
