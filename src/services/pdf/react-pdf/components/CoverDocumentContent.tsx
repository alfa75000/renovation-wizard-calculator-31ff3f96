// src/services/pdf/react-pdf/components/CoverDocumentContent.tsx 

import React from 'react';
import { StyleSheet, View, Text } from '@react-pdf/renderer'; // Import de Text nécessaire
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';

// Imports des composants de la page de garde
import { HeaderSection } from './HeaderSection';
import { SloganSection } from './SloganSection';
import { CompanyAddressSection } from './CompanyAddressSection';
import { ContactSection } from './ContactSection';
import { QuoteInfoSection } from './QuoteInfoSection';
import { ClientSection } from './ClientSection';
import { ProjectSection } from './ProjectSection';

interface CoverDocumentContentProps { 
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const CoverDocumentContent = ({ pdfSettings, projectState }: CoverDocumentContentProps) => {
  // Important : ne jamais utiliser de fragment <> </> à la racine dans React PDF
  // Utiliser toujours un View comme composant racine
  return (
    <View style={styles.container}> 
      {/* 1. HeaderSection (Logo + Infos Assurance) */}
      <HeaderSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 1 - Utiliser un View avec height au lieu d'espaces textuels */}
      <View style={styles.spacer} /> 
      
      {/* 2. Section Slogan */}
      <SloganSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 2 */}
      <View style={styles.spacer} />
      
      {/* 3. Section Coordonnées Société */}
      <CompanyAddressSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 3 */}
      <View style={styles.spacer} />
      
      {/* 4. ContactSection */}
      <ContactSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 4 */}
      <View style={styles.spacer} />
      
      {/* 5. QuoteInfoSection */}
      <QuoteInfoSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 5 */}
      <View style={styles.spacer} />
      
      {/* 6. ClientSection */}
      <ClientSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 6 */}
      <View style={styles.spacer} />
      
      {/* 7. ProjectSection */}
      <ProjectSection 
        pdfSettings={pdfSettings}
        projectState={projectState}
      />
      
      {/* ESPACE VERTICAL 7 (space_before_footer) */}
      <View style={styles.spacerBeforeFooter} /> 
    </View>
  );
};

// Styles locaux pour les espaces
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  spacer: {
     height: 12 // Hauteur fixe pour l'espacement
  },
  spacerBeforeFooter: {
     height: 24 // Hauteur fixe plus grande pour l'espacement avant le pied de page
  }
});
