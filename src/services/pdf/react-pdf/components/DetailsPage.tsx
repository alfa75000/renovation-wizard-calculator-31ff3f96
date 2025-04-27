// src/services/pdf/react-pdf/components/DetailsPage.tsx

import React from 'react';
import { Page, StyleSheet } from '@react-pdf/renderer'; // Seulement Page et StyleSheet nécessaires ici
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; // Pour calculer les marges

// Importe le contenu principal
import { DetailsPageContent } from './DetailsPageContent'; 
// Importe les composants communs Header/Footer
import { PageHeader } from './common/PageHeader'; 
import { PageFooter } from './common/PageFooter'; 

interface DetailsPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

// Exporte le composant de page complet
export const DetailsPage = ({ pdfSettings, projectState }: DetailsPageProps) => {
  
  // Utilise les marges spécifiques aux détails si définies, sinon fallback sur celles de cover
  const detailMarginsInput = pdfSettings.margins?.details || pdfSettings.margins?.cover;
  const margins: MarginTuple = convertPageMargins(
    detailMarginsInput as number[] | undefined
  );

  // Détermine les paddings de page en ajoutant l'espace nécessaire pour header/footer
  // Ajuste les valeurs 50 si ton header/footer sont plus ou moins hauts
  const pagePaddingTop = margins[0] + 50; // Marge utilisateur + Espace Header
  const pagePaddingBottom = margins[2] + 50; // Marge utilisateur + Espace Footer

  return (
    <Page 
      size="A4" 
      style={[
        styles.pageBase, // Style de base commun
        { 
          paddingTop: pagePaddingTop,      // Marge haut + espace header
          paddingRight: margins[1],     // Marge droite utilisateur
          paddingBottom: pagePaddingBottom, // Marge bas + espace footer
          paddingLeft: margins[3]      // Marge gauche utilisateur
        }
      ]}
    >
      {/* En-tête fixe commun */}
      <PageHeader 
         pdfSettings={pdfSettings} 
         metadata={projectState.metadata}
         // Passe la fonction render pour la numérotation dynamique
         render={({ pageNumber, totalPages }) => ( 
            `DEVIS N° ${projectState.metadata?.devisNumber || 'XXXX-XX'} - page ${pageNumber}/${totalPages}`
         )} 
       />
      
      {/* Contenu principal de la page de détails */}
      <DetailsPageContent 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />

      {/* Pied de page fixe commun */}
      <PageFooter 
        pdfSettings={pdfSettings}
        // Passe directement l'objet company ou null/undefined
        company={projectState.metadata?.company} 
      />
    </Page>
  );
};

// Styles locaux UNIQUEMENT pour la structure de base de la page
const styles = StyleSheet.create({
  pageBase: {
    backgroundColor: '#ffffff', // Fond blanc par défaut
    fontFamily: 'Helvetica',   // Police par défaut si non surchargée par styles éléments
    // Le padding dynamique est ajouté inline ci-dessus
  }
  // Les styles spécifiques au header/footer sont dans leurs composants respectifs
});