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
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  const content: PdfContent[] = [];
  
  // Logo et assurance sur la même ligne
  const logoElement = {
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

  // Ajout du logo s'il est activé
  if (pdfSettings?.logoSettings?.useDefaultLogo) {
    (logoElement.columns[0].stack as any[]).push({
      image: '/images/lrs-logo.jpg',
      width: pdfSettings.logoSettings.width || 172,
      height: pdfSettings.logoSettings.height || 72,
      margin: [0, 0, 0, 0]
    });
  } else {
    // Si pas de logo, ajouter un espace
    (logoElement.columns[0].stack as any[]).push({ text: '', margin: [0, 40, 0, 0] });
  }
  
  content.push(logoElement);
  
  // Définition du slogan
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  
  // Slogan avec styles personnalisables
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
  
  // Définition des colonnes
  const col1Width = 25;
  const col2Width = '*';
  
  // Coordonnées société - Nom et adresse combinés avec styles personnalisables
  content.push(
    applyElementStyles(
      { text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}` },
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
  
  // Tél et Mail avec styles personnalisables
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
          { text: company?.tel1 || '' },
          'contact_values',
          pdfSettings,
          { fontSize: 10, color: DARK_BLUE }
        )
      }
    ],
    columnGap: 1,
    margin: [0, 3, 0, 0]
  });
  
  // Deuxième numéro de téléphone s'il existe
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
  
  // Email avec styles personnalisables
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
          { text: company?.email || '' },
          'contact_values',
          pdfSettings,
          { fontSize: 10, color: DARK_BLUE }
        )
      }
    ],
    columnGap: 1,
    margin: [0, 5, 0, 0]
  });
  
  // Espace avant devis
  content.push({ text: '', margin: [0, 30, 0, 0] });
  
  // Numéro et date du devis avec styles personnalisables
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
            { text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} ` },
            'quote_number',
            pdfSettings,
            { fontSize: 10, color: DARK_BLUE }
          ),
          applyElementStyles(
            { text: ` (Validité de l'offre : 3 mois.)` },
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
  
  // Espace avant Client
  content.push({ text: '', margin: [0, 35, 0, 0] });
  
  // Client - Titre avec styles personnalisables
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
  
  // Client - Contenu avec styles personnalisables
  content.push({
    columns: [
      { width: col1Width, text: '', fontSize: 10 },
      { 
        width: col2Width, 
        text: applyElementStyles(
          { text: client || '', lineHeight: 1.3 },
          'client_content',
          pdfSettings,
          { fontSize: 10, color: DARK_BLUE }
        )
      }
    ],
    columnGap: 15,
    margin: [0, 5, 0, 0]
  });
  
  // Espaces après les données client
  content.push({ text: '', margin: [0, 5, 0, 0] });
  content.push({ text: '', margin: [0, 5, 0, 0] });
  content.push({ text: '', margin: [0, 5, 0, 0] });
  content.push({ text: '', margin: [0, 5, 0, 0] });
  content.push({ text: '', margin: [0, 5, 0, 0] });
  
  // Chantier - Titre avec styles personnalisables
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
  
  // Ajouter les informations conditionnelles avec styles personnalisables
  if (occupant) {
    content.push(
      applyElementStyles(
        { text: occupant },
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
  
  if (projectAddress) {
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
        { text: projectAddress },
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
  
  if (projectDescription) {
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
        { text: projectDescription },
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
  
  if (additionalInfo) {
    content.push(
      applyElementStyles(
        { text: additionalInfo },
        'project_values',
        pdfSettings,
        {
          fontSize: 10,
          color: DARK_BLUE,
          spacing: { top: 15, right: 0, bottom: 0, left: 10 }
        }
      )
    );
  }
  
  return content.filter(Boolean);
};
