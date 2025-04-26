// src/services/pdf/react-pdf/components/DetailsPage.tsx

import React from 'react';
import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils'; // Utilise les marges spécifiques aux détails

// Importe le contenu principal
import { DetailsPageContent } from './DetailsPageContent'; 
// Optionnel: Importe un composant Footer réutilisable si tu en as un
// import { StandardFooter } from './StandardFooter'; 
// Optionnel: Importe un composant Header réutilisable
// import { StandardHeader } from './StandardHeader'; 

// Importe l'utilitaire de style
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface DetailsPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

// Composant simple pour l'en-tête de page (peut être extrait dans un fichier séparé)
const DetailsPageHeader = ({ pdfSettings, metadata, currentPage, totalPages }: { pdfSettings: PdfSettings, metadata: ProjectState['metadata'], currentPage: number, totalPages: number }) => {
  // Style pour l'en-tête (peut utiliser 'default' ou un ID spécifique comme 'detail_page_header')
  const headerTextStyles = getPdfStyles(pdfSettings, 'detail_header', { isContainer: false });
  const headerContainerStyles = getPdfStyles(pdfSettings, 'detail_header', { isContainer: true });

  return (
    <View 
      style={[styles.headerContainer, headerContainerStyles]} 
      fixed // Rend l'en-tête fixe sur chaque page
    >
      <Text style={headerTextStyles}>
        DEVIS N° {metadata?.devisNumber || 'XXXX-XX'} - page {currentPage}/{totalPages}
      </Text>
    </View>
  );
};

// Composant simple pour le pied de page (peut être extrait)
const DetailsPageFooter = ({ pdfSettings, company }: { pdfSettings: PdfSettings, company: ProjectState['metadata']['company'] }) => {
   // Style pour le footer (peut utiliser 'cover_footer' ou 'detail_page_footer')
   const footerTextStyles = getPdfStyles(pdfSettings, 'cover_footer', { isContainer: false });
   const footerContainerStyles = getPdfStyles(pdfSettings, 'cover_footer', { isContainer: true });

   if (!company) return null;

   const legalInfo = `${company.name} SASU au capital de ${company.capital_social || '10 000'} € - ${company.address || ''} ${company.postal_code || ''} ${company.city || ''} - SIRET : ${company.siret || ''} - Code APE : ${company.code_ape || ''} - N° TVA Intracommunautaire : ${company.tva_intracom || ''}`;

  return (
    <View 
      style={[styles.footerContainer, footerContainerStyles]} 
      fixed // Rend le pied de page fixe sur chaque page
    >
      <Text style={footerTextStyles}>{legalInfo}</Text>
    </View>
  );
};


// Composant principal de la page de détails
export const DetailsPage = ({ pdfSettings, projectState }: DetailsPageProps) => {
  // Utilise les marges spécifiques aux détails si définies, sinon fallback sur celles de cover
  const detailMarginsInput = pdfSettings.margins?.details || pdfSettings.margins?.cover;
  const margins: MarginTuple = convertPageMargins(
    detailMarginsInput as number[] | undefined
  );

  return (
    // Note: On ne met pas <Document> ici, car ce composant sera utilisé *dans*
    // le <Document> principal qui gère toutes les pages.
    // On retourne directement un fragment de page ou les éléments.
    // Si tu veux générer *juste* cette page, alors il faut mettre <Document><Page>...</Page></Document>
    
    // Création d'une page pour les détails
    <Page 
      size="A4" 
      style={[
        styles.page,
        { // Applique les marges de la page DÉTAIL
          paddingTop: margins[0],
          paddingRight: margins[1],
          paddingBottom: margins[2], // Laisse de la place pour le footer fixe
          paddingLeft: margins[3]
        }
      ]}
    >
      {/* En-tête fixe */}
      <DetailsPageHeader 
         pdfSettings={pdfSettings} 
         metadata={projectState.metadata}
         // La numérotation de page est gérée par @react-pdf/renderer
         currentPage={1} // Placeholder, sera remplacé par le moteur
         totalPages={1}  // Placeholder, sera remplacé par le moteur
       />
      
      {/* Contenu principal */}
      <DetailsPageContent 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />

      {/* Pied de page fixe */}
      <DetailsPageFooter 
        pdfSettings={pdfSettings}
        company={projectState.metadata.company}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica', // Police par défaut si non surchargée
    paddingBottom: 50, // Espace supplémentaire en bas pour le footer fixe
    paddingTop: 50,    // Espace supplémentaire en haut pour le header fixe
  },
  headerContainer: {
    position: 'absolute',
    top: 20, // Ajuste la position verticale de l'en-tête
    left: 40, // Marge gauche (doit correspondre au paddingLeft de la page)
    right: 40, // Marge droite (doit correspondre au paddingRight de la page)
    textAlign: 'right',
    // Appliquer ici les styles de conteneur pour 'detail_header' si besoin (fond, bordure...)
  },
   footerContainer: {
    position: 'absolute',
    bottom: 20, // Ajuste la position verticale du pied de page
    left: 40,  // Marge gauche
    right: 40, // Marge droite
    textAlign: 'center',
     // Appliquer ici les styles de conteneur pour 'cover_footer' ou 'detail_footer'
   }
});
