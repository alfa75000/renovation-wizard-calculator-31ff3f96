
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Company } from '@/types';
import { format } from 'date-fns';

// Initialiser pdfMake avec les polices par défaut
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Constantes pour la mise en page
export const PDF_CONSTANTS = {
  DARK_BLUE: "#002855", // Bleu marine foncé
  DEFAULT_FONT_SIZE: 10,
  COLUMN1_WIDTH: 25, // Largeur de la première colonne pour l'alignement
  LOGO_PATH: "/lrs_logo.jpg"
};

// Interface pour les champs imprimables
export interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

/**
 * Convertit une image en Data URL
 */
export const convertImageToDataUrl = async (imagePath: string): Promise<{ dataUrl: string | null, exists: boolean }> => {
  try {
    // Créer une image
    const img = new Image();
    
    return new Promise((resolve) => {
      // Configurer les gestionnaires d'événements
      img.onload = () => {
        // Créer un canvas pour convertir l'image en Data URL
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Convertir en Data URL
          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve({ dataUrl, exists: true });
        } else {
          resolve({ dataUrl: null, exists: false });
        }
      };
      
      img.onerror = () => {
        resolve({ dataUrl: null, exists: false });
      };
      
      // Déclencher le chargement avec le chemin de l'image
      img.src = imagePath;
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'image:", error);
    return { dataUrl: null, exists: false };
  }
};

/**
 * Formater une date au format JJ / MM / AAAA
 */
export const formatPdfDate = (dateString: string | undefined): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  } catch (e) {
    return dateString;
  }
};

/**
 * Génère la définition de document pour la page de garde du devis
 */
export const createCoverPageDefinition = (fields: PrintableField[], company: Company | null, logoDataUrl: string | null, logoExists: boolean) => {
  // Définition des colonnes
  const col1Width = PDF_CONSTANTS.COLUMN1_WIDTH;
  const col2Width = '*';
  
  // Extraction des champs du devis
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  return {
    pageSize: 'A4',
    pageMargins: [30, 30, 30, 30],
    content: [
      // Logo et assurance sur la même ligne
      {
        columns: [
          // Logo à gauche
          {
            width: '60%',
            stack: [
              logoExists && logoDataUrl ? {
                image: logoDataUrl,
                width: 172,
                height: 72,
                margin: [0, 0, 0, 0]
              } : { text: '', margin: [0, 40, 0, 0] }
            ]
          },
          // Assurance à droite
          {
            width: '40%',
            stack: [
              { text: 'Assurance MAAF PRO', fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE, color: PDF_CONSTANTS.DARK_BLUE },
              { text: 'Responsabilité civile', fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE, color: PDF_CONSTANTS.DARK_BLUE },
              { text: 'Responsabilité civile décennale', fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE, color: PDF_CONSTANTS.DARK_BLUE }
            ],
            alignment: 'right'
          }
        ]
      },
      
      // Slogan - Aligné en colonne 1
      {
        text: company?.slogan || 'Entreprise Générale du Bâtiment',
        fontSize: 12,
        bold: true,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 10, 0, 20]
      },
      
      // Coordonnées société - Nom et adresse combinés
      {
        text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
        fontSize: 11,
        bold: true,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 0, 0, 3]
      },
      
      // Tél et Mail
      {
        columns: [
          {
            width: col1Width,
            text: 'Tél:',
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE
          },
          {
            width: col2Width,
            text: company?.tel1 || '',
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE
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
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE
          },
          {
            width: col2Width,
            text: company.tel2,
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE
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
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE
          },
          {
            width: col2Width,
            text: company?.email || '',
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE
          }
        ],
        columnGap: 1,
        margin: [0, 5, 0, 0]
      },
      
      // Espace avant devis
      { text: '', margin: [0, 30, 0, 0] },
      
      // Numéro et date du devis - TOUT aligné en colonne 2
      {
        columns: [
          {
            width: col1Width,
            text: '',
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE
          },
          {
            width: col2Width,
            text: [
              { text: `Devis n°: ${devisNumber || ''} Du ${formatPdfDate(devisDate)} `, fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE, color: PDF_CONSTANTS.DARK_BLUE },
              { text: ` (Validité de l'offre : ${validityOffer || '3 mois'}.)`, fontSize: 9, italics: true, color: PDF_CONSTANTS.DARK_BLUE }
            ]
          }
        ],
        columnGap: 1,
        margin: [0, 0, 0, 0]
      },
      
      // Espace avant Client
      { text: '', margin: [0, 35, 0, 0] },
      
      // Client - Titre aligné en colonne 2
      {
        columns: [
          { width: col1Width, text: '', fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE },
          { 
            width: col2Width, 
            text: 'Client / Maître d\'ouvrage',
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE
          }
        ],
        columnGap: 1
      },
      
      // Client - Contenu avec sauts de ligne préservés
      {
        columns: [
          { width: col1Width, text: '', fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE },
          { 
            width: col2Width, 
            text: client || '',
            fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
            color: PDF_CONSTANTS.DARK_BLUE,
            lineHeight: 1.3
          }
        ],
        columnGap: 15,
        margin: [0, 5, 0, 0]
      },
      
      // 5 lignes vides après les données client
      { text: '', margin: [0, 5, 0, 0] },
      { text: '', margin: [0, 5, 0, 0] },
      { text: '', margin: [0, 5, 0, 0] },
      { text: '', margin: [0, 5, 0, 0] },
      { text: '', margin: [0, 5, 0, 0] },
      
      // Chantier - Titre et contenu alignés en colonne 1
      {
        text: 'Chantier / Travaux',
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 0, 0, 5]
      },
      
      // Occupant
      occupant ? {
        text: occupant,
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 5, 0, 0]
      } : null,
      
      // Adresse du chantier
      projectAddress ? {
        text: 'Adresse du chantier / lieu d\'intervention:',
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 5, 0, 0]
      } : null,
      
      // Ensuite, uniquement la valeur de l'adresse en C2
      projectAddress ? {
        text: projectAddress,
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [10, 3, 0, 0]
      } : null,

      // Descriptif
      projectDescription ? {
        text: 'Descriptif:',
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 8, 0, 0]
      } : null,
      
      projectDescription ? {
        text: projectDescription,
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [10, 3, 0, 0]
      } : null,
      
      // Informations complémentaires
      additionalInfo ? {
        text: additionalInfo,
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [10, 15, 0, 0]
      } : null,
      
      // Pied de page avec taille réduite pour tenir sur une ligne
      {
        text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
        fontSize: 7,
        color: PDF_CONSTANTS.DARK_BLUE,
        alignment: 'center',
        margin: [0, 50, 0, 0],
        absolutePosition: { x: 20, y: 800 }
      }
    ].filter(Boolean),
    
    defaultStyle: {
      font: 'Roboto',
      fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
      color: PDF_CONSTANTS.DARK_BLUE,
      lineHeight: 1.3
    }
  };
};

