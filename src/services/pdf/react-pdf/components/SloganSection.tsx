
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface SloganSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const SloganSection = ({ pdfSettings, projectState }: SloganSectionProps) => {
  const company = projectState.metadata?.company;
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  
  // Styles pour le slogan avec alignement dynamique
  const sloganTextStyles = getPdfStyles(pdfSettings, 'company_slogan', { isContainer: false });
  const sloganContainerStyles = getPdfStyles(pdfSettings, 'company_slogan', { isContainer: true });
  const sloganContainerAlignSelf = sloganTextStyles.textAlign === 'center' ? 'center' :
                                  sloganTextStyles.textAlign === 'right' ? 'flex-end' :
                                  'flex-start';

  return (
    <View style={styles.wrapperView}>
      <View style={[sloganContainerStyles, { alignSelf: sloganContainerAlignSelf }]}>
        <Text style={sloganTextStyles}>{slogan}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});
