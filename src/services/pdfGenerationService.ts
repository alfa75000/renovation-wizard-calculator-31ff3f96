
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

// Importer les constantes et les utilitaires
import { 
  DARK_BLUE, 
  PDF_STYLES, 
  PDF_MARGINS, 
  TABLE_COLUMN_WIDTHS,
  formatPrice,
  formatQuantity
} from './pdf/pdfConstants';

// Importer les générateurs
import {
  generateFooter,
  formatMOFournitures,
  generateHeaderContent,
  generateCGVContent,
  generateSignatureContent,
  generateSalutationContent,
  generateStandardTotalsTable,
  generateTTCTable
} from './pdf/pdfGenerators';

// Initialiser pdfMake avec les polices
if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

// Helper function to format date
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Nouvelle fonction pour générer le PDF complet du devis
export const generateCompletePDF = async (
  fields: any[],
  company: any,
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  console.log('Génération du PDF complet du devis avec paramètres:', pdfSettings);
  
  try {
    // 1. Préparer les contenus des différentes parties
    // PARTIE 1: Contenu de la page de garde
    const coverContent = prepareCoverContent(fields, company, metadata, pdfSettings);
    
    // PARTIE 2: Contenu des détails des travaux
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // PARTIE 3: Contenu du récapitulatif
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // 2. Fusionner tous les contenus dans un seul document
    const docDefinition = {
      content: [
        // Page de garde
        ...coverContent,
        // Page(s) de détails
        { text: '', pageBreak: 'before' }, // Forcer un saut de page
        ...detailsContent,
        // Page(s) de récapitulatif
        { text: '', pageBreak: 'before' }, // Forcer un saut de page
        ...recapContent
      ],
      styles: PDF_STYLES,
      defaultStyle: {
        fontSize: 9,
        color: DARK_BLUE
      },
      pageMargins: PDF_MARGINS.COVER, // Utiliser les marges de la page de garde pour tout le document
      footer: function(currentPage: number, pageCount: number) {
        return generateFooter(metadata);
      },
      header: function(currentPage: number, pageCount: number) {
        // Ne pas afficher d'en-tête sur la première page (page de garde)
        if (currentPage === 1) return null;
        
        // Sur les autres pages, afficher l'en-tête standard
        return generateHeaderContent(metadata, currentPage, pageCount);
      }
    };
    
    // 3. Générer et télécharger le PDF complet
    pdfMake.createPdf(docDefinition).download(`devis-complet-${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF complet généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    throw error;
  }
};

// Fonction auxiliaire pour préparer le contenu de la page de garde
function prepareCoverContent(fields: any[], company: any, metadata?: ProjectMetadata, pdfSettings?: PdfSettings) {
  console.log('Préparation du contenu de la page de garde avec paramètres PDF:', pdfSettings);
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  const content = [];

  // Logo et assurance sur la même ligne
  content.push({
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
          {
            text: 'Assurance MAAF PRO',
            fontSize: pdfSettings?.elements?.company_info?.fontSize || 10,
            color: pdfSettings?.elements?.company_info?.color || DARK_BLUE,
            alignment: pdfSettings?.elements?.company_info?.alignment || 'right'
          },
          {
            text: 'Responsabilité civile',
            fontSize: pdfSettings?.elements?.company_info?.fontSize || 10,
            color: pdfSettings?.elements?.company_info?.color || DARK_BLUE,
            alignment: pdfSettings?.elements?.company_info?.alignment || 'right'
          },
          {
            text: 'Responsabilité civile décennale',
            fontSize: pdfSettings?.elements?.company_info?.fontSize || 10,
            color: pdfSettings?.elements?.company_info?.color || DARK_BLUE,
            alignment: pdfSettings?.elements?.company_info?.alignment || 'right'
          }
        ],
        alignment: 'right'
      }
    ]
  });

  // Slogan de l'entreprise
  const sloganElement = {
    text: company?.slogan || 'Entreprise Générale du Bâtiment',
    fontFamily: pdfSettings?.elements?.company_slogan?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.company_slogan?.fontSize || 12,
    bold: pdfSettings?.elements?.company_slogan?.isBold !== undefined ? pdfSettings.elements.company_slogan.isBold : true,
    italic: pdfSettings?.elements?.company_slogan?.isItalic || false,
    color: pdfSettings?.elements?.company_slogan?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.company_slogan?.alignment || 'left',
    margin: [
      pdfSettings?.elements?.company_slogan?.spacing?.left || 0,
      pdfSettings?.elements?.company_slogan?.spacing?.top || 10,
      pdfSettings?.elements?.company_slogan?.spacing?.right || 0,
      pdfSettings?.elements?.company_slogan?.spacing?.bottom || 20
    ]
  };

  if (pdfSettings?.elements?.company_slogan?.border) {
    const border = pdfSettings.elements.company_slogan.border;
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      content.push({
        table: {
          widths: ['*'],
          body: [[sloganElement]]
        },
        layout: {
          hLineWidth: (i: number) => {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: (i: number) => {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: () => border.color || DARK_BLUE,
          vLineColor: () => border.color || DARK_BLUE
        }
      });
    } else {
      content.push(sloganElement);
    }
  } else {
    content.push(sloganElement);
  }

  // Coordonnées société
  const companyInfoElement = {
    text: `Société ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
    fontFamily: pdfSettings?.elements?.company_info?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.company_info?.fontSize || 11,
    bold: pdfSettings?.elements?.company_info?.isBold !== undefined ? pdfSettings.elements.company_info.isBold : true,
    italic: pdfSettings?.elements?.company_info?.isItalic || false,
    color: pdfSettings?.elements?.company_info?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.company_info?.alignment || 'left',
    margin: [
      pdfSettings?.elements?.company_info?.spacing?.left || 0,
      pdfSettings?.elements?.company_info?.spacing?.top || 0,
      pdfSettings?.elements?.company_info?.spacing?.right || 0,
      pdfSettings?.elements?.company_info?.spacing?.bottom || 3
    ]
  };

  // Appliquer les bordures aux coordonnées société si définies
  if (pdfSettings?.elements?.company_info?.border) {
    const border = pdfSettings.elements.company_info.border;
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      content.push({
        table: {
          widths: ['*'],
          body: [[companyInfoElement]]
        },
        layout: {
          hLineWidth: (i: number) => {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: (i: number) => {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: () => border.color || DARK_BLUE,
          vLineColor: () => border.color || DARK_BLUE
        }
      });
    } else {
      content.push(companyInfoElement);
    }
  } else {
    content.push(companyInfoElement);
  }

  // Téléphone et Email
  content.push({
    columns: [
      {
        width: 25,
        text: 'Tél:',
        fontSize: pdfSettings?.elements?.contact_labels?.fontSize || 10,
        fontFamily: pdfSettings?.elements?.contact_labels?.fontFamily || 'Roboto',
        color: pdfSettings?.elements?.contact_labels?.color || DARK_BLUE,
        bold: pdfSettings?.elements?.contact_labels?.isBold !== undefined ? pdfSettings.elements.contact_labels.isBold : false,
        italic: pdfSettings?.elements?.contact_labels?.isItalic || false
      },
      {
        width: '*',
        text: company?.tel1 || '',
        fontSize: pdfSettings?.elements?.contact_values?.fontSize || 10,
        fontFamily: pdfSettings?.elements?.contact_values?.fontFamily || 'Roboto',
        color: pdfSettings?.elements?.contact_values?.color || DARK_BLUE,
        bold: pdfSettings?.elements?.contact_values?.isBold !== undefined ? pdfSettings.elements.contact_values.isBold : false,
        italic: pdfSettings?.elements?.contact_values?.isItalic || false
      }
    ],
    columnGap: 1,
    margin: [0, 3, 0, 0]
  });

  if (company?.tel2) {
    content.push({
      columns: [
        {
          width: 25,
          text: '',
          fontSize: pdfSettings?.elements?.contact_labels?.fontSize || 10
        },
        {
          width: '*',
          text: company.tel2,
          fontSize: pdfSettings?.elements?.contact_values?.fontSize || 10,
          fontFamily: pdfSettings?.elements?.contact_values?.fontFamily || 'Roboto',
          color: pdfSettings?.elements?.contact_values?.color || DARK_BLUE,
          bold: pdfSettings?.elements?.contact_values?.isBold !== undefined ? pdfSettings.elements.contact_values.isBold : false,
          italic: pdfSettings?.elements?.contact_values?.isItalic || false
        }
      ],
      columnGap: 1,
      margin: [0, 0, 0, 0]
    });
  }

  content.push({
    columns: [
      {
        width: 25,
        text: 'Mail:',
        fontSize: pdfSettings?.elements?.contact_labels?.fontSize || 10,
        fontFamily: pdfSettings?.elements?.contact_labels?.fontFamily || 'Roboto',
        color: pdfSettings?.elements?.contact_labels?.color || DARK_BLUE,
        bold: pdfSettings?.elements?.contact_labels?.isBold !== undefined ? pdfSettings.elements.contact_labels.isBold : false,
        italic: pdfSettings?.elements?.contact_labels?.isItalic || false
      },
      {
        width: '*',
        text: company?.email || '',
        fontSize: pdfSettings?.elements?.contact_values?.fontSize || 10,
        fontFamily: pdfSettings?.elements?.contact_values?.fontFamily || 'Roboto',
        color: pdfSettings?.elements?.contact_values?.color || DARK_BLUE,
        bold: pdfSettings?.elements?.contact_values?.isBold !== undefined ? pdfSettings.elements.contact_values.isBold : false,
        italic: pdfSettings?.elements?.contact_values?.isItalic || false
      }
    ],
    columnGap: 1,
    margin: [0, 5, 0, 0]
  });

  // Espace avant devis
  { content.push({ text: '', margin: [0, 30, 0, 0] }) };
    
  // Numéro et date du devis
  const devisNumberElement = {
    text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `,
    fontSize: pdfSettings?.elements?.devis_number?.fontSize || 10,
    fontFamily: pdfSettings?.elements?.devis_number?.fontFamily || 'Roboto',
    color: pdfSettings?.elements?.devis_number?.color || DARK_BLUE,
    bold: pdfSettings?.elements?.devis_number?.isBold !== undefined ? pdfSettings.elements.devis_number.isBold : false,
    italic: pdfSettings?.elements?.devis_number?.isItalic || false
  };

  const validityElement = {
    text: ` (Validité de l'offre : 3 mois.)`,
    fontSize: pdfSettings?.elements?.devis_validity?.fontSize || 9,
    fontFamily: pdfSettings?.elements?.devis_validity?.fontFamily || 'Roboto',
    italics: pdfSettings?.elements?.devis_validity?.isItalic !== undefined ? pdfSettings.elements.devis_validity.isItalic : true,
    color: pdfSettings?.elements?.devis_validity?.color || DARK_BLUE,
    bold: pdfSettings?.elements?.devis_validity?.isBold !== undefined ? pdfSettings.elements.devis_validity.isBold : false
  };

  content.push({
    columns: [
      {
        width: 25,
        text: '',
        fontSize: pdfSettings?.elements?.devis_number?.fontSize || 10
      },
      {
        width: '*',
        text: [devisNumberElement, validityElement]
      }
    ],
    columnGap: 1,
    margin: [0, 0, 0, 0]
  });
    
  // Espace avant Client
  { content.push({ text: '', margin: [0, 35, 0, 0] }) };
    
  // Client - Titre
  const clientTitleElement = {
    text: 'Client / Maître d\'ouvrage',
    fontSize: pdfSettings?.elements?.client_title?.fontSize || 10,
    fontFamily: pdfSettings?.elements?.client_title?.fontFamily || 'Roboto',
    color: pdfSettings?.elements?.client_title?.color || DARK_BLUE,
    bold: pdfSettings?.elements?.client_title?.isBold !== undefined ? pdfSettings.elements.client_title.isBold : false,
    italic: pdfSettings?.elements?.client_title?.isItalic || false,
    alignment: pdfSettings?.elements?.client_title?.alignment || 'left'
  };

  // Application des bordures pour le titre client si nécessaire
  if (pdfSettings?.elements?.client_title?.border) {
    const border = pdfSettings.elements.client_title.border;
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      content.push({
        columns: [
          { width: 25, text: '', fontSize: pdfSettings?.elements?.client_title?.fontSize || 10 },
          { 
            width: '*', 
            table: {
              widths: ['*'],
              body: [[clientTitleElement]]
            },
            layout: {
              hLineWidth: (i: number) => {
                if (i === 0) return border.top ? border.width || 1 : 0;
                if (i === 1) return border.bottom ? border.width || 1 : 0;
                return 0;
              },
              vLineWidth: (i: number) => {
                if (i === 0) return border.left ? border.width || 1 : 0;
                if (i === 1) return border.right ? border.width || 1 : 0;
                return 0;
              },
              hLineColor: () => border.color || DARK_BLUE,
              vLineColor: () => border.color || DARK_BLUE
            }
          }
        ],
        columnGap: 1
      });
    } else {
      content.push({
        columns: [
          { width: 25, text: '', fontSize: pdfSettings?.elements?.client_title?.fontSize || 10 },
          { width: '*', ...clientTitleElement }
        ],
        columnGap: 1
      });
    }
  } else {
    content.push({
      columns: [
        { width: 25, text: '', fontSize: pdfSettings?.elements?.client_title?.fontSize || 10 },
        { width: '*', ...clientTitleElement }
      ],
      columnGap: 1
    });
  }
    
  // Client - Contenu
  const clientContentElement = {
    text: client || '',
    fontSize: pdfSettings?.elements?.client_content?.fontSize || 10,
    fontFamily: pdfSettings?.elements?.client_content?.fontFamily || 'Roboto',
    color: pdfSettings?.elements?.client_content?.color || DARK_BLUE,
    lineHeight: 1.3,
    bold: pdfSettings?.elements?.client_content?.isBold !== undefined ? pdfSettings.elements.client_content.isBold : false,
    italic: pdfSettings?.elements?.client_content?.isItalic || false,
    alignment: pdfSettings?.elements?.client_content?.alignment || 'left'
  };

  // Application des bordures pour le contenu client si nécessaire
  if (pdfSettings?.elements?.client_content?.border) {
    const border = pdfSettings.elements.client_content.border;
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      content.push({
        columns: [
          { width: 25, text: '', fontSize: pdfSettings?.elements?.client_content?.fontSize || 10 },
          { 
            width: '*', 
            table: {
              widths: ['*'],
              body: [[clientContentElement]]
            },
            layout: {
              hLineWidth: (i: number) => {
                if (i === 0) return border.top ? border.width || 1 : 0;
                if (i === 1) return border.bottom ? border.width || 1 : 0;
                return 0;
              },
              vLineWidth: (i: number) => {
                if (i === 0) return border.left ? border.width || 1 : 0;
                if (i === 1) return border.right ? border.width || 1 : 0;
                return 0;
              },
              hLineColor: () => border.color || DARK_BLUE,
              vLineColor: () => border.color || DARK_BLUE
            }
          }
        ],
        columnGap: 15,
        margin: [0, 5, 0, 0]
      });
    } else {
      content.push({
        columns: [
          { width: 25, text: '', fontSize: pdfSettings?.elements?.client_content?.fontSize || 10 },
          { width: '*', ...clientContentElement }
        ],
        columnGap: 15,
        margin: [0, 5, 0, 0]
      });
    }
  } else {
    content.push({
      columns: [
        { width: 25, text: '', fontSize: pdfSettings?.elements?.client_content?.fontSize || 10 },
        { width: '*', ...clientContentElement }
      ],
      columnGap: 15,
      margin: [0, 5, 0, 0]
    });
  }
    
  // Espaces après les données client
  { content.push({ text: '', margin: [0, 5, 0, 0] }) };
  { content.push({ text: '', margin: [0, 5, 0, 0] }) };
  { content.push({ text: '', margin: [0, 5, 0, 0] }) };
  { content.push({ text: '', margin: [0, 5, 0, 0] }) };
  { content.push({ text: '', margin: [0, 5, 0, 0] }) };
    
  // Chantier - Titre
  const chantierTitleElement = {
    text: 'Chantier / Travaux',
    fontSize: pdfSettings?.elements?.chantier_title?.fontSize || 10,
    fontFamily: pdfSettings?.elements?.chantier_title?.fontFamily || 'Roboto',
    color: pdfSettings?.elements?.chantier_title?.color || DARK_BLUE,
    margin: [0, 0, 0, 5],
    bold: pdfSettings?.elements?.chantier_title?.isBold !== undefined ? pdfSettings.elements.chantier_title.isBold : false,
    italic: pdfSettings?.elements?.chantier_title?.isItalic || false,
    alignment: pdfSettings?.elements?.chantier_title?.alignment || 'left'
  };

  // Application des bordures pour le titre chantier si nécessaire
  if (pdfSettings?.elements?.chantier_title?.border) {
    const border = pdfSettings.elements.chantier_title.border;
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      content.push({
        table: {
          widths: ['*'],
          body: [[chantierTitleElement]]
        },
        layout: {
          hLineWidth: (i: number) => {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: (i: number) => {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: () => border.color || DARK_BLUE,
          vLineColor: () => border.color || DARK_BLUE
        }
      });
    } else {
      content.push(chantierTitleElement);
    }
  } else {
    content.push(chantierTitleElement);
  }
  
  // Ajouter les informations conditionnelles
  if (occupant) {
    const occupantElement = {
      text: occupant,
      fontSize: pdfSettings?.elements?.chantier_values?.fontSize || 10,
      fontFamily: pdfSettings?.elements?.chantier_values?.fontFamily || 'Roboto',
      color: pdfSettings?.elements?.chantier_values?.color || DARK_BLUE,
      margin: [0, 5, 0, 0],
      bold: pdfSettings?.elements?.chantier_values?.isBold !== undefined ? pdfSettings.elements.chantier_values.isBold : false,
      italic: pdfSettings?.elements?.chantier_values?.isItalic || false,
      alignment: pdfSettings?.elements?.chantier_values?.alignment || 'left'
    };

    // Application des bordures pour les valeurs chantier si nécessaire
    if (pdfSettings?.elements?.chantier_values?.border) {
      const border = pdfSettings.elements.chantier_values.border;
      const hasBorder = border.top || border.right || border.bottom || border.left;
      
      if (hasBorder) {
        content.push({
          table: {
            widths: ['*'],
            body: [[occupantElement]]
          },
          layout: {
            hLineWidth: (i: number) => {
              if (i === 0) return border.top ? border.width || 1 : 0;
              if (i === 1) return border.bottom ? border.width || 1 : 0;
              return 0;
            },
            vLineWidth: (i: number) => {
              if (i === 0) return border.left ? border.width || 1 : 0;
              if (i === 1) return border.right ? border.width || 1 : 0;
              return 0;
            },
            hLineColor: () => border.color || DARK_BLUE,
            vLineColor: () => border.color || DARK_BLUE
          }
        });
      } else {
        content.push(occupantElement);
      }
    } else {
      content.push(occupantElement);
    }
  }
  
  if (projectAddress) {
    const addressLabelElement = {
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontSize: pdfSettings?.elements?.chantier_labels?.fontSize || 10,
      fontFamily: pdfSettings?.elements?.chantier_labels?.fontFamily || 'Roboto',
      color: pdfSettings?.elements?.chantier_labels?.color || DARK_BLUE,
      margin: [0, 5, 0, 0],
      bold: pdfSettings?.elements?.chantier_labels?.isBold !== undefined ? pdfSettings.elements.chantier_labels.isBold : false,
      italic: pdfSettings?.elements?.chantier_labels?.isItalic || false,
      alignment: pdfSettings?.elements?.chantier_labels?.alignment || 'left'
    };

    // Application des bordures pour les labels chantier si nécessaire
    if (pdfSettings?.elements?.chantier_labels?.border) {
      const border = pdfSettings.elements.chantier_labels.border;
      const hasBorder = border.top || border.right || border.bottom || border.left;
      
      if (hasBorder) {
        content.push({
          table: {
            widths: ['*'],
            body: [[addressLabelElement]]
          },
          layout: {
            hLineWidth: (i: number) => {
              if (i === 0) return border.top ? border.width || 1 : 0;
              if (i === 1) return border.bottom ? border.width || 1 : 0;
              return 0;
            },
            vLineWidth: (i: number) => {
              if (i === 0) return border.left ? border.width || 1 : 0;
              if (i === 1) return border.right ? border.width || 1 : 0;
              return 0;
            },
            hLineColor: () => border.color || DARK_BLUE,
            vLineColor: () => border.color || DARK_BLUE
          }
        });
      } else {
        content.push(addressLabelElement);
      }
    } else {
      content.push(addressLabelElement);
    }
    
    const addressValueElement = {
      text: projectAddress,
      fontSize: pdfSettings?.elements?.chantier_values?.fontSize || 10,
      fontFamily: pdfSettings?.elements?.chantier_values?.fontFamily || 'Roboto',
      color: pdfSettings?.elements?.chantier_values?.color || DARK_BLUE,
      margin: [10, 3, 0, 0],
      bold: pdfSettings?.elements?.chantier_values?.isBold !== undefined ? pdfSettings.elements.chantier_values.isBold : false,
      italic: pdfSettings?.elements?.chantier_values?.isItalic || false,
      alignment: pdfSettings?.elements?.chantier_values?.alignment || 'left'
    };

    // Application des bordures pour les valeurs chantier si nécessaire
    if (pdfSettings?.elements?.chantier_values?.border) {
      const border = pdfSettings.elements.chantier_values.border;
      const hasBorder = border.top || border.right || border.bottom || border.left;
      
      if (hasBorder) {
        content.push({
          table: {
            widths: ['*'],
            body: [[addressValueElement]]
          },
          layout: {
            hLineWidth: (i: number) => {
              if (i === 0) return border.top ? border.width || 1 : 0;
              if (i === 1) return border.bottom ? border.width || 1 : 0;
              return 0;
            },
            vLineWidth: (i: number) => {
              if (i === 0) return border.left ? border.width || 1 : 0;
              if (i === 1) return border.right ? border.width || 1 : 0;
              return 0;
            },
            hLineColor: () => border.color || DARK_BLUE,
            vLineColor: () => border.color || DARK_BLUE
          },
          margin: [10, 3, 0, 0]
        });
      } else {
        content.push(addressValueElement);
      }
    } else {
      content.push(addressValueElement);
    }
  }
  
  if (projectDescription) {
    const descLabelElement = {
      text: 'Descriptif:',
      fontSize: pdfSettings?.elements?.chantier_labels?.fontSize || 10,
      fontFamily: pdfSettings?.elements?.chantier_labels?.fontFamily || 'Roboto',
      color: pdfSettings?.elements?.chantier_labels?.color || DARK_BLUE,
      margin: [0, 8, 0, 0],
      bold: pdfSettings?.elements?.chantier_labels?.isBold !== undefined ? pdfSettings.elements.chantier_labels.isBold : false,
      italic: pdfSettings?.elements?.chantier_labels?.isItalic || false,
      alignment: pdfSettings?.elements?.chantier_labels?.alignment || 'left'
    };

    // Application des bordures pour les labels chantier si nécessaire
    if (pdfSettings?.elements?.chantier_labels?.border) {
      const border = pdfSettings.elements.chantier_labels.border;
      const hasBorder = border.top || border.right || border.bottom || border.left;
      
      if (hasBorder) {
        content.push({
          table: {
            widths: ['*'],
            body: [[descLabelElement]]
          },
          layout: {
            hLineWidth: (i: number) => {
              if (i === 0) return border.top ? border.width || 1 : 0;
              if (i === 1) return border.bottom ? border.width || 1 : 0;
              return 0;
            },
            vLineWidth: (i: number) => {
              if (i === 0) return border.left ? border.width || 1 : 0;
              if (i === 1) return border.right ? border.width || 1 : 0;
              return 0;
            },
            hLineColor: () => border.color || DARK_BLUE,
            vLineColor: () => border.color || DARK_BLUE
          }
        });
      } else {
        content.push(descLabelElement);
      }
    } else {
      content.push(descLabelElement);
    }
    
    const descValueElement = {
      text: projectDescription,
      fontSize: pdfSettings?.elements?.chantier_values?.fontSize || 10,
      fontFamily: pdfSettings?.elements?.chantier_values?.fontFamily || 'Roboto',
      color: pdfSettings?.elements?.chantier_values?.color || DARK_BLUE,
      margin: [10, 3, 0, 0],
      bold: pdfSettings?.elements?.chantier_values?.isBold !== undefined ? pdfSettings.elements.chantier_values.isBold : false,
      italic: pdfSettings?.elements?.chantier_values?.isItalic || false,
      alignment: pdfSettings?.elements?.chantier_values?.alignment || 'left'
    };

    // Application des bordures pour les valeurs chantier si nécessaire
    if (pdfSettings?.elements?.chantier_values?.border) {
      const border = pdfSettings.elements.chantier_values.border;
      const hasBorder = border.top || border.right || border.bottom || border.left;
      
      if (hasBorder) {
        content.push({
          table: {
            widths: ['*'],
            body: [[descValueElement]]
          },
          layout: {
            hLineWidth: (i: number) => {
              if (i === 0) return border.top ? border.width || 1 : 0;
              if (i === 1) return border.bottom ? border.width || 1 : 0;
              return 0;
            },
            vLineWidth: (i: number) => {
              if (i === 0) return border.left ? border.width || 1 : 0;
              if (i === 1) return border.right ? border.width || 1 : 0;
              return 0;
            },
            hLineColor: () => border.color || DARK_BLUE,
            vLineColor: () => border.color || DARK_BLUE
          },
          margin: [10, 3, 0, 0]
        });
      } else {
        content.push(descValueElement);
      }
    } else {
      content.push(descValueElement);
    }
  }
  
  if (additionalInfo) {
    const additionalInfoElement = {
      text: additionalInfo,
      fontSize: pdfSettings?.elements?.chantier_values?.fontSize || 10,
      fontFamily: pdfSettings?.elements?.chantier_values?.fontFamily || 'Roboto',
      color: pdfSettings?.elements?.chantier_values?.color || DARK_BLUE,
      margin: [10, 15, 0, 0],
      bold: pdfSettings?.elements?.chantier_values?.isBold !== undefined ? pdfSettings.elements.chantier_values.isBold : false,
      italic: pdfSettings?.elements?.chantier_values?.isItalic || false,
      alignment: pdfSettings?.elements?.chantier_values?.alignment || 'left'
    };

    // Application des bordures pour les valeurs chantier si nécessaire
    if (pdfSettings?.elements?.chantier_values?.border) {
      const border = pdfSettings.elements.chantier_values.border;
      const hasBorder = border.top || border.right || border.bottom || border.left;
      
      if (hasBorder) {
        content.push({
          table: {
            widths: ['*'],
            body: [[additionalInfoElement]]
          },
          layout: {
            hLineWidth: (i: number) => {
              if (i === 0) return border.top ? border.width || 1 : 0;
              if (i === 1) return border.bottom ? border.width || 1 : 0;
              return 0;
            },
            vLineWidth: (i: number) => {
              if (i === 0) return border.left ? border.width || 1 : 0;
              if (i === 1) return border.right ? border.width || 1 : 0;
              return 0;
            },
            hLineColor: () => border.color || DARK_BLUE,
            vLineColor: () => border.color || DARK_BLUE
          },
          margin: [10, 15, 0, 0]
        });
      } else {
        content.push(additionalInfoElement);
      }
    } else {
      content.push(additionalInfoElement);
    }
  }
  
  // Filtrer les éléments null
  return content.filter(Boolean);
}

// Fonction auxiliaire pour préparer le contenu des détails des travaux
function prepareDetailsContent(
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) {
  console.log('Préparation du contenu des détails des travaux avec paramètres:', pdfSettings);
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer l'en-tête du tableau commun
  const tableHeaderRow = [
    { text: 'Description', style: 'tableHeader', alignment: 'left', color: DARK_BLUE },
    { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'TVA', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: DARK_BLUE }
  ];
  
  // Créer le contenu du document
  const docContent: any[] = [
    // Titre de la section - Utilisation des paramètres PDF si disponibles
    {
      text: 'DÉTAILS DES TRAVAUX',
      fontFamily: pdfSettings?.elements?.details_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.details_title?.fontSize || 12,
      bold: pdfSettings?.elements?.details_title?.isBold !== undefined ? pdfSettings.elements.details_title.isBold : true,
      italic: pdfSettings?.elements?.details_title?.isItalic || false,
      color: pdfSettings?.elements?.details_title?.color || DARK_BLUE,
      alignment: pdfSettings?.elements?.details_title?.alignment || 'center',
      margin: [
        pdfSettings?.elements?.details_title?.spacing?.left || 0,
        pdfSettings?.elements?.details_title?.spacing?.top || 10,
        pdfSettings?.elements?.details_title?.spacing?.right || 0,
        pdfSettings?.elements?.details_title?.spacing?.bottom || 20
      ]
    },
    // En-tête du tableau
    {
      table: {
        headerRows: 1,
        widths: TABLE_COLUMN_WIDTHS.DETAILS,
        body: [tableHeaderRow]
      },
      layout: {
        hLineWidth: function() { return 1; },
        vLineWidth: function() { return 0; },
        hLineColor: function() { return '#e5e7eb'; },
        fillColor: function(rowIndex: number) { return (rowIndex === 0) ? '#f3f4f6' : null; }
      },
      margin: [0, 0, 0, 10]
    }
  ];
  
  // Pour chaque pièce avec des travaux
  roomsWithTravaux.forEach((room, roomIndex) => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Ajouter le titre de la pièce
    docContent.push({
      text: room.name,
      style: 'roomTitle',
      fontSize: 9,
      bold: true,
      color: DARK_BLUE,
      fillColor: '#f3f4f6',
      margin: [0, 10, 0, 5]
    });
    
    // Créer le tableau pour cette pièce
    const tableBody = [];
    
    // Ajouter chaque travail au tableau
    travauxPiece.forEach((travail, index) => {
      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
      const totalHT = prixUnitaireHT * travail.quantite;
      
      // Construire le contenu de la description
      let descriptionLines = [];
      descriptionLines.push(`${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`);
      
      if (travail.description) {
        descriptionLines.push(travail.description);
      }
      
      if (travail.personnalisation) {
        descriptionLines.push(travail.personnalisation);
      }
      
      // Utiliser le nouveau format pour MO/Fournitures
      const moFournText = formatMOFournitures(travail);
      
      // Estimer le nombre de lignes dans la description
      let totalLines = 0;
      
      // Largeur approximative de la colonne de description en caractères
      const columnCharWidth = 80;
      
      // Estimer le nombre réel de lignes pour chaque portion de texte
      descriptionLines.forEach(line => {
        const textLines = Math.ceil(line.length / columnCharWidth);
        totalLines += textLines;
      });
      
      // Estimer aussi les lignes pour le texte MO/Fournitures
      const moFournLines = Math.ceil(moFournText.length / columnCharWidth);
      totalLines += moFournLines;
      
      // Calculer les marges supérieures pour centrer verticalement
      const topMargin = Math.max(0, 3 + (totalLines - 2) * 4);
      
      // Ajouter la ligne au tableau
      tableBody.push([
        // Colonne 1: Description
        { 
          stack: [
            { text: descriptionLines.join('\n'), fontSize: 9, lineHeight: 1.4 },
            { text: moFournText, fontSize: 7, lineHeight: 1.4 }
          ]
        },
        
        // Colonne 2: Quantité
        { 
          stack: [
            { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: 9 },
            { text: travail.unite, alignment: 'center', fontSize: 9 }
          ],
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 3: Prix unitaire
        { 
          text: formatPrice(prixUnitaireHT), 
          alignment: 'center',
          fontSize: 9,
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 4: TVA
        { 
          text: `${travail.tauxTVA}%`, 
          alignment: 'center',
          fontSize: 9,
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 5: Total HT
        { 
          text: formatPrice(totalHT), 
          alignment: 'center',
          fontSize: 9,
          margin: [0, topMargin, 0, 0]
        }
      ]);
      
      // Ajouter une ligne d'espacement entre les prestations
      if (index < travauxPiece.length - 1) {
        tableBody.push([
          { text: '', margin: [0, 2, 0, 2] },
          {}, {}, {}, {}
        ]);
      }
    });
    
    // Calculer le total HT pour cette pièce
    const pieceTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    // Ajouter la ligne de total pour cette pièce
    tableBody.push([
      { text: `Total HT ${room.name}`, colSpan: 4, alignment: 'left', fontSize: 9, bold: true, fillColor: '#f9fafb' },
      {}, {}, {},
      { text: formatPrice(pieceTotalHT), alignment: 'center', fontSize: 9, bold: true, fillColor: '#f9fafb' }
    ]);
    
    // Ajouter le tableau au document
    docContent.push({
      table: {
        headerRows: 0,
        widths: TABLE_COLUMN_WIDTHS.DETAILS,
        body: tableBody
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          if (i === 0 || i === node.table.body.length) {
            return 1;
          }
          
          const isEndOfPrestation = i < node.table.body.length && 
            ((node.table.body[i][0] && 
              node.table.body[i][0].text && 
              node.table.body[i][0].text.toString().includes('Total HT')) ||
            (i > 0 && node.table.body[i-1][0] && 
              node.table.body[i-1][0].text && 
              node.table.body[i-1][0].text.toString().includes('Total HT')));
          
          return isEndOfPrestation ? 1 : 0;
        },
        vLineWidth: function() {
          return 0;
        },
        hLineColor: function() {
          return '#e5e7eb';
        },
        paddingLeft: function() {
          return 4;
        },
        paddingRight: function() {
          return 4;
        },
        paddingTop: function() {
          return 2;
        },
        paddingBottom: function() {
          return 2;
        }
      },
      margin: [0, 0, 0, 15]
    });
  });
  
  return docContent;
}

// Fonction auxiliaire pour préparer le contenu du récapitulatif
function prepareRecapContent(
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) {
  console.log('Préparation du contenu du récapitulatif avec paramètres PDF:', pdfSettings);
  console.log('Éléments de récapitulatif:', pdfSettings?.elements?.recap_title);
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer le contenu du document
  const docContent: any[] = [
    // Titre du récapitulatif avec les paramètres personnalisés
    {
      text: 'RÉCAPITULATIF',
      fontFamily: pdfSettings?.elements?.recap_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.recap_title?.fontSize || 12,
      bold: pdfSettings?.elements?.recap_title?.isBold !== undefined ? pdfSettings.elements.recap_title.isBold : true,
      italic: pdfSettings?.elements?.recap_title?.isItalic || false,
      color: pdfSettings?.elements?.recap_title?.color || DARK_BLUE,
      alignment: pdfSettings?.elements?.recap_title?.alignment || 'center',
      margin: [
        pdfSettings?.elements?.recap_title?.spacing?.left || 0,
        pdfSettings?.elements?.recap_title?.spacing?.top || 10,
        pdfSettings?.elements?.recap_title?.spacing?.right || 0,
        pdfSettings?.elements?.recap_title?.spacing?.bottom || 20
      ],
      pageBreak: 'before'
    }
  ];
  
  // Ajout de la bordure si elle est définie
  // Vérification de la présence des paramètres de bordure
  if (pdfSettings?.elements?.recap_title?.border) {
    const border = pdfSettings.elements.recap_title.border;
    console.log('Bordures récapitulatif trouvées:', border);
    
    // Création de la structure de tableau pour appliquer des bordures
    // Utiliser un tableau pour encapsuler le texte avec des bordures
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      // Remplacer l'élément de texte simple par un tableau avec bordures
      docContent[0] = {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'RÉCAPITULATIF',
                fontFamily: pdfSettings?.elements?.recap_title?.fontFamily || 'Roboto',
                fontSize: pdfSettings?.elements?.recap_title?.fontSize || 12,
                bold: pdfSettings?.elements?.recap_title?.isBold !== undefined ? pdfSettings.elements.recap_title.isBold : true,
                italic: pdfSettings?.elements?.recap_title?.isItalic || false,
                color: pdfSettings?.elements?.recap_title?.color || DARK_BLUE,
                alignment: pdfSettings?.elements?.recap_title?.alignment || 'center',
                margin: [
                  pdfSettings?.elements?.recap_title?.spacing?.left || 0,
                  pdfSettings?.elements?.recap_title?.spacing?.top || 10,
                  pdfSettings?.elements?.recap_title?.spacing?.right || 0,
                  pdfSettings?.elements?.recap_title?.spacing?.bottom || 20
                ]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: function(i: number, node: any) {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: function(i: number, node: any) {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: function() {
            return border.color || DARK_BLUE;
          },
          vLineColor: function() {
            return border.color || DARK_BLUE;
          }
        },
        pageBreak: 'before',
        margin: [0, 0, 0, 20]
      };
    }
  }
  
  // ... Reste du code pour préparer le contenu du récapitulatif
  // Cette partie doit être implémentée selon le même modèle que dans le code existant
  
  return docContent;
}

// Fonction pour générer le PDF des détails
export const generateDetailsPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  // ... Le reste du code existant
};
