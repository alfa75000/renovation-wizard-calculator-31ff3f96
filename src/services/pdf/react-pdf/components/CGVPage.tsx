import React from 'react';
import { Page, StyleSheet, View } from '@react-pdf/renderer';
import { CGVPageContent } from './CGVPageContent';
import { PageFooter } from './common/PageFooter';
import { PageHeader } from './common/PageHeader';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils';

interface CGVPageProps {
  pdfSettings?: PdfSettings;
  projectState: ProjectState;
}

export const CGVPage: React.FC<CGVPageProps> = ({ pdfSettings, projectState }) => {
  const pageMargins: MarginTuple = convertPageMargins(
    pdfSettings?.margins?.cgv as number[] | undefined
  );
  
  const pagePaddingBottom = pageMargins[2] + 50;

  return (
    <Page
      size="A4"
      style={[
        styles.page,
        {
          paddingTop: pageMargins[0],
          paddingRight: pageMargins[1],
          paddingBottom: pagePaddingBottom,
          paddingLeft: pageMargins[3]
        }
      ]}
    >
      <PageHeader
        pdfSettings={pdfSettings}
        metadata={projectState.metadata}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} sur ${totalPages}`}
      />
      
      <View style={styles.content}>
        <CGVPageContent pdfSettings={pdfSettings} />
      </View>
      
      <PageFooter
        pdfSettings={pdfSettings}
        company={projectState.metadata?.company}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  content: {
    flex: 1,
  }
});
