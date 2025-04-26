
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { getElementStyle, convertStyleToPdfStyle, convertPageMargins } from '../utils/styleUtils';
import { ProjectState } from '@/types';
import { configurePdfFonts, ensureSupportedFont } from '@/services/pdf/utils/fontUtils';
import { DARK_BLUE } from '@/services/pdf/constants/pdfConstants';

// Initialize pdfMake with fonts
configurePdfFonts();

export const generateInsuranceInfoPdf = async (pdfSettings: PdfSettings, projectState: ProjectState) => {
  try {
    // Get styles for different sections
    const insuranceInfoStyle = getElementStyle(pdfSettings, 'insurance_info');
    const companyNameStyle = getElementStyle(pdfSettings, 'company_name');
    const companySloganStyle = getElementStyle(pdfSettings, 'company_slogan');
    const companyContactStyle = getElementStyle(pdfSettings, 'company_contact');
    const quoteInfoStyle = getElementStyle(pdfSettings, 'quote_info');
    const clientInfoStyle = getElementStyle(pdfSettings, 'client_info');
    const projectInfoStyle = getElementStyle(pdfSettings, 'project_info');

    // Convert styles to pdfMake format
    const insurancePdfStyle = convertStyleToPdfStyle(insuranceInfoStyle);
    const companyNamePdfStyle = convertStyleToPdfStyle(companyNameStyle);
    const companySloganPdfStyle = convertStyleToPdfStyle(companySloganStyle);
    const companyContactPdfStyle = convertStyleToPdfStyle(companyContactStyle);
    const quoteInfoPdfStyle = convertStyleToPdfStyle(quoteInfoStyle);
    const clientInfoPdfStyle = convertStyleToPdfStyle(clientInfoStyle);
    const projectInfoPdfStyle = convertStyleToPdfStyle(projectInfoStyle);
    
    // Get page margins
    const rawMargins = pdfSettings.margins?.cover as number[] | undefined;
    const pageMargins = convertPageMargins(rawMargins);
    
    // Get company data from project state
    const company = projectState.metadata?.company;
    const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
    
    // Create document definition
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: pageMargins,
      defaultStyle: {
        font: ensureSupportedFont(pdfSettings.fontFamily),
        fontSize: 12
      },
      content: [
        // Logo and Insurance Info
        {
          columns: [
            {
              width: '60%',
              stack: [
                {
                  image: await getBase64ImageFromUrl(company?.logo_url || '/lrs_logo.jpg'),
                  width: pdfSettings.logoSettings.width || 150,
                  height: pdfSettings.logoSettings.height || 70,
                  alignment: pdfSettings.logoSettings.alignment || 'left'
                }
              ]
            },
            {
              width: '40%',
              stack: [
                {
                  text: 'Assurance MAAF PRO',
                  ...insurancePdfStyle
                },
                {
                  text: 'Responsabilité civile',
                  ...insurancePdfStyle
                },
                {
                  text: 'Responsabilité civile décennale',
                  ...insurancePdfStyle
                }
              ],
              alignment: 'right'
            }
          ],
          columnGap: 10,
          marginBottom: 20
        },

        // Company Slogan
        {
          text: slogan,
          ...companySloganPdfStyle,
          marginBottom: 15
        },

        // Company Contact Info
        {
          text: [
            { text: `${company?.name || ''} - `, ...companyNamePdfStyle },
            { text: `${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`, ...companyContactPdfStyle }
          ],
          marginBottom: 10
        },

        // Contact Details
        {
          columns: [
            {
              width: 'auto',
              text: 'Tél:',
              ...companyContactPdfStyle
            },
            {
              width: '*',
              text: company?.tel1 || '',
              ...companyContactPdfStyle
            }
          ],
          columnGap: 5,
          marginBottom: 5
        },
        company?.tel2 ? {
          columns: [
            {
              width: 'auto',
              text: '',
              ...companyContactPdfStyle
            },
            {
              width: '*',
              text: company.tel2,
              ...companyContactPdfStyle
            }
          ],
          columnGap: 5,
          marginBottom: 5
        } : null,
        {
          columns: [
            {
              width: 'auto',
              text: 'Mail:',
              ...companyContactPdfStyle
            },
            {
              width: '*',
              text: company?.email || '',
              ...companyContactPdfStyle
            }
          ],
          columnGap: 5,
          marginBottom: 30
        },

        // Quote Information
        {
          text: [
            { 
              text: `Devis n°: ${projectState.metadata?.devisNumber || 'Non défini'} Du ${projectState.metadata?.dateDevis || new Date().toLocaleDateString()} `,
              ...quoteInfoPdfStyle
            },
            {
              text: '(Validité de l\'offre : 3 mois.)',
              ...quoteInfoPdfStyle,
              italics: true,
              fontSize: (quoteInfoPdfStyle.fontSize || 12) - 1
            }
          ],
          marginBottom: 35
        },

        // Client Section
        {
          stack: [
            {
              text: 'Client / Maître d\'ouvrage',
              ...clientInfoPdfStyle,
              bold: true,
              marginBottom: 5
            },
            {
              text: projectState.metadata?.clientsData || 'Non spécifié',
              ...clientInfoPdfStyle,
              marginLeft: 20
            }
          ],
          marginBottom: 30
        },

        // Project Section
        {
          stack: [
            {
              text: 'Chantier / Travaux',
              ...projectInfoPdfStyle,
              bold: true,
              marginBottom: 5
            },
            projectState.metadata?.occupant ? {
              text: projectState.metadata.occupant,
              ...projectInfoPdfStyle,
              marginLeft: 20,
              marginBottom: 5
            } : null,
            {
              text: 'Adresse du chantier / lieu d\'intervention:',
              ...projectInfoPdfStyle,
              marginBottom: 5
            },
            {
              text: projectState.metadata?.adresseChantier || 'Non spécifiée',
              ...projectInfoPdfStyle,
              marginLeft: 20,
              marginBottom: 8
            },
            {
              text: 'Descriptif:',
              ...projectInfoPdfStyle,
              marginBottom: 5
            },
            {
              text: projectState.metadata?.descriptionProjet || 'Non spécifié',
              ...projectInfoPdfStyle,
              marginLeft: 20,
              marginBottom: projectState.metadata?.infoComplementaire ? 15 : 0
            },
            projectState.metadata?.infoComplementaire ? {
              text: projectState.metadata.infoComplementaire,
              ...projectInfoPdfStyle,
              marginLeft: 20
            } : null
          ]
        }
      ].filter(Boolean) // Remove null elements
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
    return '';
  }
};
