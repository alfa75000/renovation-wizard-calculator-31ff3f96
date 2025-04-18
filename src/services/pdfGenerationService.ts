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
  
  // Fonction utilitaire pour créer un élément avec bordures
  const createBorderedElement = (content: any, elementSettings: any) => {
    if (!elementSettings?.border || 
        !(elementSettings.border.top || elementSettings.border.right || 
          elementSettings.border.bottom || elementSettings.border.left)) {
      return content;
    }

    return {
      table: {
        widths: ['*'],
        body: [[content]]
      },
      layout: {
        hLineWidth: function(i: number) {
          if (i === 0) return elementSettings.border.top ? elementSettings.border.width || 1 : 0;
          if (i === 1) return elementSettings.border.bottom ? elementSettings.border.width || 1 : 0;
          return 0;
        },
        vLineWidth: function(i: number) {
          if (i === 0) return elementSettings.border.left ? elementSettings.border.width || 1 : 0;
          if (i === 1) return elementSettings.border.right ? elementSettings.border.width || 1 : 0;
          return 0;
        },
        hLineColor: function() { return elementSettings.border.color || DARK_BLUE; },
        vLineColor: function() { return elementSettings.border.color || DARK_BLUE; }
      }
    };
  };

  // Extraction des données depuis fields
  const devisNumberValue = fields.find(f => f.id === "devisNumber")?.content;
  const devisDateValue = fields.find(f => f.id === "devisDate")?.content;
  const validityOfferValue = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  // Définition des colonnes
  const col1Width = 25; // Largeur fixe pour la première colonne
  const col2Width = '*'; // Largeur automatique pour la deuxième colonne
  
  // Définition du slogan
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  
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
  
  // Titre principal
  const titleElement = createBorderedElement(
    {
      text: 'DEVIS',
      fontFamily: pdfSettings?.elements?.cover_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.cover_title?.fontSize || 12,
      bold: pdfSettings?.elements?.cover_title?.isBold !== undefined ? pdfSettings.elements.cover_title.isBold : true,
      italic: pdfSettings?.elements?.cover_title?.isItalic || false,
      color: pdfSettings?.elements?.cover_title?.color || DARK_BLUE,
      alignment: pdfSettings?.elements?.cover_title?.alignment || 'center',
      margin: [
        pdfSettings?.elements?.cover_title?.spacing?.left || 0,
        pdfSettings?.elements?.cover_title?.spacing?.top || 10,
        pdfSettings?.elements?.cover_title?.spacing?.right || 0,
        pdfSettings?.elements?.cover_title?.spacing?.bottom || 20
      ]
    },
    pdfSettings?.elements?.cover_title
  );

  // Informations société
  const companyInfo = {
    text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
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

  // Slogan
  const sloganElement = {
    text: slogan,
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

  // Numéro de devis, date et validité séparés
  const devisNumber = {
    columns: [
      {
        width: col1Width,
        text: '',
        fontSize: 10
      },
      {
        width: col2Width,
        text: [
          { 
            text: 'Devis n°: ',
            ...applyElementStyles('devis_number_label', pdfSettings)
          },
          { 
            text: `${devisNumberValue || ''} `,
            ...applyElementStyles('devis_number', pdfSettings)
          }
        ]
      }
    ],
    columnGap: 1,
    margin: [0, 0, 0, 0]
  };

  const devisDate = {
    columns: [
      {
        width: col1Width,
        text: '',
        fontSize: 10
      },
      {
        width: col2Width,
        text: [
          { 
            text: 'Du ',
            ...applyElementStyles('devis_date_label', pdfSettings)
          },
          { 
            text: formatDate(devisDateValue),
            ...applyElementStyles('devis_date', pdfSettings)
          }
        ]
      }
    ],
    columnGap: 1,
    margin: [0, 0, 0, 0]
  };

  const devisValidity = {
    columns: [
      {
        width: col1Width,
        text: '',
        fontSize: 10
      },
      {
        width: col2Width,
        text: `(Validité de l'offre : 3 mois.)`,
        ...applyElementStyles('devis_validity', pdfSettings)
      }
    ],
    columnGap: 1,
    margin: [0, 0, 0, 0]
  };

  // Section client
  const clientSection = {
    columns: [
      { width: col1Width, text: '', fontSize: 10 },
      { 
        width: col2Width, 
        text: 'Client / Maître d\'ouvrage',
        fontFamily: pdfSettings?.elements?.client_section?.fontFamily || 'Roboto',
        fontSize: pdfSettings?.elements?.client_section?.fontSize || 10,
        bold: pdfSettings?.elements?.client_section?.isBold !== undefined ? pdfSettings.elements.client_section.isBold : true,
        italic: pdfSettings?.elements?.client_section?.isItalic || false,
        color: pdfSettings?.elements?.client_section?.color || DARK_BLUE,
        alignment: pdfSettings?.elements?.client_section?.alignment || 'left'
      }
    ],
    columnGap: 1
  };

  const clientContent = {
    columns: [
      { width: col1Width, text: '', fontSize: 10 },
      { 
        width: col2Width, 
        text: client || '',
        fontFamily: pdfSettings?.elements?.client_section?.fontFamily || 'Roboto',
        fontSize: pdfSettings?.elements?.client_section?.fontSize || 10,
        color: pdfSettings?.elements?.client_section?.color || DARK_BLUE,
        lineHeight: 1.3
      }
    ],
    columnGap: 15,
    margin: [0, 5, 0, 0]
  };

  // Section chantier
  const chantierSection = {
    text: 'Chantier / Travaux',
    fontFamily: pdfSettings?.elements?.chantier_section?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.chantier_section?.fontSize || 10,
    bold: pdfSettings?.elements?.chantier_section?.isBold !== undefined ? pdfSettings.elements.chantier_section.isBold : true,
    italic: pdfSettings?.elements?.chantier_section?.isItalic || false,
    color: pdfSettings?.elements?.chantier_section?.color || DARK_BLUE,
    margin: [0, 0, 0, 5]
  };

  // Pied de page
  const footerText = {
    text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
    fontFamily: pdfSettings?.elements?.footer?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.footer?.fontSize || 7,
    color: pdfSettings?.elements?.footer?.color || DARK_BLUE,
    alignment: 'center',
    margin: [0, 50, 0, 0],
    absolutePosition: { x: 20, y: 800 }
  };
  
  // Construction du contenu
  const content = [
    // Logo et assurance sur la même ligne
    {
      columns: [
        // Logo à gauche
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
        // Assurance à droite
        {
          width: '40%',
          stack: [
            { text: 'Assurance MAAF PRO', fontSize: 10, color: DARK_BLUE },
            { text: 'Responsabilité civile', fontSize: 10, color: DARK_BLUE },
            { text: 'Responsabilité civile décennale', fontSize: 10, color: DARK_BLUE }
          ],
          alignment: 'right'
        }
      ]
    },
    
    // Slogan
    sloganElement,
    
    // Coordonnées société - Nom et adresse combinés
    companyInfo,
    
    // Tél et Mail
    {
      columns: [
        {
          width: col1Width,
          text: 'Tél:',
          fontSize: 10,
          color: DARK_BLUE
        },
        {
          width: col2Width,
          text: company?.tel1 || '',
          fontSize: 10,
          color: DARK_BLUE
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
          color: DARK_BLUE
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
          color: DARK_BLUE
        },
        {
          width: col2Width,
          text: company?.email || '',
          fontSize: 10,
          color: DARK_BLUE
        }
      ],
      columnGap: 1,
      margin: [0, 5, 0, 0]
    },
    
    // Espace avant devis
    { text: '', margin: [0, 30, 0, 0] },
    
    // Numéro et date du devis
    devisNumber,
    devisDate,
    devisValidity,
    
    // Espace avant Client
    { text: '', margin: [0, 35, 0, 0] },
    
    // Client - Titre
    clientSection,
    
    // Client - Contenu
    clientContent,
    
    // Espaces après les données client
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    { text: '', margin: [0, 5, 0, 0] },
    
    // Chantier - Titre
    chantierSection,
  ];
  
  // Ajouter les informations conditionnelles
  if (occupant) {
    content.push({
      text: occupant,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [0, 5, 0, 0]
    });
  }
  
  if (projectAddress) {
    content.push({
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontSize: 10,
      color: DARK_BLUE,
      margin: [0, 5, 0, 0]
    });
    
    content.push({
      text: projectAddress,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [10, 3, 0, 0]
    });
  }
  
  if (projectDescription) {
    content.push({
      text: 'Descriptif:',
      fontSize: 10,
      color: DARK_BLUE,
      margin: [0, 8, 0, 0]
    });
    
    content.push({
      text: projectDescription,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [10, 3, 0, 0]
    });
  }
  
  if (additionalInfo) {
    content.push({
      text: additionalInfo,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [10, 15, 0, 0]
    });
  }
  
  content.push(footerText);
  
  // Filtrer les éléments null
  return content.filter(Boolean);
}

// Fonction utilitaire pour appliquer les styles d'un élément
function applyElementStyles(elementKey: string, pdfSettings?: PdfSettings) {
  const element = pdfSettings?.elements?.[elementKey];
  if (!element) return {};

  return {
    fontFamily: element.fontFamily,
    fontSize: element.fontSize,
    bold: element.isBold,
    italic: element.isItalic,
    color: element.color,
    alignment: element.alignment
  };
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
