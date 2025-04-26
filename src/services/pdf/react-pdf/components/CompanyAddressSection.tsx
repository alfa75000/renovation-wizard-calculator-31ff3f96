
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface CompanyAddressSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const CompanyAddressSection = ({ pdfSettings, projectState }: CompanyAddressSectionProps) => {
  const company = projectState.metadata?.company;
  
  if (!company) return null;
  
  // Styles pour les infos société avec alignement dynamique
  const companyInfoTextStyles = getPdfStyles(pdfSettings, 'company_address', { isContainer: false });
  const companyInfoContainerStyles = getPdfStyles(pdfSettings, 'company_address', { isContainer: true });
  const companyInfoContainerAlignSelf = companyInfoTextStyles.textAlign === 'center' ? 'center' :
                                      companyInfoTextStyles.textAlign === 'right' ? 'flex-end' :
                                      'flex-start';

  return (
    <View style={styles.wrapperView}>
      <View style={[companyInfoContainerStyles, { alignSelf: companyInfoContainerAlignSelf }]}>
        <Text style={companyInfoTextStyles}>
          {company.name} - {company.address} - {company.postal_code} {company.city}
        </Text>
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