/**
 * Créer un pied de page standard pour toutes les pages du devis
 */
export const createStandardFooter = (company: Company | null) => {
  return {
    text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
    fontSize: 7,
    color: PDF_CONSTANTS.DARK_BLUE,
    alignment: 'center',
    margin: [0, 10, 0, 0]
  };
};

/**
 * Créer un en-tête standard pour toutes les pages du devis (sauf page de garde)
 */
export const createStandardHeader = (company: Company | null, logoDataUrl: string | null, logoExists: boolean, pageTitle: string) => {
  return {
    columns: [
      // Logo à gauche (plus petit que sur la page de garde)
      {
        width: '30%',
        stack: [
          logoExists && logoDataUrl ? {
            image: logoDataUrl,
            width: 100,
            height: 42,
            margin: [0, 0, 0, 0]
          } : { text: company?.name || '', fontSize: 12, bold: true, color: PDF_CONSTANTS.DARK_BLUE }
        ]
      },
      // Titre de la page au centre
      {
        width: '40%',
        text: pageTitle,
        fontSize: 14,
        bold: true,
        color: PDF_CONSTANTS.DARK_BLUE,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      },
      // Numéro de page à droite (sera remplacé dynamiquement)
      {
        width: '30%',
        text: 'Page {current} / {total}',
        fontSize: 10,
        color: PDF_CONSTANTS.DARK_BLUE,
        alignment: 'right',
        margin: [0, 10, 0, 0]
      }
    ],
    margin: [0, 0, 0, 20]
  };
};

/**
 * Fonctions pour exporter et imprimer le PDF
 */
export const exportPDF = (docDefinition: any, fileName: string) => {
  pdfMake.createPdf(docDefinition).download(fileName);
};

export const printPDF = (docDefinition: any) => {
  pdfMake.createPdf(docDefinition).open();
};

/**
 * Affiche un aperçu du PDF dans un iframe
 */
export const previewPDF = (docDefinition: any, iframeId: string) => {
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBlob((blob) => {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (iframe) {
      const url = URL.createObjectURL(blob);
      iframe.src = url;
    }
  });
};
