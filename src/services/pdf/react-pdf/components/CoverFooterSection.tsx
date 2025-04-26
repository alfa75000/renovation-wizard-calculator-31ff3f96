
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface CoverFooterSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const CoverFooterSection = ({ pdfSettings, projectState }: CoverFooterSectionProps) => {
  const company = projectState.metadata?.company;
  
  if (!company) return null;
  
  const footerStyles = getPdfStyles(pdfSettings, 'cover_footer', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'cover_footer', { isContainer: true });
  
  // Assemblage des informations légales de l'entreprise
  const legalInfo = `${company.name} ${company.type || 'SASU'} au capital de ${company.capital_social || '10 000'} € - ${company.address || ''} ${company.postal_code || ''} ${company.city || ''} - SIRET : ${company.siret || ''} - Code APE : ${company.code_ape || ''} - N° TVA Intracommunautaire : ${company.tva_intracom || ''}`;
  
  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={[styles.text, footerStyles]}>{legalInfo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 'auto', // Pour positionner en bas de page
    paddingTop: 10
  },
  text: {
    fontSize: 8,
    textAlign: 'center'
  }
});
