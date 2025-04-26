
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
  const logoUrl = company?.logo_url || '/images/lrs-logo.jpg';
  const { logoSettings } = pdfSettings;

  const getAlignSelf = (alignment: 'left' | 'center' | 'right'): 'flex-start' | 'center' | 'flex-end' => {
    switch (alignment) {
      case 'left': return 'flex-start';
      case 'right': return 'flex-end';
      case 'center': return 'center';
      default: return 'flex-start';
    }
  };

  // Apply dynamic styles
  const headerContainerStyles = getContainerStyles(pdfSettings, 'default', styles.header);
  
  // Logo container styles
  const logoContainerStyles = getContainerStyles(pdfSettings, 'default', {
    ...styles.logoContainer,
    width: '60%'
  });

  // Logo styles
  const logoStyles = {
    ...styles.logo,
    width: logoSettings?.width || 150,
    height: logoSettings?.height || 70,
    alignSelf: getAlignSelf(logoSettings?.alignment || 'left')
  };

  // Styles for insurance information
  const insuranceContainerStyles = getContainerStyles(pdfSettings, 'insurance_info', styles.insuranceInfo);
  const insuranceTextStyles = getTextStyles(pdfSettings, 'insurance_info', styles.insuranceText);
  
  // Styles for company slogan
  const sloganStyles = getTextStyles(pdfSettings, 'company_slogan', {
    ...styles.sloganText,
    textAlign: pdfSettings.elements?.company_slogan?.alignment || 'left'
  });

  // Styles for company information
  const companyInfoStyles = getTextStyles(pdfSettings, 'company_address', styles.companyInfo);

  return (
    <View style={styles.container}>
      {/* Header with logo and insurance */}
      <View style={headerContainerStyles}>
        <View style={logoContainerStyles}>
          {logoUrl && (
            <Image
              src={logoUrl}
              style={logoStyles}
            />
          )}
        </View>
        
        <View style={insuranceContainerStyles}>
          <Text style={insuranceTextStyles}>Assurance MAAF PRO</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile</Text>
          <Text style={insuranceTextStyles}>Responsabilité civile décennale</Text>
        </View>
      </View>

      {/* Company information */}
      {slogan && (
        <Text style={sloganStyles}>{slogan}</Text>
      )}
      
      {company && (
        <Text style={companyInfoStyles}>
          {company.name} - {company.address} - {company.postal_code} {company.city}
        </Text>
      )}
      
      {/* Contact information will be added in next section */}
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
    width: '40%',
    alignItems: 'flex-end'
  },
  insuranceText: {
    fontSize: 10,
    marginBottom: 2,
    color: '#333333'
  },
  sloganText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#002855',
    marginTop: 10,
    marginBottom: 5
  },
  companyInfo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 3
  }
});
