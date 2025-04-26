
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ClientSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ClientSection = ({ pdfSettings, projectState }: ClientSectionProps) => {
  const metadata = projectState.metadata;
  
  // On récupère les données clients pré-formatées
  const clientData = metadata?.clientsData || 'Données client non renseignées';
  
  const titleStyles = getPdfStyles(pdfSettings, 'client_title', { isContainer: false });
  const contentStyles = getPdfStyles(pdfSettings, 'client_content', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'client_content', { isContainer: true });
  
  return (
    <View style={styles.outerContainer}>
      <Text style={[styles.title, titleStyles]}>Client / Maître d'ouvrage</Text>
      <View style={[styles.contentContainer, containerStyles]}>
        <Text style={[styles.content, contentStyles]}>
          {clientData}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 0
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6
  },
  contentContainer: {
    padding: 6,
    borderRadius: 2
  },
  content: {
    fontSize: 12
  }
});
