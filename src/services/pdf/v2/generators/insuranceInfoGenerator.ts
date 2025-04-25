
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { getElementStyle, convertStyleToPdfStyle, convertPageMargins } from '../utils/styleUtils';
import { ProjectState } from '@/features/project/reducers/projectReducer';

// Register fonts with pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateInsuranceInfoPdf = async (pdfSettings: PdfSettings, projectState: ProjectState) => {
  // Get style for insurance info
  const insuranceInfoStyle = getElementStyle(pdfSettings, 'insurance_info');
  const pdfStyle = convertStyleToPdfStyle(insuranceInfoStyle);
  
  // Get page margins
  const pageMargins = convertPageMargins(pdfSettings.margins.cover);
  
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
        fontSize: (pdfStyle.fontSize || 12) + 2,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      insuranceInfoText: {
        ...pdfStyle,
        margin: [0, 0, 0, 3]
      }
    }
  };
  
  // Generate PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  
  // Open PDF in new tab
  pdfDocGenerator.open();
  
  return true;
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
