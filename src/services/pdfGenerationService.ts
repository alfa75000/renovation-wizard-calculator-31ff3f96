// Fonctions utilitaires pour générer des parties spécifiques des PDF

import { Travail, ProjectMetadata } from '@/types';
import { 
  PDF_TEXTS, 
  DARK_BLUE, 
  formatPrice, 
  formatQuantity,
  TABLE_COLUMN_WIDTHS
} from './pdf/pdfConstants';

/**
 * Fonction utilitaire pour formater une date en format français DD/MM/YYYY
 * @param dateString Chaîne de date à formater
 * @returns Date formatée ou chaîne vide si non valide
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Si la date n'est pas valide, retourne la chaîne originale
    
    // Format DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return dateString || '';
  }
};

/**
 * Génère le contenu de l'en-tête pour les documents PDF
 */
export const generateHeaderContent = (metadata?: ProjectMetadata, currentPage: number = 1, totalPages: number = 1) => {
  return {
    text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${totalPages}`,
    alignment: 'right',
    fontSize: 8,
    color: DARK_BLUE,
    margin: [40, 20, 40, 10]
  };
};

/**
 * Génère le pied de page standard pour tous les documents PDF
 * Utilise les données de l'entreprise stockées dans metadata.company
 */
export const generateFooter = (metadata?: ProjectMetadata) => {
  console.log("Données de l'entreprise dans generateFooter:", metadata?.company);
  
  // Récupérer les informations de la société directement de l'objet company
  const company = metadata?.company;
  
  // Utiliser les données de company si disponibles, sinon utiliser des valeurs par défaut
  const companyName = company?.name || '';
  const capitalSocial = company?.capital_social || '10000';
  const address = company?.address || '';
  const postalCode = company?.postal_code || '';
  const city = company?.city || '';
  const siret = company?.siret || '';
  const codeApe = company?.code_ape || '';
  const tvaIntracom = company?.tva_intracom || '';
  
  return {
    text: `${companyName} - SASU au Capital de ${capitalSocial} € - ${address} ${postalCode} ${city} - Siret : ${siret} - Code APE : ${codeApe} - N° TVA Intracommunautaire : ${tvaIntracom}`,
    fontSize: 7,
    color: DARK_BLUE,
    alignment: 'center',
    margin: [40, 0, 40, 20]
  };
};

/**
 * Génère le format MO/Fournitures avec TVA
 * Modifié: Retiré le Total HT par unité et augmenté la taille de police
 */
export const formatMOFournitures = (travail: Travail): string => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = (totalHT * travail.tauxTVA) / 100;
  
  // Retiré "[ Total HT: XX€/u ]" de la chaîne formatée
  return `[ MO: ${formatPrice(travail.prixMainOeuvre)}/u ] [ Fourn: ${formatPrice(travail.prixFournitures)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formatPrice(montantTVA)} ]`;
};

/**
 * Génère le contenu pour la section des Conditions Générales de Vente
 */
export const generateCGVContent = () => {
  const content: any[] = [];
  
  // Titre principal
  content.push({
    text: PDF_TEXTS.CGV.TITLE,
    style: 'header',
    alignment: 'center',
    fontSize: 12, // Taille diminuée de 1pt
    bold: true,
    color: DARK_BLUE,
    margin: [0, 0, 0, 20],
    pageBreak: 'before'
  });
  
  // Générer chaque section des CGV
  PDF_TEXTS.CGV.SECTIONS.forEach(section => {
    // Titre de section
    content.push({
      text: section.title,
      bold: true,
      fontSize: 9, // Taille diminuée de 1pt
      margin: [0, 0, 0, 5]
    });
    
    // Contenu principal
    content.push({
      text: section.content,
      fontSize: 9, // Taille diminuée de 1pt
      margin: [0, 0, 0, section.subsections ? 5 : 10]
    });
    
    // Sous-sections si présentes
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        // Titre de sous-section
        content.push({
          text: subsection.title,
          bold: true,
          fontSize: 9, // Taille diminuée de 1pt
          margin: [0, 0, 0, 5]
        });
        
        // Contenu principal de la sous-section
        if (subsection.content) {
          content.push({
            text: subsection.content,
            fontSize: 9, // Taille diminuée de 1pt
            margin: [0, 0, 0, subsection.bullets ? 5 : 10]
          });
        }
        
        // Points à puces si présents
        if (subsection.bullets) {
          subsection.bullets.forEach(bullet => {
            content.push({
              text: `• ${bullet}`,
              fontSize: 9, // Taille diminuée de 1pt
              margin: [10, 0, 0, 3]
            });
          });
          
          // Contenu après les puces si présent
          if (subsection.content_after) {
            content.push({
              text: subsection.content_after,
              fontSize: 9, // Taille diminuée de 1pt
              margin: [0, 5, 0, 10]
            });
          }
        }
      });
    }
  });
  
  return content;
};

/**
 * Génère le contenu pour la section de signature - Version mise à jour
 */
export const generateSignatureContent = () => {
  const elements = [];
  
  // Contenu principal
  elements.push({
    text: PDF_TEXTS.SIGNATURE.CONTENT,
    fontSize: 8, // Changer fontSize: 9 à fontSize: 8
    margin: [0, 0, 0, 5]
  });
  
  // Points avec puces
  PDF_TEXTS.SIGNATURE.POINTS.forEach(point => {
    elements.push({
      text: point.text,
      bold: point.bold,
      fontSize: 8, // Changer fontSize: 9 à fontSize: 8
      margin: [0, 3, 0, 0]
    });
  });
  
  // Espacement après
  elements.push({ text: "", margin: [0, 10, 0, 0] });
  
  return elements;
};

/**
 * Génère le texte de salutation - Version mise à jour
 * Maintenant centré sur toute la largeur de la page
 */
export const generateSalutationContent = () => {
  return {
    text: PDF_TEXTS.SALUTATION,
    fontSize: 9,
    margin: [0, 10, 0, 0],
    alignment: 'justify' // Texte étalé sur toute la largeur
  };
};

/**
 * Génère une structure de tableau pour les totaux (HT et TVA) sans bordures
 */
export const generateStandardTotalsTable = (totalHT: number, totalTVA: number) => {
  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { text: 'Total HT', alignment: 'left', fontSize: 8, bold: false }, // Changer fontSize: 10 à fontSize: 8
          { text: formatPrice(totalHT), alignment: 'right', fontSize: 8, color: DARK_BLUE } // Changer fontSize: 10 à fontSize: 8
        ],
        [
          { text: 'Total TVA', alignment: 'left', fontSize: 8, bold: false }, // Changer fontSize: 10 à fontSize: 8
          { text: formatPrice(totalTVA), alignment: 'right', fontSize: 8, color: DARK_BLUE } // Changer fontSize: 10 à fontSize: 8
        ]
      ]
    },
    layout: {
      hLineWidth: function() { return 0; },
      vLineWidth: function() { return 0; },
      paddingLeft: function() { return 5; },
      paddingRight: function() { return 5; },
      paddingTop: function() { return 5; }, // Changer de 8 à 5
      paddingBottom: function() { return 5; } // Changer de 8 à 5
    },
    margin: [0, 0, 0, 0]
  };
};

/**
 * Génère une structure de tableau pour le Total TTC avec bordure complète
 */
export const generateTTCTable = (totalTTC: number) => {
  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { text: 'Total TTC', alignment: 'left', fontSize: 8, bold: true }, // Changer fontSize: 10 à fontSize: 8
          { text: formatPrice(totalTTC), alignment: 'right', fontSize: 8, color: DARK_BLUE, bold: true } // Changer fontSize: 10 à fontSize: 8
        ]
      ]
    },
    layout: {
      hLineWidth: function() { return 1; },
      vLineWidth: function(i, node) { 
        // Supprimer la ligne verticale centrale (i=1)
        return i === 0 || i === 2 ? 1 : 0; // Modifier cette ligne qui était avant: return 1;
      },
      hLineColor: function() { return '#e5e7eb'; },
      vLineColor: function() { return '#e5e7eb'; },
      paddingLeft: function() { return 5; },
      paddingRight: function() { return 5; },
      paddingTop: function() { return 5; }, // Changer de 8 à 5
      paddingBottom: function() { return 5; } // Changer de 8 à 5
    },
    margin: [0, 0, 0, 0]
  };
};

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
        // Assurance à droite avec paramètres personnalisés
        {
          width: '40%',
          stack: [
            {
              text: 'Assurance MAAF PRO',
              fontFamily: pdfSettings?.elements?.insurance_info?.fontFamily || 'Roboto',
              fontSize: pdfSettings?.elements?.insurance_info?.fontSize || 10,
              bold: pdfSettings?.elements?.insurance_info?.isBold || false,
              italic: pdfSettings?.elements?.insurance_info?.isItalic || false,
              color: pdfSettings?.elements?.insurance_info?.color || DARK_BLUE,
              alignment: pdfSettings?.elements?.insurance_info?.alignment || 'right',
              margin: [
                pdfSettings?.elements?.insurance_info?.spacing?.left || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.top || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.right || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.bottom || 0
              ]
            },
            {
              text: 'Responsabilité civile',
              fontFamily: pdfSettings?.elements?.insurance_info?.fontFamily || 'Roboto',
              fontSize: pdfSettings?.elements?.insurance_info?.fontSize || 10,
              bold: pdfSettings?.elements?.insurance_info?.isBold || false,
              italic: pdfSettings?.elements?.insurance_info?.isItalic || false,
              color: pdfSettings?.elements?.insurance_info?.color || DARK_BLUE,
              alignment: pdfSettings?.elements?.insurance_info?.alignment || 'right',
              margin: [
                pdfSettings?.elements?.insurance_info?.spacing?.left || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.top || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.right || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.bottom || 0
              ]
            },
            {
              text: 'Responsabilité civile décennale',
              fontFamily: pdfSettings?.elements?.insurance_info?.fontFamily || 'Roboto',
              fontSize: pdfSettings?.elements?.insurance_info?.fontSize || 10,
              bold: pdfSettings?.elements?.insurance_info?.isBold || false,
              italic: pdfSettings?.elements?.insurance_info?.isItalic || false,
              color: pdfSettings?.elements?.insurance_info?.color || DARK_BLUE,
              alignment: pdfSettings?.elements?.insurance_info?.alignment || 'right',
              margin: [
                pdfSettings?.elements?.insurance_info?.spacing?.left || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.top || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.right || 0,
                pdfSettings?.elements?.insurance_info?.spacing?.bottom || 0
              ]
            }
          ],
          // Appliquer les bordures au conteneur stack si définies
          ...(pdfSettings?.elements?.insurance_info?.border && {
            border: [
              pdfSettings.elements.insurance_info.border.top ? pdfSettings.elements.insurance_info.border.width || 1 : 0,
              pdfSettings.elements.insurance_info.border.right ? pdfSettings.elements.insurance_info.border.width || 1 : 0,
              pdfSettings.elements.insurance_info.border.bottom ? pdfSettings.elements.insurance_info.border.width || 1 : 0,
              pdfSettings.elements.insurance_info.border.left ? pdfSettings.elements.insurance_info.border.width || 1 : 0
            ],
            borderColor: pdfSettings.elements.insurance_info.border.color || DARK_BLUE
          })
        }
      ]
    },
    
    // Slogan
    {
      text: company?.slogan || 'Entreprise Générale du Bâtiment',
      fontSize: 12,
      bold: true,
      color: DARK_BLUE,
      margin: [0, 10, 0, 20]
    },
    
    // Coordonnées société - Nom et adresse combinés
    {
      text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
      fontSize: 11,
      bold: true,
      color: DARK_BLUE,
      margin: [0, 0, 0, 3]
    },
    
    // Tél et Mail
    {
      columns: [
        {
          width: '50%',
          text: 'Tél:',
          fontSize: 10,
          color: DARK_BLUE
        },
        {
          width: '50%',
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
          width: '50%',
          text: '',
          fontSize: 10
        },
        {
          width: '50%',
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
          width: '50%',
          text: 'Mail:',
          fontSize: 10,
          color: DARK_BLUE
        },
        {
          width: '50%',
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
    {
      columns: [
        {
          width: '50%',
          text: '',
          fontSize: 10
        },
        {
          width: '50%',
          text: [
            { text: `Devis n°: ${fields.find(f => f.id === "devisNumber")?.content || ''} Du ${formatDate(fields.find(f => f.id === "devisDate")?.content)} `, fontSize: 10, color: DARK_BLUE },
            { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: DARK_BLUE }
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
        { width: '50%', text: '', fontSize: 10 },
        { 
          width: '50%', 
          text: 'Client / Maître d\'ouvrage',
          fontSize: 10,
          color: DARK_BLUE
        }
      ],
      columnGap: 1
    },
    
    // Client - Contenu
    {
      columns: [
        { width: '50%', text: '', fontSize: 10 },
        { 
          width: '50%', 
          text: fields.find(f => f.id === "client")?.content || '',
          fontSize: 10,
          color: DARK_BLUE,
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
      color: DARK_BLUE,
      margin: [0, 0, 0, 5]
    }
  ];

  // Ajouter les informations conditionnelles
  if (fields.find(f => f.id === "occupant")?.content) {
    content.push({
      text: fields.find(f => f.id === "occupant")?.content,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [0, 5, 0, 0]
    });
  }
  
  if (fields.find(f => f.id === "projectAddress")?.content) {
    content.push({
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontSize: 10,
      color: DARK_BLUE,
      margin: [0, 5, 0, 0]
    });
    
    content.push({
      text: fields.find(f => f.id === "projectAddress")?.content,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [10, 3, 0, 0]
    });
  }
  
  if (fields.find(f => f.id === "projectDescription")?.content) {
    content.push({
      text: 'Descriptif:',
      fontSize: 10,
      color: DARK_BLUE,
      margin: [0, 8, 0, 0]
    });
    
    content.push({
      text: fields.find(f => f.id === "projectDescription")?.content,
      fontSize: 10,
      color: DARK_BLUE,
      margin: [10, 3, 0, 0]
    });
  }
  
  if (fields.find(f => f.id === "additionalInfo")?.content) {
    content.push({
      text: fields.find(f => f.id === "additionalInfo")?.content,
      fontSize: 10,
      color: DARK_BLUE,
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
          
          return isEndOfPrestation ?
