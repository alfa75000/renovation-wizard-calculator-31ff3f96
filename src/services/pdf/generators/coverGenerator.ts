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
  console.log('[coverGenerator] Préparation du contenu de la page de garde...');
  console.log('[coverGenerator] Champs reçus:', fields);
  console.log('[coverGenerator] Company reçu par coverGenerator:', company);
  console.log('[coverGenerator] Logo URL dans company:', company?.logo_url);
  console.log('[coverGenerator] Logo URL dans metadata.company:', metadata?.company?.logo_url);
  console.log('[coverGenerator] PDF Settings logo:', pdfSettings?.logoSettings);
  
  // Si company est null mais metadata.company ne l'est pas, utilisez metadata.company
  if (!company && metadata?.company) {
    console.log('[coverGenerator] Utilisation de metadata.company car company est null');
    company = metadata.company;
    console.log('[coverGenerator] Company après récupération de metadata:', company);
    console.log('[coverGenerator] Logo URL dans company après récupération:', company?.logo_url);
  }
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  console.log('[coverGenerator] Informations extraites des champs:');
  console.log('[coverGenerator] - Numéro devis:', devisNumber);
  console.log('[coverGenerator] - Date devis:', devisDate);
  console.log('[coverGenerator] - Client:', client);
  
  // Définition des colonnes
  const col1Width = 25;
  const col2Width = '*';
  
  // Définition du slogan
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  console.log('[coverGenerator] Slogan utilisé:', slogan);
  
  // Construction du contenu
  const content: PdfContent[] = [];
  
  // Logo et assurance sur la même ligne avec styles personnalisables
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
  
  // Vérifier si on a un logo_url dans company
  const logoUrl = company?.logo_url;
  console.log('[coverGenerator] Logo URL avant la décision:', logoUrl);
  
  // Vérifier les paramètres du logo
  console.log('[coverGenerator] Vérification des paramètres du logo:');
  console.log('[coverGenerator] - pdfSettings existe:', !!pdfSettings);
  console.log('[coverGenerator] - logoSettings existe:', !!pdfSettings?.logoSettings);
  
  if (pdfSettings?.logoSettings) {
    console.log('[coverGenerator] - useDefaultLogo:', pdfSettings.logoSettings.useDefaultLogo);
    console.log('[coverGenerator] - logoUrl dans settings:', pdfSettings.logoSettings.logoUrl);
    console.log('[coverGenerator] - width:', pdfSettings.logoSettings.width);
    console.log('[coverGenerator] - height:', pdfSettings.logoSettings.height);
  }
  
  // Déterminer l'URL du logo à utiliser
  let logoUrlToUse = null;
  
  // Si le logo par défaut doit être utilisé
  if (pdfSettings?.logoSettings?.useDefaultLogo) {
    console.log('[coverGenerator] Le logo par défaut doit être utilisé');
    logoUrlToUse = '/images/lrs-logo.jpg';
    console.log('[coverGenerator] Logo par défaut à utiliser:', logoUrlToUse);
  } 
  // Sinon, si un logo personnalisé est défini dans les paramètres
  else if (pdfSettings?.logoSettings?.logoUrl) {
    console.log('[coverGenerator] Un logo personnalisé est défini dans les paramètres');
    logoUrlToUse = pdfSettings.logoSettings.logoUrl;
    console.log('[coverGenerator] Logo personnalisé à utiliser:', 'Logo personnalisé (Data URL)');
  }
  // Sinon, utiliser le logo de l'entreprise si disponible
  else if (logoUrl) {
    console.log('[coverGenerator] Utilisation du logo de l\'entreprise');
    logoUrlToUse = logoUrl;
    console.log('[coverGenerator] Logo de l\'entreprise à utiliser:', logoUrlToUse);
  }
  
  console.log('[coverGenerator] URL du logo final à utiliser:', logoUrlToUse ? 'Logo trouvé' : 'Aucun logo');
  
  // Vérifiez si nous avons un logo_url
  if (logoUrlToUse) {
    console.log('[coverGenerator] Logo URL trouvé, tentative ajout du logo');
    try {
      // Déterminer les dimensions
      const logoWidth = pdfSettings?.logoSettings?.width || 172;
      const logoHeight = pdfSettings?.logoSettings?.height || 72;
      console.log('[coverGenerator] Dimensions du logo:', { width: logoWidth, height: logoHeight });
      
      // Tenter d'ajouter l'image du logo
      (logoElement.columns[0].stack as any[]).push({
        image: logoUrlToUse,
        width: logoWidth,
        height: logoHeight,
        margin: [0, 0, 0, 0]
      });
      console.log('[coverGenerator] Logo ajouté avec succès avec dimensions:', {
        width: logoWidth,
        height: logoHeight
      });
    } catch (error) {
      console.error('[coverGenerator] Erreur lors de l\'ajout du logo:', error);
      // En cas d'erreur, ajouter un espace à la place
      (logoElement.columns[0].stack as any[]).push({ text: '', margin: [0, 40, 0, 0] });
      console.log('[coverGenerator] Espace ajouté à la place du logo suite à une erreur');
    }
  } else {
    console.log('[coverGenerator] Aucun logo_url trouvé, ajout d\'un espace');
    // Si pas de logo, ajouter un espace
    (logoElement.columns[0].stack as any[]).push({ text: '', margin: [0, 40, 0, 0] });
  }
  
  content.push(logoElement);
  console.log('[coverGenerator] Élément logo ajouté au contenu');
  
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
  
  console.log('[coverGenerator] Génération du contenu de la page de garde terminée');
  return content.filter(Boolean);
};
