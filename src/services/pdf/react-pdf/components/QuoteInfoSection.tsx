
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
  const quoteNumber = metadata?.devisNumber || 'XXXX-XX';
  const quoteDate = metadata?.dateDevis || new Date().toISOString();
  
  const quoteNumberStyles = getPdfStyles(pdfSettings, 'quote_number', { isContainer: false });
  const quoteDateStyles = getPdfStyles(pdfSettings, 'quote_date', { isContainer: false });
  const quoteValidityStyles = getPdfStyles(pdfSettings, 'quote_validity', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  
  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.quoteNumberText, quoteNumberStyles]}>
            DEVIS N° {quoteNumber}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.quoteDateText, quoteDateStyles]}>
            Date : {formatDate(quoteDate)}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.quoteValidityText, quoteValidityStyles]}>
            Validité : 3 mois
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  column: {
    flex: 1
  },
  quoteNumberText: {
    fontWeight: 'bold'
  },
  quoteDateText: {
    textAlign: 'center'
  },
  quoteValidityText: {
    textAlign: 'right'
  }
});
