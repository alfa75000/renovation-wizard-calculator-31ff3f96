
import { View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface HeaderSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const HeaderSection = ({ pdfSettings, projectState }: HeaderSectionProps) => {
  const logoUrl = '/lrs_logo.jpg';

  // Récupération des styles dynamiques
  const dynamicHeaderStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  const dynamicLogoContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  const dynamicInsuranceStyles = getPdfStyles(pdfSettings, 'insurance_info', { isContainer: true });
  const insuranceTextStyles = getPdfStyles(pdfSettings, 'insurance_info', { isContainer: false });
  
  // Styles du logo avec type approprié pour alignSelf
  const logoStyles = {
    ...styles.logo,
    width: pdfSettings.logoSettings?.width || 150,
    height: pdfSettings.logoSettings?.height || 70,
    alignSelf: pdfSettings.logoSettings?.alignment === 'center' ? 'center' : 
               pdfSettings.logoSettings?.alignment === 'right' ? 'flex-end' : 'flex-start'
  } as const;

  return (
    <View style={styles.container}>
      <View style={[styles.header, dynamicHeaderStyles]}>
        <View style={[styles.logoContainer, dynamicLogoContainerStyles, { width: '60%' }]}>
          <Image src={logoUrl} style={logoStyles} />
        </View>
        
        <View style={[styles.insuranceInfo, dynamicInsuranceStyles, { width: '40%' }]}>
          <Text style={insuranceTextStyles}>Assurance MAAF PRO</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile décennale</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0 // Nous gérons maintenant les espacements via les composants parents
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  logoContainer: {
    flex: 1
  },
  logo: {
    objectFit: 'contain'
  },
  insuranceInfo: {
    // Les styles spécifiques sont appliqués via getPdfStyles
  }
});
