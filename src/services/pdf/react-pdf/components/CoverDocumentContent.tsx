// src/services/pdf/react-pdf/components/CoverDocumentContent.tsx 
// NOTE LE NOUVEAU NOM DE FICHIER ET DE COMPOSANT !

import React from 'react';
import { StyleSheet, View } from '@react-pdf/renderer'; // Plus besoin de Document, Page ici
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
// Pas besoin de convertPageMargins ici car on ne gère plus les marges de la page

// Imports des composants de la page de garde
import { HeaderSection } from './HeaderSection';
import { SloganSection } from './SloganSection';
import { CompanyAddressSection } from './CompanyAddressSection';
import { ContactSection } from './ContactSection';
import { QuoteInfoSection } from './QuoteInfoSection';
import { ClientSection } from './ClientSection';
import { ProjectSection } from './ProjectSection';
import { CoverFooterSection } from './CoverFooterSection';

// Renomme l'interface
interface CoverDocumentContentProps { 
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

// Renomme le composant et utilise la nouvelle interface
export const CoverDocumentContent = ({ pdfSettings, projectState }: CoverDocumentContentProps) => {
  // PAS de calcul de marges ici

  // Retourne directement un fragment React ou un View racine contenant toutes les sections
  return (
    <> 
      {/* 1. HeaderSection (Logo + Infos Assurance) */}
      <HeaderSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 1 (space_after_header) */}
      <View style={styles.spacer} /> 
      
      {/* 2. Section Slogan */}
      <SloganSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 2 (space_after_slogan) */}
      <View style={styles.spacer} />
      
      {/* 3. Section Coordonnées Société */}
      <CompanyAddressSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 3 (space_after_address) */}
      <View style={styles.spacer} />
      
      {/* 4. ContactSection */}
      <ContactSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 4 (space_after_contact) */}
      <View style={styles.spacer} />
      
      {/* 5. QuoteInfoSection */}
      <QuoteInfoSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 5 (space_after_quote_info) */}
      <View style={styles.spacer} />
      
      {/* 6. ClientSection */}
      <ClientSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 6 (space_after_client_content) */}
      <View style={styles.spacer} />
      
      {/* 7. ProjectSection */}
      <ProjectSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* Pas besoin du contentGrower ici, le footer est géré différemment */}
      {/* L'espace avant le footer peut être dans le spacer ou dans le style du footer */}
      {/* ESPACE VERTICAL 7 (space_before_footer) */}
      <View style={styles.spacerBeforeFooter} /> 

      {/* 8. CoverFooterSection */}
      {/* NOTE: Le footer ici ne sera PAS automatiquement en bas de page */}
      {/* S'il doit être fixe en bas, il faut l'intégrer dans la logique de <Page> */}
      <CoverFooterSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
    </>
  );
};

// Styles locaux pour les espaces (si besoin)
const styles = StyleSheet.create({
  spacer: {
     height: 12 // TODO: Rendre configurable 
  },
  spacerBeforeFooter: {
     height: 24 // TODO: Rendre configurable 
  }
  // Pas besoin de 'page' ou 'contentGrower' ici
});
