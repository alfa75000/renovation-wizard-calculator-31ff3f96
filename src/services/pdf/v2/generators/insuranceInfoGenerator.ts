
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
    // Get styles for different sections with fallbacks if not defined in settings
    const insuranceInfoStyle = getElementStyle(pdfSettings, 'insurance_info');
    const companyNameStyle = getElementStyle(pdfSettings, 'company_name');
    const companySloganStyle = getElementStyle(pdfSettings, 'company_slogan');
    const companyContactStyle = getElementStyle(pdfSettings, 'company_contact');
    const quoteInfoStyle = getElementStyle(pdfSettings, 'quote_info');
    const clientInfoStyle = getElementStyle(pdfSettings, 'client_info');
    const clientTitleStyle = getElementStyle(pdfSettings, 'client_title');
    const clientContentStyle = getElementStyle(pdfSettings, 'client_content');
    const projectInfoStyle = getElementStyle(pdfSettings, 'project_info');
    const projectTitleStyle = getElementStyle(pdfSettings, 'project_title');
    const projectLabelsStyle = getElementStyle(pdfSettings, 'project_labels');
    const projectValuesStyle = getElementStyle(pdfSettings, 'project_values');
    const contactLabelsStyle = getElementStyle(pdfSettings, 'contact_labels');
    const contactValuesStyle = getElementStyle(pdfSettings, 'contact_values');
    const footerInfoStyle = getElementStyle(pdfSettings, 'footer_info');

    // Convert styles to pdfMake format
    const insurancePdfStyle = convertStyleToPdfStyle(insuranceInfoStyle);
    const companyNamePdfStyle = convertStyleToPdfStyle(companyNameStyle);
    const companySloganPdfStyle = convertStyleToPdfStyle(companySloganStyle);
    const companyContactPdfStyle = convertStyleToPdfStyle(companyContactStyle);
    const quoteInfoPdfStyle = convertStyleToPdfStyle(quoteInfoStyle);
    const clientInfoPdfStyle = convertStyleToPdfStyle(clientInfoStyle);
    const clientTitlePdfStyle = convertStyleToPdfStyle(clientTitleStyle);
    const clientContentPdfStyle = convertStyleToPdfStyle(clientContentStyle);
    const projectInfoPdfStyle = convertStyleToPdfStyle(projectInfoStyle);
    const projectTitlePdfStyle = convertStyleToPdfStyle(projectTitleStyle);
    const projectLabelsPdfStyle = convertStyleToPdfStyle(projectLabelsStyle);
    const projectValuesPdfStyle = convertStyleToPdfStyle(projectValuesStyle);
    const contactLabelsPdfStyle = convertStyleToPdfStyle(contactLabelsStyle);
    const contactValuesPdfStyle = convertStyleToPdfStyle(contactValuesStyle);
    const footerInfoPdfStyle = convertStyleToPdfStyle(footerInfoStyle);
    
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

        // Contact Details - Telephone
        {
          columns: [
            {
              width: 'auto',
              text: 'Tél:',
              ...contactLabelsPdfStyle
            },
            {
              width: '*',
              text: company?.tel1 || '',
              ...contactValuesPdfStyle
            }
          ],
          columnGap: 5,
          marginBottom: 5
        },
        // Second telephone number if available
        company?.tel2 ? {
          columns: [
            {
              width: 'auto',
              text: '',
              ...contactLabelsPdfStyle
            },
            {
              width: '*',
              text: company.tel2,
              ...contactValuesPdfStyle
            }
          ],
          columnGap: 5,
          marginBottom: 5
        } : null,
        // Email
        {
          columns: [
            {
              width: 'auto',
              text: 'Mail:',
              ...contactLabelsPdfStyle
            },
            {
              width: '*',
              text: company?.email || '',
              ...contactValuesPdfStyle
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
              ...clientTitlePdfStyle,
              bold: true,
              marginBottom: 5
            },
            {
              text: projectState.metadata?.clientsData || 'Non spécifié',
              ...clientContentPdfStyle,
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
              ...projectTitlePdfStyle,
              bold: true,
              marginBottom: 5
            },
            projectState.metadata?.occupant ? {
              text: projectState.metadata.occupant,
              ...projectValuesPdfStyle,
              marginLeft: 20,
              marginBottom: 5
            } : null,
            {
              text: 'Adresse du chantier / lieu d\'intervention:',
              ...projectLabelsPdfStyle,
              marginBottom: 5
            },
            {
              text: projectState.metadata?.adresseChantier || 'Non spécifiée',
              ...projectValuesPdfStyle,
              marginLeft: 20,
              marginBottom: 8
            },
            {
              text: 'Descriptif:',
              ...projectLabelsPdfStyle,
              marginBottom: 5
            },
            {
              text: projectState.metadata?.descriptionProjet || 'Non spécifié',
              ...projectValuesPdfStyle,
              marginLeft: 20,
              marginBottom: projectState.metadata?.infoComplementaire ? 15 : 0
            },
            projectState.metadata?.infoComplementaire ? {
              text: projectState.metadata.infoComplementaire,
              ...projectValuesPdfStyle,
              marginLeft: 20
            } : null
          ]
        }
      ].filter(Boolean), // Remove null elements
      
      // Add footer information
      footer: function(currentPage: number, pageCount: number) {
        if (!company) return null;
        
        const companyName = company.name || '';
        const capitalSocial = company.capital_social || '10000';
        const address = company.address || '';
        const postalCode = company.postal_code || '';
        const city = company.city || '';
        const siret = company.siret || '';
        const codeApe = company.code_ape || '';
        const tvaIntracom = company.tva_intracom || '';
        
        return {
          text: `${companyName} - SASU au Capital de ${capitalSocial} € - ${address} ${postalCode} ${city} - Siret : ${siret} - Code APE : ${codeApe} - N° TVA Intracommunautaire : ${tvaIntracom}`,
          ...footerInfoPdfStyle,
          fontSize: footerInfoPdfStyle.fontSize || 7,
          alignment: 'center',
          margin: [40, 0, 40, 20]
        };
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
    return '';
  }
};
