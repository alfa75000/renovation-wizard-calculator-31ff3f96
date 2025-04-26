
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';
import { formatDate } from '@/services/pdf/utils/dateUtils';

interface QuoteInfoSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const QuoteInfoSection = ({ pdfSettings, projectState }: QuoteInfoSectionProps) => {
  const metadata = projectState.metadata;
  const quoteNumber = projectState.metadata?.devisNumber || 'XXXX-XX';
  const quoteDate = projectState.metadata?.dateDevis || new Date().toISOString();
  
  const quoteNumberStyles = getPdfStyles(pdfSettings, 'quote_number', { isContainer: false });
  const quoteDateStyles = getPdfStyles(pdfSettings, 'quote_date', { isContainer: false });
  const quoteValidityStyles = getPdfStyles(pdfSettings, 'quote_validity', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  
  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={quoteNumberStyles}>
            DEVIS N° {quoteNumber}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.center, quoteDateStyles]}>
            Du {formatDate(quoteDate)}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.right, quoteValidityStyles]}>
            Validité : 3 mois
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
//    justifyContent: 'space-between',
    width: '60%'
  },
  quoteNumberContainer: { // Nouveau style spécifique
    width: '40%', // Ajuste ce pourcentage
    // Applique les styles dynamiques ici ou dans le JSX
  },
  quoteDateContainer: {
    width: '30%', // Ajuste ce pourcentage
    // Applique les styles dynamiques ici ou dans le JSX
    // Ajoute textAlign: 'center' si tu veux centrer DANS ce conteneur
  },
  quoteValidityContainer: {
    width: '30%', // Ajuste ce pourcentage
    // Applique les styles dynamiques ici ou dans le JSX
    // Ajoute textAlign: 'right' si tu veux aligner à droite DANS ce conteneur
  }
});