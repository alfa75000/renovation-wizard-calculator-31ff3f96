
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata } from '@/types';
import { supabase } from '@/lib/supabase';
import { PdfSettings, PdfSettingsSchema } from './pdf/config/pdfSettingsTypes';

// Importer les constantes et les utilitaires
import { 
  DARK_BLUE, 
  PDF_STYLES, 
  PDF_MARGINS, 
  TABLE_COLUMN_WIDTHS,
  formatPrice,
  formatQuantity
} from './pdf/pdfConstants';

// Importer les générateurs et utilitaires
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

import {
  configurePdfStyles,
  getDocumentMargins,
  getCustomColors,
  getFontSizes
} from './pdf/pdfGenerationUtils';

// Initialiser pdfMake avec les polices
if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

// Fonction pour récupérer les paramètres PDF de l'utilisateur actuel
const getUserPdfSettings = async (userId?: string): Promise<PdfSettings> => {
  try {
    if (!userId) {
      console.warn('Aucun ID utilisateur fourni pour récupérer les paramètres PDF');
      return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
    }

    const { data, error } = await supabase
      .from('app_state')
      .select('pdf_settings')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération des paramètres PDF:', error);
      return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
    }
    
    // Valider les données avec Zod
    return PdfSettingsSchema.parse(data?.pdf_settings || {});
  } catch (error) {
    console.error('Exception lors de la récupération des paramètres PDF:', error);
    return PdfSettingsSchema.parse({}); // Retourne les valeurs par défaut
  }
};

