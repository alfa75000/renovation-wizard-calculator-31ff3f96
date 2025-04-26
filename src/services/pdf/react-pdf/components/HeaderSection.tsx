import { View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';

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

  return (
    <View style={styles.header}>
      <View style={[
        styles.logoContainer,
        { width: logoSettings.width, height: logoSettings.height }
      ]}>
        <Image
          src={logoUrl}
          style={[
            styles.logo,
            { 
              width: logoSettings.width,
              height: logoSettings.height,
              alignSelf: getAlignSelf(logoSettings.alignment)
            }
          ]}
        />
      </View>
      
      <View style={styles.insuranceInfo}>
        <Text style={styles.insuranceText}>Assurance MAAF PRO</Text>
        <Text style={styles.insuranceText}>Responsabilité civile</Text>
        <Text style={styles.insuranceText}>Responsabilité civile décennale</Text>
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
