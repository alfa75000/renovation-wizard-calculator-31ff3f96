import { CompanyData, ProjectMetadata } from '@/types';
import { PdfContent } from '@/services/pdf/types/pdfTypes';
import { formatDate } from '@/services/pdf/utils/dateUtils';

export const prepareCoverContent = (
  fields: any[], 
  company: CompanyData | null,
  metadata?: ProjectMetadata
): PdfContent[] => {
  console.log('Préparation du contenu de la page de garde...');
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  // Définition des colonnes
  const col1Width = 25;
  const col2Width = '*';
  
  // Définition du slogan
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  
  // Construction du contenu
  const content: PdfContent[] = [
    // Logo et assurance sur la même ligne
    {
      columns: [
        {
          width: '60%',
          stack: [
            company?.logo_url ? {
              image: company.logo_url,
              width: 172,
              height: 72,
              margin: [0, 0, 0, 0]
            } : { text: '', margin: [0, 40, 0, 0] }
          ]
        },
        {
          width: '40%',
          stack: [
            { text: 'Assurance MAAF PRO', fontSize: 10, color: '#002855' },
            { text: 'Responsabilité civile', fontSize: 10, color: '#002855' },
            { text: 'Responsabilité civile décennale', fontSize: 10, color: '#002855' }
          ],
          alignment: 'right'
        }
      ]
    },
    
    // Slogan
    {
      text: slogan,
      fontSize: 12,
      bold: true,
      color: '#002855',
      margin: [0, 10, 0, 20]
    },
    
    // Coordonnées société - Nom et adresse combinés
    {
      text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
      fontSize: 11,
      bold: true,
      color: '#002855',
      margin: [0, 0, 0, 3]
    },
    
    // Tél et Mail
    {
      columns: [
        {
          width: col1Width,
          text: 'Tél:',
          fontSize: 10,
          color: '#002855'
        },
        {
          width: col2Width,
          text: company?.tel1 || '',
          fontSize: 10,
          color: '#002855'
        }
      ],
      columnGap: 1,
      margin: [0, 3, 0, 0]
    },
    
    company?.tel2 ? {
      columns: [
        {
          width: col1Width,
          text: '',
          fontSize: 10
        },
        {
          width: col2Width,
          text: company.tel2,
          fontSize: 10,
          color: '#002855'
        }
      ],
      columnGap: 1,
      margin: [0, 0, 0, 0]
    } : null,
    
    {
      columns: [
        {
          width: col1Width,
          text: 'Mail:',
          fontSize: 10,
          color: '#002855'
        },
        {
          width: col2Width,
          text: company?.email || '',
          fontSize: 10,
          color: '#002855'
        }
      ],
      columnGap: 1,
      margin: [0, 5, 0, 0]
    },
    
    // Espace avant devis
    { text: '', margin: [0, 30, 0, 0] },
    
    // Numéro et date du devis
    {
      columns: [
        {
          width: col1Width,
          text: '',
          fontSize: 10
        },
        {
          width: col2Width,
          text: [
            { text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `, fontSize: 10, color: '#002855' },
            { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: '#002855' }
          ]
        }
      ],
      columnGap: 1,
      margin: [0, 0, 0, 0]
    },
    
    // Espace avant Client
    { text: '', margin: [0, 35, 0, 0] },
    
    // Client - Titre
    {
      columns: [
        { width: col1Width, text: '', fontSize: 10 },
        { 
          width: col2Width, 
          text: 'Client / Maître d\'ouvrage',
          fontSize: 10,
          color: '#002855'
        }
      ],
      columnGap: 1
    },
    
    // Client - Contenu
    {
      columns: [
        { width: col1Width, text: '', fontSize: 10 },
        { 
          width: col2Width, 
          text: client || '',
          fontSize: 10,
          color: '#002855',
          lineHeight: 1.3
        }
      ],
      columnGap: 15,
      margin: [0, 5, 0, 0]
    },
    
    // Espaces après les données client
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    
    // Chantier - Titre
    {
      text: 'Chantier / Travaux',
      fontSize: 10,
      color: '#002855',
      margin: [0, 0, 0, 5]
    }
  ];
  
  // Ajouter les informations conditionnelles
  if (occupant) {
    content.push({
      text: occupant,
      fontSize: 10,
      color: '#002855',
      margin: [0, 5, 0, 0]
    });
  }
  
  if (projectAddress) {
    content.push({
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontSize: 10,
      color: '#002855',
      margin: [0, 5, 0, 0]
    });
    
    content.push({
      text: projectAddress,
      fontSize: 10,
      color: '#002855',
      margin: [10, 3, 0, 0]
    });
  }
  
  if (projectDescription) {
    content.push({
      text: 'Descriptif:',
      fontSize: 10,
      color: '#002855',
      margin: [0, 8, 0, 0]
    });
    
    content.push({
      text: projectDescription,
      fontSize: 10,
      color: '#002855',
      margin: [10, 3, 0, 0]
    });
  }
  
  if (additionalInfo) {
    content.push({
      text: additionalInfo,
      fontSize: 10,
      color: '#002855',
      margin: [10, 15, 0, 0]
    });
  }
  
  return content.filter(Boolean);
};
