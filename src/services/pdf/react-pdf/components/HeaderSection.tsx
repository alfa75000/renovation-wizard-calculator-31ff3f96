
import { View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getContainerStyles, getTextStyles } from '../utils/pdfStyleUtils';

interface HeaderSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const HeaderSection = ({ pdfSettings, projectState }: HeaderSectionProps) => {
  const company = projectState.metadata?.company;
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  const logoUrl = company?.logo_url || '/lrs_logo.jpg';
  const { logoSettings } = pdfSettings;

  const getAlignSelf = (alignment: 'left' | 'center' | 'right'): 'flex-start' | 'center' | 'flex-end' => {
    switch (alignment) {
      case 'left': return 'flex-start';
      case 'right': return 'flex-end';
      case 'center': return 'center';
      default: return 'flex-start';
    }
  };

  // Appliquer les styles dynamiques
  const headerContainerStyles = getContainerStyles(pdfSettings, 'default', styles.header);
  const logoContainerStyles = getContainerStyles(pdfSettings, 'default', {
    ...styles.logoContainer,
    width: logoSettings.width, 
    height: logoSettings.height
  });

  const logoStyles = {
    ...styles.logo,
    width: logoSettings.width,
    height: logoSettings.height,
    alignSelf: getAlignSelf(logoSettings.alignment)
  };

  // Styles pour les informations d'assurance
  const insuranceContainerStyles = getContainerStyles(pdfSettings, 'insurance_info', styles.insuranceInfo);
  const insuranceTextStyles = getTextStyles(pdfSettings, 'insurance_info', styles.insuranceText);
  
  // Styles pour le slogan de l'entreprise (si ajouté)
  const sloganStyles = getTextStyles(pdfSettings, 'company_slogan', {});

  return (
    <View style={headerContainerStyles}>
      <View style={logoContainerStyles}>
        <Image
          src={logoUrl}
          style={logoStyles}
        />
        {slogan && (
          <Text style={sloganStyles}>{slogan}</Text>
        )}
      </View>
      
      <View style={insuranceContainerStyles}>
        <Text style={insuranceTextStyles}>Assurance MAAF PRO</Text>
        <Text style={insuranceTextStyles}>Responsabilité civile</Text>
        <Text style={insuranceTextStyles}>Responsabilité civile décennale</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  logoContainer: {
    flex: 1
  },
  logo: {
    objectFit: 'contain'
  },
  insuranceInfo: {
    width: '40%',
    alignItems: 'flex-end'
  },
  insuranceText: {
    fontSize: 10,
    marginBottom: 2,
    color: '#333333'
  }
});
