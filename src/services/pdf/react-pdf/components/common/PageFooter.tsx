//Nouveau Fichier : src/services/pdf/react-pdf/components/common/PageFooter.tsx
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types'; // Pour le type CompanyData
import { getPdfStyles } from '../../utils/pdfStyleUtils';

interface PageFooterProps {
  pdfSettings: PdfSettings;
  company: ProjectState['metadata']['company']; // Passe directement l'objet company
}

export const PageFooter = ({ pdfSettings, company }: PageFooterProps) => {
   const footerTextStyles = getPdfStyles(pdfSettings, 'cover_footer', { isContainer: false });
   const footerContainerStyles = getPdfStyles(pdfSettings, 'cover_footer', { isContainer: true });

   if (!company) return null;

   // Utilise "SASU" par défaut si pas de type défini, ou supprime si non pertinent
   const companyType = ' SAS'; // À remplacer par company.legal_form si ça existe
   const legalInfo = `${company.name} ${companyType} au capital de ${company.capital_social || '10 000'} - ${company.address || ''} ${company.postal_code || ''} ${company.city || ''} - SIRET : ${company.siret || ''} - Code APE : ${company.code_ape || ''} - N° TVA Intracommunautaire : ${company.tva_intracom || ''}`;

  return (
    <View 
      style={[styles.footerContainer, footerContainerStyles]} 
      fixed // Reste fixe sur chaque page
    >
      <Text style={footerTextStyles}>{legalInfo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
   footerContainer: {
    position: 'absolute',
    bottom: 20, // Ajuste si besoin
    left: 40,  // Doit correspondre aux marges de page
    right: 40, // Doit correspondre aux marges de page
    textAlign: 'center',
   }
});
