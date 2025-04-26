
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils';

// Imports des composants de la page de garde
import { HeaderSection } from './HeaderSection';
import { SloganSection } from './SloganSection';
import { CompanyAddressSection } from './CompanyAddressSection';
import { ContactSection } from './ContactSection';
import { QuoteInfoSection } from './QuoteInfoSection';
import { ClientSection } from './ClientSection';
import { ProjectSection } from './ProjectSection';
import { CoverFooterSection } from './CoverFooterSection';

interface CoverDocumentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const CoverDocument = ({ pdfSettings, projectState }: CoverDocumentProps) => {
  const margins: MarginTuple = convertPageMargins(
    pdfSettings.margins?.cover as number[] | undefined
  );

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
        {/* 1. HeaderSection (Logo + Infos Assurance) */}
        <HeaderSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 1 (space_after_header) */}
        <View style={{ height: 12 /* TODO: Rendre configurable (space_after_header) */ }} />
        
        {/* 2. Section Slogan */}
        <SloganSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 2 (space_after_slogan) */}
        <View style={{ height: 12 /* TODO: Rendre configurable (space_after_slogan) */ }} />
        
        {/* 3. Section Coordonnées Société */}
        <CompanyAddressSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 3 (space_after_address) */}
        <View style={{ height: 12 /* TODO: Rendre configurable (space_after_address) */ }} />
        
        {/* 4. ContactSection */}
        <ContactSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 4 (space_after_contact) */}
        <View style={{ height: 12 /* TODO: Rendre configurable (space_after_contact) */ }} />
        
        {/* 5. QuoteInfoSection */}
        <QuoteInfoSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 5 (space_after_quote_info) */}
        <View style={{ height: 12 /* TODO: Rendre configurable (space_after_quote_info) */ }} />
        
        {/* 6. ClientSection */}
        <ClientSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 6 (space_after_client_content) */}
        <View style={{ height: 12 /* TODO: Rendre configurable (space_after_client_content) */ }} />
        
        {/* 7. ProjectSection */}
        <ProjectSection 
          pdfSettings={pdfSettings}
          projectState={projectState}
        />
        
        {/* ESPACE VERTICAL 7 (space_before_footer) */}

        <View style={styles.contentGrower} /> 

        {/* 8. CoverFooterSection */}
        <CoverFooterSection 
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
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column'
  }

    contentGrower: {
    flexGrow: 1 // Dit à cette View de prendre tout l'espace vertical restant
  }

});
