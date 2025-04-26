
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { getElementStyle, convertStyleToPdfStyle, convertPageMargins } from '../utils/styleUtils';
import { ProjectState } from '@/types';
import { configurePdfFonts, ensureSupportedFont, AVAILABLE_FONTS } from '@/services/pdf/utils/fontUtils';

// Initialize pdfMake with fonts
configurePdfFonts();

export const generateInsuranceInfoPdf = async (pdfSettings: PdfSettings, projectState: ProjectState) => {
  // Get style for insurance info
  const insuranceInfoStyle = getElementStyle(pdfSettings, 'insurance_info');
  const pdfStyle = convertStyleToPdfStyle(insuranceInfoStyle);
  
  // Get page margins with proper type handling
  const rawMargins = pdfSettings.margins?.cover as number[] | undefined;
  const pageMargins = convertPageMargins(rawMargins);
  
  // Ensure we are using a supported font
  const fontFamily = ensureSupportedFont(pdfStyle.font);
  
  // Create document definition
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: pageMargins,
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
        ...pdfStyle,
        font: fontFamily, // Ensure font compatibility
        fontSize: (pdfStyle.fontSize || 12) + 2,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      insuranceInfoText: {
        ...pdfStyle,
        font: fontFamily, // Ensure font compatibility
        margin: [0, 0, 0, 3]
      }
    },
    defaultStyle: {
      font: 'Roboto' // Set default font to ensure compatibility
    }
  };
  
  try {
    // Generate PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    
    // Open PDF in new tab
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
