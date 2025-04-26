
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ContactSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ContactSection = ({ pdfSettings, projectState }: ContactSectionProps) => {
  const company = projectState.metadata?.company;
  
  if (!company) return null;
  
  const labelStyles = getPdfStyles(pdfSettings, 'contact_labels', { isContainer: false });
  const valueStyles = getPdfStyles(pdfSettings, 'contact_values', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  
  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.contactRow}>
        <Text style={[styles.label, labelStyles]}>Tél:</Text>
        <Text style={[styles.value, valueStyles]}>{company.tel1 || 'Non renseigné'}</Text>
      </View>
      
      {company.tel2 && (
        <View style={styles.contactRow}>
          <Text style={[styles.label, labelStyles]}>Tél:</Text>
          <Text style={[styles.value, valueStyles]}>{company.tel2}</Text>
        </View>
      )}
      
      <View style={styles.contactRow}>
        <Text style={[styles.label, labelStyles]}>Mail:</Text>
        <Text style={[styles.value, valueStyles]}>{company.email || 'Non renseigné'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  label: {
    width: 40,
    marginRight: 10
  },
  value: {
    flex: 1
  }
});
