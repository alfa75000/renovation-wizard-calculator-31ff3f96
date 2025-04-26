
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { getElementStyle, convertStyleToPdfStyle, convertPageMargins } from '../utils/styleUtils';
import { ProjectState } from '@/types';
import { configurePdfFonts, ensureSupportedFont } from '@/services/pdf/utils/fontUtils';
import { wrapWithBorders } from '@/services/pdf/utils/pdfUtils';

// Initialize pdfMake with fonts
configurePdfFonts();

export const generateInsuranceInfoPdf = async (pdfSettings: PdfSettings, projectState: ProjectState) => {
  try {
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
                applyElementStyle('Assurance MAAF PRO', 'insurance_info', pdfSettings),
                applyElementStyle('Responsabilité civile', 'insurance_info', pdfSettings),
                applyElementStyle('Responsabilité civile décennale', 'insurance_info', pdfSettings)
              ],
              alignment: 'right'
            }
          ],
          columnGap: 10,
          marginBottom: 20
        },

        // Company Slogan
        applyElementStyle(slogan, 'company_slogan', pdfSettings),

        // Company Contact Info
        {
          text: [
            applyElementStyle(`${company?.name || ''} - `, 'company_name', pdfSettings, true),
            applyElementStyle(`${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`, 'company_address', pdfSettings, true)
          ]
        },

        // Contact Details - Telephone
        {
          columns: [
            {
              width: 'auto',
              text: applyElementStyle('Tél:', 'contact_labels', pdfSettings, true)
            },
            {
              width: '*',
              text: applyElementStyle(company?.tel1 || '', 'contact_values', pdfSettings, true)
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
              text: applyElementStyle('', 'contact_labels', pdfSettings, true)
            },
            {
              width: '*',
              text: applyElementStyle(company.tel2, 'contact_values', pdfSettings, true)
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
              text: applyElementStyle('Mail:', 'contact_labels', pdfSettings, true)
            },
            {
              width: '*',
              text: applyElementStyle(company?.email || '', 'contact_values', pdfSettings, true)
            }
          ],
          columnGap: 5,
          marginBottom: 30
        },

        // Quote Information
        {
          text: [
            applyElementStyle(
              `Devis n°: ${projectState.metadata?.devisNumber || 'Non défini'} Du ${projectState.metadata?.dateDevis || new Date().toLocaleDateString()} `,
              'quote_info',
              pdfSettings,
              true
            ),
            applyElementStyle(
              '(Validité de l\'offre : 3 mois.)',
              'quote_validity',
              pdfSettings,
              true,
              {
                isItalic: true,
                fontSize: (getElementStyle(pdfSettings, 'quote_validity').fontSize || 10) - 1
              }
            )
          ],
          marginBottom: 35
        },

        // Client Section
        {
          stack: [
            applyElementStyle('Client / Maître d\'ouvrage', 'client_title', pdfSettings),
            applyElementStyle(projectState.metadata?.clientsData || 'Non spécifié', 'client_content', pdfSettings, false, {
              spacing: { left: 20 }
            })
          ],
          marginBottom: 30
        },

        // Project Section
        {
          stack: createProjectSectionStack(projectState, pdfSettings)
        }
      ].filter(Boolean), // Remove null elements
      
      // Add footer information
      footer: function(currentPage, pageCount) {
        if (!company) return null;
        
        const companyName = company.name || '';
        const capitalSocial = company.capital_social || '10000';
        const address = company.address || '';
        const postalCode = company.postal_code || '';
        const city = company.city || '';
        const siret = company.siret || '';
        const codeApe = company.code_ape || '';
        const tvaIntracom = company.tva_intracom || '';
        
        return applyElementStyle(
          `${companyName} - SASU au Capital de ${capitalSocial} € - ${address} ${postalCode} ${city} - Siret : ${siret} - Code APE : ${codeApe} - N° TVA Intracommunautaire : ${tvaIntracom}`,
          'footer_info',
          pdfSettings,
          false,
          {
            fontSize: 7,
            alignment: 'center',
            spacing: { top: 0, right: 40, bottom: 20, left: 40 }
          }
        );
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

// Helper function to create project section stack
const createProjectSectionStack = (projectState: ProjectState, pdfSettings: PdfSettings) => {
  const stack = [];
  
  // Title
  stack.push(applyElementStyle('Chantier / Travaux', 'project_title', pdfSettings));
  
  // Occupant if available
  if (projectState.metadata?.occupant) {
    stack.push(
      applyElementStyle(projectState.metadata.occupant, 'project_values', pdfSettings, false, {
        spacing: { left: 20, bottom: 5 }
      })
    );
  }
  
  // Project Address
  stack.push(applyElementStyle('Adresse du chantier / lieu d\'intervention:', 'project_labels', pdfSettings));
  stack.push(
    applyElementStyle(projectState.metadata?.adresseChantier || 'Non spécifiée', 'project_values', pdfSettings, false, {
      spacing: { left: 20, bottom: 8 }
    })
  );
  
  // Project Description
  stack.push(applyElementStyle('Descriptif:', 'project_labels', pdfSettings));
  stack.push(
    applyElementStyle(projectState.metadata?.descriptionProjet || 'Non spécifié', 'project_values', pdfSettings, false, {
      spacing: { left: 20, bottom: projectState.metadata?.infoComplementaire ? 15 : 0 }
    })
  );
  
  // Additional Information if available
  if (projectState.metadata?.infoComplementaire) {
    stack.push(
      applyElementStyle(projectState.metadata.infoComplementaire, 'project_values', pdfSettings, false, {
        spacing: { left: 20 }
      })
    );
  }
  
  return stack;
};

// Helper function to apply element styles and handle borders
const applyElementStyle = (content: string, elementId: string, pdfSettings: PdfSettings, inlineMode = false, overrideStyles = {}) => {
  const style = getElementStyle(pdfSettings, elementId);
  const mergedStyle = { ...style, ...overrideStyles };
  
  let contentObj: any = { 
    text: content,
    bold: mergedStyle.bold,
    italics: mergedStyle.italic,
    fontSize: mergedStyle.fontSize,
    color: mergedStyle.color,
    alignment: mergedStyle.alignment
  };
  
  if (!inlineMode && mergedStyle.spacing) {
    contentObj.margin = [
      mergedStyle.spacing.left || 0,
      mergedStyle.spacing.top || 0,
      mergedStyle.spacing.right || 0,
      mergedStyle.spacing.bottom || 0
    ];
  }
  
  if (!inlineMode && mergedStyle.border) {
    if (typeof mergedStyle.border === 'boolean') {
      if (mergedStyle.border) {
        return wrapWithBorders(contentObj, {
          top: true,
          right: true,
          bottom: true,
          left: true,
          color: '#000000',
          width: 1
        });
      }
    } else {
      const hasBorder = mergedStyle.border.top || mergedStyle.border.right || 
                       mergedStyle.border.bottom || mergedStyle.border.left;
      
      if (hasBorder) {
        return wrapWithBorders(contentObj, mergedStyle.border);
      }
    }
  }
  
  return contentObj;
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
