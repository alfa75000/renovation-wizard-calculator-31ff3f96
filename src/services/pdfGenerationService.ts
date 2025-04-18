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
  console.log('Préparation du contenu de la page de garde avec paramètres:', pdfSettings);
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  // Fonction pour formater la date
  const formatDate = (dateString: string | undefined) => {
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
  
  // Création du contenu avec styles personnalisés
  const content: any[] = [];
  
  // 1. Logo et assurance sur la même ligne
  content.push({
    columns: [
      // Logo à gauche
      {
        width: '60%',
        stack: [
          company?.logo_url ? {
            image: company.logo_url,
            width: pdfSettings?.elements?.company_logo?.width || 172,
            height: pdfSettings?.elements?.company_logo?.height || 72,
            margin: [0, 0, 0, 0]
          } : { text: '', margin: [0, 40, 0, 0] }
        ]
      },
      // Assurance à droite
      {
        width: '40%',
        stack: [
          {
            text: 'Assurance MAAF PRO',
            fontSize: pdfSettings?.elements?.company_insurance?.fontSize || 10,
            color: pdfSettings?.elements?.company_insurance?.color || DARK_BLUE
          },
          {
            text: 'Responsabilité civile',
            fontSize: pdfSettings?.elements?.company_insurance?.fontSize || 10,
            color: pdfSettings?.elements?.company_insurance?.color || DARK_BLUE
          },
          {
            text: 'Responsabilité civile décennale',
            fontSize: pdfSettings?.elements?.company_insurance?.fontSize || 10,
            color: pdfSettings?.elements?.company_insurance?.color || DARK_BLUE
          }
        ],
        alignment: 'right'
      }
    ]
  });
  
  // 2. Slogan
  const sloganElement = {
    text: company?.slogan || 'Entreprise Générale du Bâtiment',
    fontFamily: pdfSettings?.elements?.company_slogan?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.company_slogan?.fontSize || 12,
    bold: pdfSettings?.elements?.company_slogan?.isBold !== undefined ? 
          pdfSettings.elements.company_slogan.isBold : true,
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
  
  // Ajouter les bordures si définies
  if (pdfSettings?.elements?.company_slogan?.border) {
    const border = pdfSettings.elements.company_slogan.border;
    if (border.top || border.right || border.bottom || border.left) {
      content.push({
        table: {
          widths: ['*'],
          body: [[sloganElement]]
        },
        layout: {
          hLineWidth: function(i: number) {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: function(i: number) {
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
  
  // 3. Coordonnées société avec styles personnalisés
  const companyInfoElement = {
    text: `Société ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
    fontFamily: pdfSettings?.elements?.company_info?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.company_info?.fontSize || 11,
    bold: pdfSettings?.elements?.company_info?.isBold !== undefined ?
          pdfSettings.elements.company_info.isBold : true,
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
  
  // Ajouter les bordures pour company_info si définies
  if (pdfSettings?.elements?.company_info?.border) {
    const border = pdfSettings.elements.company_info.border;
    if (border.top || border.right || border.bottom || border.left) {
      content.push({
        table: {
          widths: ['*'],
          body: [[companyInfoElement]]
        },
        layout: {
          hLineWidth: function(i: number) {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: function(i: number) {
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
  
  // 4. Numéro de devis, date et validité
  const devisNumberElement = {
    text: `Devis n°: ${devisNumber || ''}`,
    fontFamily: pdfSettings?.elements?.devis_number?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.devis_number?.fontSize || 10,
    bold: pdfSettings?.elements?.devis_number?.isBold !== undefined ?
          pdfSettings.elements.devis_number.isBold : false,
    italic: pdfSettings?.elements?.devis_number?.isItalic || false,
    color: pdfSettings?.elements?.devis_number?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.devis_number?.alignment || 'left',
    margin: [25, 0, 0, 0]
  };

  const devisDateElement = {
    text: `Du ${formatDate(devisDate)}`,
    fontFamily: pdfSettings?.elements?.devis_date?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.devis_date?.fontSize || 10,
    bold: pdfSettings?.elements?.devis_date?.isBold !== undefined ?
          pdfSettings.elements.devis_date.isBold : false,
    italic: pdfSettings?.elements?.devis_date?.isItalic || false,
    color: pdfSettings?.elements?.devis_date?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.devis_date?.alignment || 'left',
    margin: [5, 0, 0, 0]
  };

  const devisValidityElement = {
    text: `(Validité de l'offre : 3 mois.)`,
    fontFamily: pdfSettings?.elements?.devis_validity?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.devis_validity?.fontSize || 9,
    bold: pdfSettings?.elements?.devis_validity?.isBold !== undefined ?
          pdfSettings.elements.devis_validity.isBold : false,
    italic: pdfSettings?.elements?.devis_validity?.isItalic || true,
    color: pdfSettings?.elements?.devis_validity?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.devis_validity?.alignment || 'left',
    margin: [5, 0, 0, 0]
  };

  // Regrouper les éléments du devis dans une ligne
  content.push({
    columns: [
      { width: 25, text: '' },
      {
        width: '*',
        columns: [
          devisNumberElement,
          devisDateElement,
          devisValidityElement
        ],
        columnGap: 1
      }
    ],
    margin: [0, 30, 0, 0]
  });

  // 5. Section Client
  // Titre Client
  const clientTitleElement = {
    text: 'Client / Maître d\'ouvrage',
    fontFamily: pdfSettings?.elements?.client_section_title?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.client_section_title?.fontSize || 10,
    bold: pdfSettings?.elements?.client_section_title?.isBold !== undefined ?
          pdfSettings.elements.client_section_title.isBold : false,
    italic: pdfSettings?.elements?.client_section_title?.isItalic || false,
    color: pdfSettings?.elements?.client_section_title?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.client_section_title?.alignment || 'left'
  };

  // Contenu Client
  const clientContentElement = {
    text: client || '',
    fontFamily: pdfSettings?.elements?.client_content?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.client_content?.fontSize || 10,
    bold: pdfSettings?.elements?.client_content?.isBold !== undefined ?
          pdfSettings.elements.client_content.isBold : false,
    italic: pdfSettings?.elements?.client_content?.isItalic || false,
    color: pdfSettings?.elements?.client_content?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.client_content?.alignment || 'left',
    lineHeight: 1.3
  };

  // Ajouter la section client avec le même système de bordures
  content.push({
    columns: [
      { width: 25, text: '' },
      {
        width: '*',
        stack: [
          // Appliquer les bordures au titre si définies
          pdfSettings?.elements?.client_section_title?.border ? {
            table: {
              widths: ['*'],
              body: [[clientTitleElement]]
            },
            layout: {
              hLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_section_title?.border?.top ? 
                pdfSettings?.elements?.client_section_title?.border?.width || 1 : 0,
              vLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_section_title?.border?.left ? 
                pdfSettings?.elements?.client_section_title?.border?.width || 1 : 0,
              hLineColor: () => pdfSettings?.elements?.client_section_title?.border?.color || DARK_BLUE,
              vLineColor: () => pdfSettings?.elements?.client_section_title?.border?.color || DARK_BLUE
            }
          } : clientTitleElement,
          
          // Appliquer les bordures au contenu si définies
          pdfSettings?.elements?.client_content?.border ? {
            table: {
              widths: ['*'],
              body: [[clientContentElement]]
            },
            layout: {
              hLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_content?.border?.top ? 
                pdfSettings?.elements?.client_content?.border?.width || 1 : 0,
              vLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_content?.border?.left ? 
                pdfSettings?.elements?.client_content?.border?.width || 1 : 0,
              hLineColor: () => pdfSettings?.elements?.client_content?.border?.color || DARK_BLUE,
              vLineColor: () => pdfSettings?.elements?.client_content?.border?.color || DARK_BLUE
            }
          } : clientContentElement
        ]
      }
    ],
    margin: [0, 35, 0, 0]
  });

  // 6. Section Chantier avec styles personnalisés
  // Titre principal Chantier
  const chantierTitleElement = {
    text: 'Chantier / Travaux',
    fontFamily: pdfSettings?.elements?.chantier_section_title?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.chantier_section_title?.fontSize || 10,
    bold: pdfSettings?.elements?.chantier_section_title?.isBold !== undefined ?
          pdfSettings.elements.chantier_section_title.isBold : false,
    italic: pdfSettings?.elements?.chantier_section_title?.isItalic || false,
    color: pdfSettings?.elements?.chantier_section_title?.color || DARK_BLUE,
    margin: [0, 0, 0, 5]
  };

  content.push(
    pdfSettings?.elements?.chantier_section_title?.border ? {
      table: {
        widths: ['*'],
        body: [[chantierTitleElement]]
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.chantier_section_title?.border?.top ? 
          pdfSettings?.elements?.chantier_section_title?.border?.width || 1 : 0,
        vLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.chantier_section_title?.border?.left ? 
          pdfSettings?.elements?.chantier_section_title?.border?.width || 1 : 0,
        hLineColor: () => pdfSettings?.elements?.chantier_section_title?.border?.color || DARK_BLUE,
        vLineColor: () => pdfSettings?.elements?.chantier_section_title?.border?.color || DARK_BLUE
      }
    } : chantierTitleElement
  );

  // Occupant
  if (occupant) {
    const occupantElement = {
      text: occupant,
      fontFamily: pdfSettings?.elements?.chantier_occupant?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_occupant?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_occupant?.isBold !== undefined ?
            pdfSettings.elements.chantier_occupant.isBold : false,
      italic: pdfSettings?.elements?.chantier_occupant?.isItalic || false,
      color: pdfSettings?.elements?.chantier_occupant?.color || DARK_BLUE,
      margin: [0, 5, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_occupant?.border ? {
        table: {
          widths: ['*'],
          body: [[occupantElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_occupant?.border?.top ? 
            pdfSettings?.elements?.chantier_occupant?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_occupant?.border?.left ? 
            pdfSettings?.elements?.chantier_occupant?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_occupant?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_occupant?.border?.color || DARK_BLUE
        }
      } : occupantElement
    );
  }

  // Adresse du chantier
  if (projectAddress) {
    // Titre de l'adresse
    const addressTitleElement = {
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontFamily: pdfSettings?.elements?.chantier_address_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_address_title?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_address_title?.isBold !== undefined ?
            pdfSettings.elements.chantier_address_title.isBold : false,
      italic: pdfSettings?.elements?.chantier_address_title?.isItalic || false,
      color: pdfSettings?.elements?.chantier_address_title?.color || DARK_BLUE,
      margin: [0, 5, 0, 0]
    };

    // Contenu de l'adresse
    const addressContentElement = {
      text: projectAddress,
      fontFamily: pdfSettings?.elements?.chantier_address_content?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_address_content?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_address_content?.isBold !== undefined ?
            pdfSettings.elements.chantier_address_content.isBold : false,
      italic: pdfSettings?.elements?.chantier_address_content?.isItalic || false,
      color: pdfSettings?.elements?.chantier_address_content?.color || DARK_BLUE,
      margin: [10, 3, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_address_title?.border ? {
        table: {
          widths: ['*'],
          body: [[addressTitleElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_title?.border?.top ? 
            pdfSettings?.elements?.chantier_address_title?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_title?.border?.left ? 
            pdfSettings?.elements?.chantier_address_title?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_address_title?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_address_title?.border?.color || DARK_BLUE
        }
      } : addressTitleElement
    );

    content.push(
      pdfSettings?.elements?.chantier_address_content?.border ? {
        table: {
          widths: ['*'],
          body: [[addressContentElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_content?.border?.top ? 
            pdfSettings?.elements?.chantier_address_content?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_content?.border?.left ? 
            pdfSettings?.elements?.chantier_address_content?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_address_content?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_address_content?.border?.color || DARK_BLUE
        }
      } : addressContentElement
    );
  }

  // Description
  if (projectDescription) {
    const descriptionTitleElement = {
      text: 'Descriptif:',
      fontFamily: pdfSettings?.elements?.chantier_description_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_description_title?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_description_title?.isBold !== undefined ?
            pdfSettings.elements.chantier_description_title.isBold : false,
      italic: pdfSettings?.elements?.chantier_description_title?.isItalic || false,
      color: pdfSettings?.elements?.chantier_description_title?.color || DARK_BLUE,
      margin: [0, 8, 0, 0]
    };

    const descriptionContentElement = {
      text: projectDescription,
      fontFamily: pdfSettings?.elements?.chantier_description_content?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_description_content?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_description_content?.isBold !== undefined ?
            pdfSettings.elements.chantier_description_content.isBold : false,
      italic: pdfSettings?.elements?.chantier_description_content?.isItalic || false,
      color: pdfSettings?.elements?.chantier_description_content?.color || DARK_BLUE,
      margin: [10, 3, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_description_title?.border ? {
        table: {
          widths: ['*'],
          body: [[descriptionTitleElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_title?.border?.top ? 
            pdfSettings?.elements?.chantier_description_title?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_title?.border?.left ? 
            pdfSettings?.elements?.chantier_description_title?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_description_title?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_description_title?.border?.color || DARK_BLUE
        }
      } : descriptionTitleElement
    );

    content.push(
      pdfSettings?.elements?.chantier_description_content?.border ? {
        table: {
          widths: ['*'],
          body: [[descriptionContentElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_content?.border?.top ? 
            pdfSettings?.elements?.chantier_description_content?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_content?.border?.left ? 
            pdfSettings?.elements?.chantier_description_content?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_description_content?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_description_content?.border?.color || DARK_BLUE
        }
      } : descriptionContentElement
    );
  }

  // Informations additionnelles
  if (additionalInfo) {
    const additionalInfoElement = {
      text: additionalInfo,
      fontFamily: pdfSettings?.elements?.chantier_info?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_info?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_info?.isBold !== undefined ?
            pdfSettings.elements.chantier_info.isBold : false,
      italic: pdfSettings?.elements?.chantier_info?.isItalic || false,
      color: pdfSettings?.elements?.chantier_info?.color || DARK_BLUE,
      margin: [10, 15, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_info?.border ? {
        table: {
          widths: ['*'],
          body: [[additionalInfoElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_info?.border?.top ? 
            pdfSettings?.elements?.chantier_info?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_info?.border?.left ? 
            pdfSettings?.elements?.chantier_info?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_info?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_info?.border?.color || DARK_BLUE
        }
      } : additionalInfoElement
    );
  }

  // 7. Pied de page avec styles personnalisés
  const footerElement = {
    text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
    fontFamily: pdfSettings?.elements?.footer_content?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.footer_content?.fontSize || 7,
    bold: pdfSettings?.elements?.footer_content?.isBold !== undefined ?
          pdfSettings.elements.footer_content.isBold : false,
    italic: pdfSettings?.elements?.footer_content?.isItalic || false,
    color: pdfSettings?.elements?.footer_content?.color || DARK_BLUE,
    alignment: 'center',
    margin: [0, 50, 0, 0],
    absolutePosition: { x: 20, y: 800 }
  };

  content.push(
    pdfSettings?.elements?.footer_content?.border ? {
      table: {
        widths: ['*'],
        body: [[footerElement]]
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.footer_content?.border?.top ? 
          pdfSettings?.elements?.footer_content?.border?.width || 1 : 0,
        vLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.footer_content?.border?.left ? 
          pdfSettings?.elements?.footer_content?.border?.width || 1 : 0,
        hLineColor: () => pdfSettings?.elements?.footer_content?.border?.color || DARK_BLUE,
        vLineColor: () => pdfSettings?.elements?.footer_content?.border?.color || DARK_BLUE
      },
      absolutePosition: { x: 20, y: 800 }
    } : footerElement
  );

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
  } else {
    console.log('Aucune bordure définie pour le récapitulatif');
  }
  
  // Créer la table des totaux par pièce
  const roomTotalsTableBody = [];
  
  // Ajouter l'en-tête de la table
  roomTotalsTableBody.push([
    { text: '', style: 'tableHeader', alignment: 'left', color: DARK_BLUE, fontSize: 8 },
    { text: 'Montant HT', style: 'tableHeader', alignment: 'right', color: DARK_BLUE, fontSize: 8 }
  ]);
    
  // Pour chaque pièce avec des travaux
  let totalHT = 0;
  let totalTVA = 0;
  
  roomsWithTravaux.forEach(room => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Calculer le total HT pour cette pièce
    const roomTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    // Calculer la TVA pour cette pièce
    const roomTVA = travauxPiece.reduce((sum, t) => {
      const totalHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
      return sum + (totalHT * t.tauxTVA / 100);
    }, 0);
    
    // Ajouter à nos totaux
    totalHT += roomTotalHT;
    totalTVA += roomTVA;
    
    // Ajouter la ligne à la table
    roomTotalsTableBody.push([
      { text: `Total ${room.name}`, alignment: 'left', fontSize: 8, bold: true },
      { text: formatPrice(roomTotalHT), alignment: 'right', fontSize: 8, color: DARK_BLUE }
    ]);
  });
  
  // Ajouter la table au document
  docContent.push({
    table: {
      headerRows: 1,
      widths: ['*', 100],
      body: roomTotalsTableBody
    },
    layout: {
      hLineWidth: function(i: number, node: any) {
        return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0;
      },
      vLineWidth: function() {
        return 0;
      },
      hLineColor: function() {
        return '#e5e7eb';
      },
      paddingLeft: function() {
        return 10;
      },
      paddingRight: function() {
        return 10;
      },
      paddingTop: function() {
        return 5;
      },
      paddingBottom: function() {
        return 5;
      }
    },
    margin: [0, 0, 0, 20]
  });
  
  // Table des totaux généraux
  const totalTTC = totalHT + totalTVA;

  // Structure de la page récapitulative
  docContent.push({
    columns: [
      // Colonne gauche - Texte de signature (environ 70% de la largeur)
      {
        width: '70%',
        stack: [
          // Contenu de signature généré
          ...generateSignatureContent(),
          
          // 10 lignes vides pour la signature
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] }
        ]
      },
      // Colonne droite - Tableaux des totaux (environ 30% de la largeur)
      {
        width: '30%',
        stack: [
          // D'abord le tableau standard sans bordures
          generateStandardTotalsTable(totalHT, totalTVA),
          // Ensuite le tableau du Total TTC avec bordure complète
          generateTTCTable(totalTTC)
        ]
      }
    ],
    margin: [0, 0, 0, 20]
  });

  // Ajouter le texte de salutation sur toute la largeur
  docContent.push(generateSalutationContent());
  
  // Ajouter les conditions générales de vente
  const cgvContent = generateCGVContent();
  
  // Ajouter chaque élément du contenu CGV
  docContent.push(...cgvContent);
  
  return docContent;
}

export const generateCoverPDF = async (fields: any[], company: any) => {
  console.log('Génération du PDF de la page de garde', { fields, company });
  
  // Cette fonction est probablement déjà implémentée ailleurs
};

export const generateDetailsPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  console.log('Génération du PDF des détails des travaux avec pdfMake:', { pdfSettings });

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Obtenir le contenu des détails avec les paramètres PDF
  const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
  
  // Définir le document avec contenu et styles
  const docDefinition = {
    header: function(currentPage: number, pageCount: number) {
      // Ajustement de la numérotation de page
      const adjustedCurrentPage = currentPage + 1;
      const adjustedTotalPages = pageCount + 3;
      
      return [
        // En-tête avec le numéro de devis et la pagination ajustée
        generateHeaderContent(metadata, adjustedCurrentPage, adjustedTotalPages),
        // En-tête du tableau
        {
          table: {
            headerRows: 1,
            widths: TABLE_COLUMN_WIDTHS.DETAILS,
            body: [
              [
                { text: 'Description', style: 'tableHeader', alignment: 'left', color: DARK_BLUE },
                { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
                { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
                { text: 'TVA', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
                { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: DARK_BLUE }
              ]
            ]
          },
          layout: {
            hLineWidth: function() { return 1; },
            vLineWidth: function() { return 0; },
            hLineColor: function() { return '#e5e7eb'; },
            fillColor: function(rowIndex: number) { return (rowIndex === 0) ? '#f3f4f6' : null; }
          },
          margin: [30, 0, 30, 10]
        }
      ];
    },
    footer: function(currentPage: number, pageCount: number) {
      return generateFooter(metadata);
    },
    content: detailsContent,
    styles: PDF_STYLES,
    pageMargins: pdfSettings?.margins?.details || PDF_MARGINS.DETAILS,
    defaultStyle: {
      fontSize: 9,
      color: pdfSettings?.colors?.mainText || DARK_BLUE
    }
  };
  
  try {
    // Créer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`devis_details_${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

export const generateRecapPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  console.log('Génération du PDF récapitulatif avec pdfMake:', { pdfSettings });

  // Obtenir le contenu du récapitulatif avec les paramètres PDF
  const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
  
  // Définir le document avec contenu et styles
  const docDefinition = {
    // En-tête avec numéro de devis et pagination - Toujours afficher l'en-tête, même sur la première page
    header: function(currentPage, pageCount) {
      // Calculer la numérotation des pages
      const pageNumber = currentPage + 1;
      const totalPages = pageCount + 2;
      
      return generateHeaderContent(metadata, pageNumber, totalPages);
    },
    // Pied de page avec les informations de la société
    footer: function(currentPage, pageCount) {
      return generateFooter(metadata);
    },
    content: recapContent,
    styles: PDF_STYLES,
    pageMargins: pdfSettings?.margins?.recap || PDF_MARGINS.RECAP,
    defaultStyle: {
      fontSize: 9,
      color: pdfSettings?.colors?.mainText || DARK_BLUE
    }
  };
  
  try {
    // Créer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`devis_recap_${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF récapitulatif généré avec succès', { pdfSettings });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF récapitulatif:', error);
    throw error;
  }
};
