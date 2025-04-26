
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
    
    // Create document definition
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: pageMargins,
      defaultStyle: {
        font: fontFamily,
        fontSize: pdfStyle.fontSize || 12
      },
      content: [
        // Logo section with styles
        {
          table: {
            widths: ['*'],
            body: [[
              {
                image: await getBase64ImageFromUrl('/lrs_logo.jpg'),
                width: pdfSettings.logoSettings.width || 150,
                height: pdfSettings.logoSettings.height || 70,
                alignment: pdfSettings.logoSettings.alignment || 'left',
                margin: [0, 0, 0, 10]
              }
            ]]
          },
          layout: 'noBorders'
        },
        // Insurance Info Block with full styling support
        {
          table: {
            widths: ['*'],
            body: [
              [{
                text: 'Informations d\'assurance',
                ...pdfStyle,
                fontSize: (pdfStyle.fontSize || 12) + 2,
                bold: true,
                margin: [0, 0, 0, 5]
              }],
              [{
                text: 'N° RCS: 123 456 789',
                ...pdfStyle
              }],
              [{
                text: 'N° Assurance: ALLIANZ 12345678',
                ...pdfStyle
              }],
              [{
                text: 'N° TVA: FR 12 345 678 901',
                ...pdfStyle
              }]
            ]
          },
          layout: {
            hLineWidth: function(i: number, node: any) {
              return pdfStyle.border ? pdfStyle.border[i === 0 ? 2 : 0] : 0;
            },
            vLineWidth: function(i: number) {
              return pdfStyle.border ? pdfStyle.border[i === 0 ? 3 : 1] : 0;
            },
            hLineColor: function() {
              return pdfStyle.borderColor ? pdfStyle.borderColor[0] : '#000000';
            },
            vLineColor: function() {
              return pdfStyle.borderColor ? pdfStyle.borderColor[1] : '#000000';
            },
            fillColor: function() {
              return pdfStyle.fillColor;
            },
            paddingLeft: function() {
              return pdfStyle.padding ? pdfStyle.padding[3] : 0;
            },
            paddingRight: function() {
              return pdfStyle.padding ? pdfStyle.padding[1] : 0;
            },
            paddingTop: function() {
              return pdfStyle.padding ? pdfStyle.padding[0] : 0;
            },
            paddingBottom: function() {
              return pdfStyle.padding ? pdfStyle.padding[2] : 0;
            }
          }
        }
      ]
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
