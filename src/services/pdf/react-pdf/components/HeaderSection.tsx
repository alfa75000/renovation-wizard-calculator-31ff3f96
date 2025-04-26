
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

  // Récupération des styles dynamiques (sans mélanger avec les styles locaux)
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

  // Styles pour le slogan et son conteneur
  const sloganContainerStyles = getPdfStyles(pdfSettings, 'company_slogan', { isContainer: true });
  const sloganTextStyles = getPdfStyles(pdfSettings, 'company_slogan', { isContainer: false });

  // Styles pour les infos société et leur conteneur
  const companyInfoContainerStyles = getPdfStyles(pdfSettings, 'company_address', { isContainer: true });
  const companyInfoTextStyles = getPdfStyles(pdfSettings, 'company_address', { isContainer: false });

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
