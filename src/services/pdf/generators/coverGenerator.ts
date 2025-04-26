
import { CompanyData, ProjectMetadata } from '@/types';
import { PdfContent } from '@/services/pdf/types/pdfTypes';
import { formatDate } from '@/services/pdf/utils/dateUtils';
import { applyElementStyles, wrapWithBorders } from '@/services/pdf/utils/pdfUtils';
import { DARK_BLUE } from '@/services/pdf/constants/pdfConstants';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

export const prepareCoverContent = (
  fields: any[], 
  company: CompanyData | null,
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
): PdfContent[] => {
  console.log('[COVER DEBUG] === DÉBUT PRÉPARATION CONTENU COUVERTURE ===');
  console.log('[COVER DEBUG] Fields reçus:', fields);
  
  // If company is null but metadata.company isn't, use metadata.company
  if (!company && metadata?.company) {
    console.log('[COVER DEBUG] Utilisation de metadata.company car company est null');
    company = metadata.company;
  }
  
  // Extract field data and check if they are enabled
  const getFieldContent = (id: string) => {
    const field = fields.find(f => f.id === id);
    return field && field.enabled ? field.content : null;
  };
  
  // Get all required field contents
  const companyLogoContent = getFieldContent("companyLogo");
  const companyNameContent = getFieldContent("companyName");
  const clientContent = getFieldContent("client");
  const devisNumberContent = getFieldContent("devisNumber");
  const devisDateContent = getFieldContent("devisDate");
  const validityOfferContent = getFieldContent("validityOffer");
  const projectDescriptionContent = getFieldContent("projectDescription");
  const projectAddressContent = getFieldContent("projectAddress");
  const occupantContent = getFieldContent("occupant");
  const additionalInfoContent = getFieldContent("additionalInfo");
  
  // Define columns for layout
  const col1Width = 25;
  const col2Width = '*';
  
  // Company information
  const companyName = companyNameContent || company?.name || 'LRS Rénovation';
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  
  // Build content sections
  const content: PdfContent[] = [];
  
  // 1. HEADER SECTION: Logo and insurance info
  const headerElement = {
    columns: [
      {
        width: '60%',
        stack: []
      },
      {
        width: '40%',
        stack: [
          applyElementStyles(
            { text: 'Assurance MAAF PRO' },
            'insurance_info',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          ),
          applyElementStyles(
            { text: 'Responsabilité civile' },
            'insurance_info',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          ),
          applyElementStyles(
            { text: 'Responsabilité civile décennale' },
            'insurance_info',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        ],
        alignment: 'right'
      }
    ]
  };
  
  // Handle logo
  let logoUrl = companyLogoContent || company?.logo_url;
  
  if (!logoUrl && pdfSettings?.logoSettings?.useDefaultLogo) {
    logoUrl = '/images/lrs-logo.jpg';
    console.log('[COVER DEBUG] Utilisation du logo par défaut:', logoUrl);
  }
  
  if (logoUrl) {
    try {
      (headerElement.columns[0].stack as any[]).push({
        image: logoUrl,
        width: pdfSettings?.logoSettings?.width || 172,
        height: pdfSettings?.logoSettings?.height || 72,
        margin: [0, 0, 0, 0]
      });
    } catch (error) {
      console.error('[COVER DEBUG] Erreur lors de l\'ajout du logo:', error);
      (headerElement.columns[0].stack as any[]).push({ text: '', margin: [0, 40, 0, 0] });
    }
  } else {
    (headerElement.columns[0].stack as any[]).push({ text: '', margin: [0, 40, 0, 0] });
  }
  
  content.push(headerElement);
  
  // 2. COMPANY SECTION: Slogan and address
  if (slogan) {
    content.push(
      applyElementStyles(
        { text: slogan },
        'company_slogan',
        pdfSettings,
        {
          fontSize: 12,
          isBold: true,
          color: DARK_BLUE,
          spacing: { top: 10, right: 0, bottom: 20, left: 0 }
        }
      )
    );
  }
  
  if (companyName || company?.address) {
    const addressText = `${companyName} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`;
    content.push(
      applyElementStyles(
        { text: addressText },
        'company_address',
        pdfSettings,
        {
          fontSize: 11,
          isBold: true,
          color: DARK_BLUE,
          spacing: { top: 0, right: 0, bottom: 3, left: 0 }
        }
      )
    );
  }
  
  // 3. CONTACT SECTION: Phone and email
  if (company?.tel1) {
    content.push({
      columns: [
        {
          width: col1Width,
          text: applyElementStyles(
            { text: 'Tél:' },
            'contact_labels',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        },
        {
          width: col2Width,
          text: applyElementStyles(
            { text: company.tel1 },
            'contact_values',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        }
      ],
      columnGap: 1,
      margin: [0, 3, 0, 0]
    });
  }
  
  if (company?.tel2) {
    content.push({
      columns: [
        {
          width: col1Width,
          text: { text: '', fontSize: 10 }
        },
        {
          width: col2Width,
          text: applyElementStyles(
            { text: company.tel2 },
            'contact_values',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        }
      ],
      columnGap: 1,
      margin: [0, 0, 0, 0]
    });
  }
  
  if (company?.email) {
    content.push({
      columns: [
        {
          width: col1Width,
          text: applyElementStyles(
            { text: 'Mail:' },
            'contact_labels',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        },
        {
          width: col2Width,
          text: applyElementStyles(
            { text: company.email },
            'contact_values',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        }
      ],
      columnGap: 1,
      margin: [0, 5, 0, 0]
    });
  }
  
  // Space before quote section
  content.push({ text: '', margin: [0, 30, 0, 0] });
  
  // 4. QUOTE SECTION: Quote number and date
  if (devisNumberContent || devisDateContent || validityOfferContent) {
    const quoteText = [];
    
    if (devisNumberContent) {
      quoteText.push(`Devis n°: ${devisNumberContent} `);
    }
    
    if (devisDateContent) {
      quoteText.push(`Du ${formatDate(devisDateContent)} `);
    }
    
    content.push({
      columns: [
        {
          width: col1Width,
          text: { text: '', fontSize: 10 }
        },
        {
          width: col2Width,
          text: [
            applyElementStyles(
              { text: quoteText.join('') },
              'quote_number',
              pdfSettings,
              { fontSize: 10, color: DARK_BLUE }
            ),
            applyElementStyles(
              { text: ` (${validityOfferContent || 'Validité de l\'offre : 3 mois.'})` },
              'quote_validity',
              pdfSettings,
              { fontSize: 9, isItalic: true, color: DARK_BLUE }
            )
          ]
        }
      ],
      columnGap: 1,
      margin: [0, 0, 0, 0]
    });
  }
  
  // Space before client section
  content.push({ text: '', margin: [0, 35, 0, 0] });
  
  // 5. CLIENT SECTION
  if (clientContent) {
    // Client title
    content.push({
      columns: [
        { width: col1Width, text: '', fontSize: 10 },
        { 
          width: col2Width, 
          text: applyElementStyles(
            { text: 'Client / Maître d\'ouvrage' },
            'client_title',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        }
      ],
      columnGap: 1
    });
    
    // Client content
    content.push({
      columns: [
        { width: col1Width, text: '', fontSize: 10 },
        { 
          width: col2Width, 
          text: applyElementStyles(
            { text: clientContent, lineHeight: 1.3 },
            'client_content',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          )
        }
      ],
      columnGap: 15,
      margin: [0, 5, 0, 0]
    });
  }
  
  // Spaces after client data
  content.push({ text: '', margin: [0, 5, 0, 0] });
  content.push({ text: '', margin: [0, 5, 0, 0] });
  
  // 6. PROJECT SECTION
  const hasProjectData = projectDescriptionContent || projectAddressContent || occupantContent;
  
  if (hasProjectData) {
    // Project title
    content.push(
      applyElementStyles(
        { text: 'Chantier / Travaux' },
        'project_title',
        pdfSettings,
        {
          fontSize: 10,
          color: DARK_BLUE,
          spacing: { top: 0, right: 0, bottom: 5, left: 0 }
        }
      )
    );
    
    // Occupant info if available
    if (occupantContent) {
      content.push(
        applyElementStyles(
          { text: occupantContent },
          'project_values',
          pdfSettings,
          {
            fontSize: 10,
            color: DARK_BLUE,
            spacing: { top: 5, right: 0, bottom: 0, left: 0 }
          }
        )
      );
    }
    
    // Project address if available
    if (projectAddressContent) {
      content.push(
        applyElementStyles(
          { text: 'Adresse du chantier / lieu d\'intervention:' },
          'project_labels',
          pdfSettings,
          {
            fontSize: 10,
            color: DARK_BLUE,
            spacing: { top: 5, right: 0, bottom: 0, left: 0 }
          }
        )
      );
      
      content.push(
        applyElementStyles(
          { text: projectAddressContent },
          'project_values',
          pdfSettings,
          {
            fontSize: 10,
            color: DARK_BLUE,
            spacing: { top: 3, right: 0, bottom: 0, left: 10 }
          }
        )
      );
    }
    
    // Project description if available
    if (projectDescriptionContent) {
      content.push(
        applyElementStyles(
          { text: 'Descriptif:' },
          'project_labels',
          pdfSettings,
          {
            fontSize: 10,
            color: DARK_BLUE,
            spacing: { top: 8, right: 0, bottom: 0, left: 0 }
          }
        )
      );
      
      content.push(
        applyElementStyles(
          { text: projectDescriptionContent },
          'project_values',
          pdfSettings,
          {
            fontSize: 10,
            color: DARK_BLUE,
            spacing: { top: 3, right: 0, bottom: 0, left: 10 }
          }
        )
      );
    }
  }
  
  // 7. ADDITIONAL INFO SECTION
  if (additionalInfoContent) {
    content.push(
      applyElementStyles(
        { text: additionalInfoContent },
        'additional_info',
        pdfSettings,
        {
          fontSize: 10,
          color: DARK_BLUE,
          spacing: { top: 15, right: 0, bottom: 0, left: 10 }
        }
      )
    );
  }
  
  // 8. FOOTER SECTION
  if (company) {
    const footerText = `${company.name || ''} - SASU au Capital de ${company.capital_social || '10000'} € - ${company.address || ''} ${company.postal_code || ''} ${company.city || ''} - Siret : ${company.siret || ''} - Code APE : ${company.code_ape || ''} - N° TVA Intracommunautaire : ${company.tva_intracom || ''}`;
    
    // Add some space before the footer
    content.push({ text: '', margin: [0, 40, 0, 0] });
    
    // Add the footer
    content.push(
      applyElementStyles(
        { 
          text: footerText,
          fontSize: 7,
          alignment: 'center'
        },
        'cover_footer',
        pdfSettings,
        {
          fontSize: 7,
          color: DARK_BLUE,
          spacing: { top: 10, right: 0, bottom: 10, left: 0 }
        }
      )
    );
  }
  
  console.log('[COVER DEBUG] === FIN PRÉPARATION CONTENU COUVERTURE ===');
  
  return content.filter(Boolean);
};