// Nouvelle fonction pour générer le PDF complet du devis
export const generateCompletePDF = async (
  fields: any[],
  company: any,
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  userId?: string
) => {
  console.log('Génération du PDF complet du devis...');
  
  try {
    // Récupérer les paramètres PDF personnalisés
    const pdfSettings = await getUserPdfSettings(userId);
    console.log('Paramètres PDF récupérés:', pdfSettings);
    
    // 1. Préparer les contenus des différentes parties
    // PARTIE 1: Contenu de la page de garde
    const coverContent = prepareCoverContent(fields, company, metadata, pdfSettings);
    
    // PARTIE 2: Contenu des détails des travaux
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // PARTIE 3: Contenu du récapitulatif
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // Configurer les styles et polices en fonction des paramètres
    const { styles, defaultStyle } = configurePdfStyles(pdfSettings);
    
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
      styles: styles,
      defaultStyle: defaultStyle,
      pageMargins: getDocumentMargins(pdfSettings, 'cover'),
      footer: function(currentPage: number, pageCount: number) {
        return generateFooter(metadata, pdfSettings);
      },
      header: function(currentPage: number, pageCount: number) {
        // Ne pas afficher d'en-tête sur la première page (page de garde)
        if (currentPage === 1) return null;
        
        // Sur les autres pages, afficher l'en-tête standard
        return generateHeaderContent(metadata, currentPage, pageCount, pdfSettings);
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

// Fonction auxiliaire pour préparer le contenu de la page de garde avec paramètres personnalisés
function prepareCoverContent(fields: any[], company: any, metadata?: ProjectMetadata, pdfSettings?: PdfSettings) {
  console.log('Préparation du contenu de la page de garde...');
  
  // Récupérer les paramètres personnalisés
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
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
  
  // Construction du contenu
  const content = [
    // Logo et assurance sur la même ligne
    {
      columns: [
        // Logo à gauche
        {
          width: '60%',
          stack: [
            // Utiliser le logo personnalisé si disponible
            (pdfSettings?.logoSettings?.logoUrl || company?.logo_url) ? {
              image: pdfSettings?.logoSettings?.logoUrl || company?.logo_url,
              width: pdfSettings?.logoSettings?.width || 172,
              height: pdfSettings?.logoSettings?.height || 72,
              alignment: pdfSettings?.logoSettings?.alignment || 'left',
              margin: [0, 0, 0, 0]
            } : { text: '', margin: [0, 40, 0, 0] }
          ]
        },
        // Assurance à droite
        {
          width: '40%',
          stack: [
            { text: 'Assurance MAAF PRO', fontSize: fontSizes.normal, color: colors.mainText },
            { text: 'Responsabilité civile', fontSize: fontSizes.normal, color: colors.mainText },
            { text: 'Responsabilité civile décennale', fontSize: fontSizes.normal, color: colors.mainText }
          ],
          alignment: 'right'
        }
      ]
    },
    
    // Slogan
    {
      text: slogan,
      fontSize: fontSizes.subtitle,
      bold: true,
      color: colors.mainText,
      margin: [0, 10, 0, 20]
    },
    
    // Coordonnées société - Nom et adresse combinés
    {
      text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
      fontSize: fontSizes.normal + 1,
      bold: true,
      color: colors.mainText,
      margin: [0, 0, 0, 3]
    },
    
    // Tél et Mail
    {
      columns: [
        {
          width: col1Width,
          text: 'Tél:',
          fontSize: fontSizes.normal,
          color: colors.mainText
        },
        {
          width: col2Width,
          text: company?.tel1 || '',
          fontSize: fontSizes.normal,
          color: colors.mainText
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
          fontSize: fontSizes.normal
        },
        {
          width: col2Width,
          text: company.tel2,
          fontSize: fontSizes.normal,
          color: colors.mainText
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
          fontSize: fontSizes.normal,
          color: colors.mainText
        },
        {
          width: col2Width,
          text: company?.email || '',
          fontSize: fontSizes.normal,
          color: colors.mainText
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
          fontSize: fontSizes.normal
        },
        {
          width: col2Width,
          text: [
            { text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `, fontSize: fontSizes.normal, color: colors.mainText },
            { text: ` (Validité de l'offre : 3 mois.)`, fontSize: fontSizes.small, italics: true, color: colors.mainText }
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
        { width: col1Width, text: '', fontSize: fontSizes.normal },
        { 
          width: col2Width, 
          text: 'Client / Maître d\'ouvrage',
          fontSize: fontSizes.normal,
          color: colors.mainText
        }
      ],
      columnGap: 1
    },
    
    // Client - Contenu
    {
      columns: [
        { width: col1Width, text: '', fontSize: fontSizes.normal },
        { 
          width: col2Width, 
          text: client || '',
          fontSize: fontSizes.normal,
          color: colors.mainText,
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
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [0, 0, 0, 5]
    }
  ];
  
  // Ajouter les informations conditionnelles
  if (occupant) {
    content.push({
      text: occupant,
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [0, 5, 0, 0]
    });
  }
  
  if (projectAddress) {
    content.push({
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [0, 5, 0, 0]
    });
    
    content.push({
      text: projectAddress,
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [10, 3, 0, 0]
    });
  }
  
  if (projectDescription) {
    content.push({
      text: 'Descriptif:',
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [0, 8, 0, 0]
    });
    
    content.push({
      text: projectDescription,
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [10, 3, 0, 0]
    });
  }
  
  if (additionalInfo) {
    content.push({
      text: additionalInfo,
      fontSize: fontSizes.normal,
      color: colors.mainText,
      margin: [10, 15, 0, 0]
    });
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
  console.log('Préparation du contenu des détails des travaux...');
  
  // Récupérer les paramètres personnalisés
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer l'en-tête du tableau commun
  const tableHeaderRow = [
    { text: 'Description', style: 'tableHeader', alignment: 'left', color: colors.mainText },
    { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: colors.mainText },
    { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: colors.mainText },
    { text: 'TVA', style: 'tableHeader', alignment: 'center', color: colors.mainText },
    { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: colors.mainText }
  ];
  
  // Créer le contenu du document
  const docContent: any[] = [
    // Titre de la section
    {
      text: 'DÉTAILS DES TRAVAUX',
      style: 'header',
      alignment: 'center',
      fontSize: fontSizes.heading,
      bold: true,
      color: colors.mainText,
      margin: [0, 10, 0, 20]
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
      fontSize: fontSizes.details,
      bold: true,
      color: colors.mainText,
      fillColor: colors.background,
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
      const moFournText = formatMOFournitures(travail, pdfSettings);
      
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
            { text: descriptionLines.join('\n'), fontSize: fontSizes.normal, lineHeight: 1.4, color: colors.mainText },
            { text: moFournText, fontSize: fontSizes.small, lineHeight: 1.4, color: colors.detailsText }
          ]
        },
        
        // Colonne 2: Quantité
        { 
          stack: [
            { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: fontSizes.normal, color: colors.mainText },
            { text: travail.unite, alignment: 'center', fontSize: fontSizes.normal, color: colors.mainText }
          ],
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 3: Prix unitaire
        { 
          text: formatPrice(prixUnitaireHT), 
          alignment: 'center',
          fontSize: fontSizes.normal,
          color: colors.mainText,
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 4: TVA
        { 
          text: `${travail.tauxTVA}%`, 
          alignment: 'center',
          fontSize: fontSizes.normal,
          color: colors.mainText,
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 5: Total HT
        { 
          text: formatPrice(totalHT), 
          alignment: 'center',
          fontSize: fontSizes.normal,
          color: colors.mainText,
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
      { text: `Total HT ${room.name}`, colSpan: 4, alignment: 'left', fontSize: fontSizes.normal, bold: true, fillColor: colors.background },
      {}, {}, {},
      { text: formatPrice(pieceTotalHT), alignment: 'center', fontSize: fontSizes.normal, bold: true, fillColor: colors.background }
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
          return colors.totalBoxLines;
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
  console.log('Préparation du contenu du récapitulatif...');
  
  // Récupérer les paramètres personnalisés
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer le contenu du document
  const docContent: any[] = [
    // Titre du récapitulatif
    {
      text: 'RÉCAPITULATIF',
      style: 'header',
      alignment: 'center',
      fontSize: fontSizes.heading,
      bold: true,
      color: colors.mainText,
      margin: [0, 10, 0, 20]
    }
  ];
  
  // Créer la table des totaux par pièce
  const roomTotalsTableBody = [];
  
  // Ajouter l'en-tête de la table
  roomTotalsTableBody.push([
    { text: '', style: 'tableHeader', alignment: 'left', color: colors.mainText, fontSize: fontSizes.small },
    { text: 'Montant HT', style: 'tableHeader', alignment: 'right', color: colors.mainText, fontSize: fontSizes.small }
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
      { text: `Total ${room.name}`, alignment: 'left', fontSize: fontSizes.normal, bold: true, color: colors.mainText },
      { text: formatPrice(roomTotalHT), alignment: 'right', fontSize: fontSizes.normal, color: colors.mainText }
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
        return colors.totalBoxLines;
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
          generateStandardTotalsTable(totalHT, totalTVA, pdfSettings),
          // Ensuite le tableau du Total TTC avec bordure complète
          generateTTCTable(totalTTC, pdfSettings)
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
  cgvContent.forEach(item => {
    docContent.push(item);
  });
  
  return docContent;
}

// La logique existante pour la page de garde reste inchangée
export const generateCoverPDF = async (fields: any[], company: any) => {
  console.log('Génération du PDF de la page de garde', { fields, company });
  
  // Cette fonction est probablement déjà implémentée ailleurs
};

export const generateDetailsPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  userId?: string
) => {
  console.log('Génération du PDF des détails des travaux avec pdfMake');

  try {
    // Récupérer les paramètres PDF personnalisés
    const pdfSettings = await getUserPdfSettings(userId);
    console.log('Paramètres PDF récupérés:', pdfSettings);
    
    // On filtre les pièces qui n'ont pas de travaux
    const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
    // Estimation du nombre de pages
    const pageCount = Math.max(1, Math.ceil(roomsWithTravaux.length / 2));
    
    // Créer l'en-tête du tableau commun
    const colors = getCustomColors(pdfSettings || {});
    const fontSizes = getFontSizes(pdfSettings || {});
    
    // Créer l'en-tête du tableau commun
    const tableHeaderRow = [
      { text: 'Description', style: 'tableHeader', alignment: 'left', color: colors.mainText },
      { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: colors.mainText },
      { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: colors.mainText },
      { text: 'TVA', style: 'tableHeader', alignment: 'center', color: colors.mainText },
      { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: colors.mainText }
    ];
    
    // Créer le contenu du document
    const detailsContent: any[] = [];
    
    // Pour chaque pièce avec des travaux
    roomsWithTravaux.forEach((room, roomIndex) => {
      const travauxPiece = getTravauxForPiece(room.id);
      if (travauxPiece.length === 0) return;
      
      // Ajouter le titre de la pièce
      detailsContent.push({
        text: room.name,
        style: 'roomTitle',
        fontSize: fontSizes.details,
        bold: true,
        color: colors.mainText,
        fillColor: colors.background,
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
        const moFournText = formatMOFournitures(travail, pdfSettings);
        
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
              { text: descriptionLines.join('\n'), fontSize: fontSizes.normal, lineHeight: 1.4, color: colors.mainText },
              { text: moFournText, fontSize: fontSizes.small, lineHeight: 1.4, color: colors.detailsText }
            ]
          },
          
          // Colonne 2: Quantité
          { 
            stack: [
              { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: fontSizes.normal, color: colors.mainText },
              { text: travail.unite, alignment: 'center', fontSize: fontSizes.normal, color: colors.mainText }
            ],
            alignment: 'center',
            margin: [0, topMargin, 0, 0]
          },
          
          // Colonne 3: Prix unitaire
          { 
            text: formatPrice(prixUnitaireHT), 
            alignment: 'center',
            fontSize: fontSizes.normal,
            color: colors.mainText,
            margin: [0, topMargin, 0, 0]
          },
          
          // Colonne 4: TVA
          { 
            text: `${travail.tauxTVA}%`, 
            alignment: 'center',
            fontSize: fontSizes.normal,
            color: colors.mainText,
            margin: [0, topMargin, 0, 0]
          },
          
          // Colonne 5: Total HT
          { 
            text: formatPrice(totalHT), 
            alignment: 'center',
            fontSize: fontSizes.normal,
            color: colors.mainText,
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
        { text: `Total HT ${room.name}`, colSpan: 4, alignment: 'left', fontSize: fontSizes.normal, bold: true, fillColor: colors.background },
        {}, {}, {},
        { text: formatPrice(pieceTotalHT), alignment: 'center', fontSize: fontSizes.normal, bold: true, fillColor: colors.background }
      ]);
      
      // Ajouter le tableau au document
      detailsContent.push({
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
            return colors.totalBoxLines;
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
    
    // Configurer les styles et polices en fonction des paramètres
    const { styles, defaultStyle } = configurePdfStyles(pdfSettings);
    
    // Créer le document PDF
    const docDefinition = {
      content: detailsContent,
      styles: styles,
      defaultStyle: defaultStyle,
      pageMargins: getDocumentMargins(pdfSettings, 'details'),
      footer: function(currentPage: number, pageCount: number) {
        return generateFooter(metadata, pdfSettings);
      },
      header: function(currentPage: number, pageCount: number) {
        return generateHeaderContent(metadata, currentPage, pageCount, pdfSettings);
      }
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`devis-details-${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF des détails généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF des détails:', error);
    throw error;
  }
}
