
import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
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
        style={[
          styles.page,
          {
            paddingTop: margins[0],
            paddingRight: margins[1],
            paddingBottom: margins[2],
            paddingLeft: margins[3]
          }
        ]}
      >
        <HeaderSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  }
});
