
import { Document, Page, View, Image, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { HeaderSection } from './HeaderSection';
import { convertPageMargins } from '../../v2/utils/styleUtils';

interface CoverDocumentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const CoverDocument = ({ pdfSettings, projectState }: CoverDocumentProps) => {
  const margins = convertPageMargins(pdfSettings.margins.cover);

  return (
    <Document>
      <Page 
        size="A4" 
        style={styles.page}
      >
        <View style={[
          styles.content,
          { 
            padding: `${margins[0]}pt ${margins[1]}pt ${margins[2]}pt ${margins[3]}pt`
          }
        ]}>
          <HeaderSection 
            pdfSettings={pdfSettings}
            projectState={projectState}
          />
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  content: {
    flex: 1
  }
});
