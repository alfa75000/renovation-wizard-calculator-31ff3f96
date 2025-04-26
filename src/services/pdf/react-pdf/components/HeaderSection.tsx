
import { View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface HeaderSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const HeaderSection = ({ pdfSettings, projectState }: HeaderSectionProps) => {
  const company = projectState.metadata?.company;
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  const logoUrl = '/lrs_logo.jpg';

  // Styles pour le conteneur principal du header
  const headerContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true, ...styles.header });
  
  // Styles pour le conteneur du logo
  const logoContainerStyles = getPdfStyles(pdfSettings, 'default', { 
    isContainer: true,
    ...styles.logoContainer,
    width: '60%'
  });

  // Styles du logo avec type approprié pour alignSelf
  const logoStyles = {
    ...styles.logo,
    width: pdfSettings.logoSettings?.width || 150,
    height: pdfSettings.logoSettings?.height || 70,
    alignSelf: pdfSettings.logoSettings?.alignment === 'center' ? 'center' : 
               pdfSettings.logoSettings?.alignment === 'right' ? 'flex-end' : 'flex-start'
  } as const;

  // Styles pour les informations d'assurance
  const insuranceContainerStyles = getPdfStyles(pdfSettings, 'insurance_info', { 
    isContainer: true,
    ...styles.insuranceInfo,
    width: '40%'
  });
  const insuranceTextStyles = getPdfStyles(pdfSettings, 'insurance_info', { isContainer: false });

  // Styles pour le slogan et son conteneur
  const sloganContainerStyles = getPdfStyles(pdfSettings, 'company_slogan', { isContainer: true });
  const sloganTextStyles = getPdfStyles(pdfSettings, 'company_slogan', { isContainer: false });

  // Styles pour les infos société et leur conteneur
  const companyInfoContainerStyles = getPdfStyles(pdfSettings, 'company_address', { isContainer: true });
  const companyInfoTextStyles = getPdfStyles(pdfSettings, 'company_address', { isContainer: false });

  return (
    <View style={styles.container}>
      <View style={headerContainerStyles}>
        <View style={logoContainerStyles}>
          <Image src={logoUrl} style={logoStyles} />
        </View>
        
        <View style={insuranceContainerStyles}>
          <Text style={insuranceTextStyles}>Assurance MAAF PRO</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile décennale</Text>
        </View>
      </View>

      <View style={sloganContainerStyles}>
        <Text style={sloganTextStyles}>{slogan}</Text>
      </View>
      
      {company && (
        <View style={companyInfoContainerStyles}>
          <Text style={companyInfoTextStyles}>
            {company.name} - {company.address} - {company.postal_code} {company.city}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  logoContainer: {
    flex: 1
  },
  logo: {
    objectFit: 'contain'
  },
  insuranceInfo: {
    // Les styles spécifiques sont maintenant appliqués via getPdfStyles
  }
});

