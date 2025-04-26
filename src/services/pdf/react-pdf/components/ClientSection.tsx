
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ClientSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ClientSection = ({ pdfSettings, projectState }: ClientSectionProps) => {
  const clientData = projectState.client?.display_data || 'Données client non renseignées';
  
  const titleStyles = getPdfStyles(pdfSettings, 'client_title', { isContainer: false });
  const contentStyles = getPdfStyles(pdfSettings, 'client_content', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'client_content', { isContainer: true });
  
  return (
    <View style={styles.container}>
      <Text style={titleStyles}>Client / Maître d'ouvrage</Text>
      <View style={[styles.contentContainer, containerStyles]}>
        <Text style={contentStyles}>
          {clientData}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  contentContainer: {
    marginTop: 6,
    padding: 6,
    borderRadius: 2
  }
});
