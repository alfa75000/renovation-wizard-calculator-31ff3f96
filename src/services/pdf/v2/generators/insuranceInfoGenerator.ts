import pdfMake from 'pdfmake/build/pdfmake';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { getElementStyle, convertStyleToPdfStyle, convertPageMargins } from '../utils/styleUtils';
import { ProjectState } from '@/types';
import { configurePdfFonts, ensureSupportedFont } from '@/services/pdf/utils/fontUtils';

// Initialize pdfMake with fonts
configurePdfFonts();

export const generateInsuranceInfoPdf = async (pdfSettings: PdfSettings, projectState: ProjectState) => {
  try {
    // Get style for insurance info
    const insuranceInfoStyle = getElementStyle(pdfSettings, 'insurance_info');
    const pdfStyle = convertStyleToPdfStyle(insuranceInfoStyle);
    
    // Get page margins with proper type handling
    const rawMargins = pdfSettings.margins?.cover as number[] | undefined;
    const pageMargins = convertPageMargins(rawMargins);
    
    // Ensure we are using a supported font, defaulting to Roboto
    const fontFamily = ensureSupportedFont(pdfStyle.font);
    
    // Create document definition with strict font settings
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: pageMargins,
      defaultStyle: {
        font: 'Roboto'
      },
      content: [
        // Logo
        {
          image: await getBase64ImageFromUrl('/lrs_logo.jpg'),
          width: pdfSettings.logoSettings.width || 150,
          height: pdfSettings.logoSettings.height || 70,
          alignment: pdfSettings.logoSettings.alignment || 'left',
          margin: [0, 0, 0, 10]
        },
        // Insurance Info Block
        {
          text: 'Informations d\'assurance',
          style: 'insuranceInfoTitle'
        },
        {
          text: 'N° RCS: 123 456 789',
          style: 'insuranceInfoText'
        },
        {
          text: 'N° Assurance: ALLIANZ 12345678',
          style: 'insuranceInfoText'
        },
        {
          text: 'N° TVA: FR 12 345 678 901',
          style: 'insuranceInfoText'
        }
      ],
      styles: {
        insuranceInfoTitle: {
          font: fontFamily,
          fontSize: (pdfStyle.fontSize || 12) + 2,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        insuranceInfoText: {
          font: fontFamily,
          fontSize: pdfStyle.fontSize || 12,
          margin: [0, 0, 0, 3]
        }
      }
    };

    // Generate and open PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.open();
    
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

// Helper function to get base64 image from URL
const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    // Return a placeholder or empty string if image can't be loaded
    return '';
  }
};
