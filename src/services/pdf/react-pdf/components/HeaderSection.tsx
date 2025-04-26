
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
  const logoUrl = '/lrs_logo.jpg';

  // Styles pour le conteneur principal du header
  const headerContainerStyles = getContainerStyles(pdfSettings, 'default', styles.header);
  
  // Styles pour le conteneur du logo
  const logoContainerStyles = getContainerStyles(pdfSettings, 'default', {
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

  // Styles pour les informations d'assurance - conteneur sans alignItems forcé
  const insuranceContainerStyles = getContainerStyles(pdfSettings, 'insurance_info', {
    ...styles.insuranceInfo,
    width: '40%',
  });
  
  // Styles pour le texte d'assurance - permet le paramétrage complet
  const insuranceTextStyles = getTextStyles(pdfSettings, 'insurance_info');
  
  // Styles pour le slogan de l'entreprise
  const sloganStyles = getTextStyles(pdfSettings, 'company_slogan');

  // Styles pour les informations de l'entreprise
  const companyInfoStyles = getTextStyles(pdfSettings, 'company_address');

  return (
    <View style={styles.container}>
      <View style={headerContainerStyles}>
        <View style={logoContainerStyles}>
          <Image
            src={logoUrl}
            style={logoStyles}
          />
        </View>
        
        <View style={insuranceContainerStyles}>
          <Text style={insuranceTextStyles}>Assurance MAAF PRO</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile décennale</Text>
        </View>
      </View>

      {slogan && (
        <Text style={sloganStyles}>{slogan}</Text>
      )}
      
      {company && (
        <Text style={companyInfoStyles}>
          {company.name} - {company.address} - {company.postal_code} {company.city}
        </Text>
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
    // Suppression de alignItems: 'flex-end' pour permettre l'alignement personnalisable
  }
});
