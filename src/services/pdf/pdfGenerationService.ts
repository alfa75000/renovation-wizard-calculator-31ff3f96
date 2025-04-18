import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata } from '@/types';
import { PDF_ELEMENT_STYLES } from './config/elementStyles';
import { getPdfSettings } from './config/pdfSettingsManager';

// Importer les constantes et les utilitaires
import { 
  DARK_BLUE, 
  PDF_STYLES, 
  PDF_MARGINS, 
  TABLE_COLUMN_WIDTHS,
  formatPrice,
  formatQuantity
} from './pdfConstants';

import { PDF_TEXTS } from './config/pdfTexts';

/**
 * Génère le contenu de l'en-tête pour les documents PDF
 */
export const generateHeaderContent = (metadata?: ProjectMetadata, currentPage: number = 1, totalPages: number = 1) => {
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const elementSettings = pdfSettings?.elements?.detail_header || {};
  
  return {
    text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${totalPages}`,
    fontSize: elementSettings.fontSize || 10,
    color: elementSettings.color || DARK_BLUE,
    alignment: elementSettings.alignment || 'right',
    margin: [0, 10, 0, 20],
    ...(elementSettings.isBold === false ? {} : { bold: true })
  };
};

/**
 * Génère le pied de page standard pour tous les documents PDF
 * Utilise les données de l'entreprise stockées dans metadata.company
 */
export const generateFooter = (metadata?: ProjectMetadata) => {
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const elementSettings = pdfSettings?.elements?.cover_footer || {};
  
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
    fontSize: elementSettings.fontSize || 7,
    color: elementSettings.color || DARK_BLUE,
    alignment: elementSettings.alignment || 'center',
    margin: [40, 10, 40, 0]
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
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const titleSettings = pdfSettings?.elements?.cgv_title || {};
  const sectionTitleSettings = pdfSettings?.elements?.cgv_section_titles || {};
  const contentSettings = pdfSettings?.elements?.cgv_content || {};
  
  const content: any[] = [];
  
  // Titre principal
  content.push({
    text: PDF_TEXTS.CGV.TITLE,
    style: 'header',
    alignment: titleSettings.alignment || 'center',
    fontSize: titleSettings.fontSize || 14,
    color: titleSettings.color || DARK_BLUE,
    margin: [0, 10, 0, 20],
    pageBreak: 'before',
    ...(titleSettings.isBold === false ? {} : { bold: true })
  });
  
  // Générer chaque section des CGV
  PDF_TEXTS.CGV.SECTIONS.forEach(section => {
    // Titre de section
    content.push({
      text: section.title,
      fontSize: sectionTitleSettings.fontSize || 11,
      color: sectionTitleSettings.color || DARK_BLUE,
      margin: [0, 10, 0, 5],
      ...(sectionTitleSettings.isBold === false ? {} : { bold: true })
    });
    
    // Contenu principal
    content.push({
      text: section.content,
      fontSize: contentSettings.fontSize || 9,
      color: contentSettings.color || DARK_BLUE,
      alignment: contentSettings.alignment || 'justify',
      margin: [0, 0, 0, 10]
    });
    
    // Sous-sections si présentes
    if (section.subsections && section.subsections.length > 0) {
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
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const signatureSettings = pdfSettings?.elements?.signature_zone || {};
  const approvalSettings = pdfSettings?.elements?.approval_text || {};
  
  const elements = [];
  
  // Contenu principal
  elements.push({
    text: PDF_TEXTS.SIGNATURE.CONTENT,
    fontSize: signatureSettings.fontSize || 8,
    color: signatureSettings.color || DARK_BLUE,
    alignment: signatureSettings.alignment || 'left',
    margin: [0, 0, 0, 5]
  });
  
  // Points avec puces
  PDF_TEXTS.SIGNATURE.POINTS.forEach(point => {
    elements.push({
      text: point.text,
      fontSize: approvalSettings.fontSize || 8,
      color: approvalSettings.color || DARK_BLUE,
      alignment: approvalSettings.alignment || 'left',
      margin: [0, 3, 0, 0],
      ...(point.bold ? { bold: true } : approvalSettings.isBold === true ? { bold: true } : {})
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
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const salutationSettings = pdfSettings?.elements?.salutation_text || {};
  
  return {
    text: PDF_TEXTS.SALUTATION,
    fontSize: salutationSettings.fontSize || 9,
    color: salutationSettings.color || DARK_BLUE,
    alignment: salutationSettings.alignment || 'justify',
    margin: [0, 10, 0, 0]
  };
};

/**
 * Génère une structure de tableau pour les totaux (HT et TVA) sans bordures
 */
export const generateStandardTotalsTable = (totalHT: number, totalTVA: number) => {
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const totalsTableSettings = pdfSettings?.elements?.ht_vat_totals || {};
  
  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { 
            text: 'Total HT', 
            alignment: totalsTableSettings.alignment || 'left', 
            fontSize: totalsTableSettings.fontSize || 8, 
            color: totalsTableSettings.color || DARK_BLUE,
            ...(totalsTableSettings.isBold === true ? { bold: true } : {})
          },
          { 
            text: formatPrice(totalHT), 
            alignment: 'right', 
            fontSize: totalsTableSettings.fontSize || 8, 
            color: totalsTableSettings.color || DARK_BLUE 
          }
        ],
        [
          { 
            text: 'Total TVA', 
            alignment: totalsTableSettings.alignment || 'left', 
            fontSize: totalsTableSettings.fontSize || 8, 
            color: totalsTableSettings.color || DARK_BLUE,
            ...(totalsTableSettings.isBold === true ? { bold: true } : {})
          },
          { 
            text: formatPrice(totalTVA), 
            alignment: 'right', 
            fontSize: totalsTableSettings.fontSize || 8, 
            color: totalsTableSettings.color || DARK_BLUE 
          }
        ]
      ]
    },
    layout: {
      hLineWidth: function() { return 0; },
      vLineWidth: function() { return 0; },
      paddingLeft: function() { return 5; },
      paddingRight: function() { return 5; },
      paddingTop: function() { return 5; },
      paddingBottom: function() { return 5; }
    },
    margin: [0, 0, 0, 0]
  };
};

/**
 * Génère une structure de tableau pour le Total TTC avec bordure complète
 */
export const generateTTCTable = (totalTTC: number) => {
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const ttcSettings = pdfSettings?.elements?.ttc_total || {};
  const borderColor = pdfSettings?.colors?.totalBoxLines || '#e5e7eb';
  
  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { 
            text: 'Total TTC', 
            alignment: ttcSettings.alignment || 'left', 
            fontSize: ttcSettings.fontSize || 8,
            color: ttcSettings.color || DARK_BLUE,
            ...(ttcSettings.isBold === false ? {} : { bold: true })
          }, 
          { 
            text: formatPrice(totalTTC), 
            alignment: 'right', 
            fontSize: ttcSettings.fontSize || 8, 
            color: ttcSettings.color || DARK_BLUE,
            ...(ttcSettings.isBold === false ? {} : { bold: true })
          }
        ]
      ]
    },
    layout: {
      hLineWidth: function() { return 1; },
      vLineWidth: function(i, node) { 
        // Supprimer la ligne verticale centrale (i=1)
        return i === 0 || i === 2 ? 1 : 0;
      },
      hLineColor: function() { return borderColor; },
      vLineColor: function() { return borderColor; },
      paddingLeft: function() { return 5; },
      paddingRight: function() { return 5; },
      paddingTop: function() { return 5; },
      paddingBottom: function() { return 5; }
    },
    margin: [0, 0, 0, 0]
  };
};

/**
 * Fonction auxiliaire pour préparer le contenu du récapitulatif
 */
function prepareRecapContent(
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
) {
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  console.log('Préparation du contenu du récapitulatif avec les paramètres PDF:', pdfSettings);

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Récupérer les paramètres pour le titre du récapitulatif
  const titleSettings = pdfSettings?.elements?.recap_title || {};
  // Récupérer les paramètres pour l'en-tête du tableau
  const tableHeaderSettings = pdfSettings?.elements?.recap_table_header || {};
  
  // Créer le contenu du document
  const docContent: any[] = [
    // Titre du récapitulatif
    {
      text: 'RÉCAPITULATIF',
      style: 'header',
      alignment: titleSettings.alignment || 'center',
      fontSize: titleSettings.fontSize || 12,
      color: titleSettings.color || DARK_BLUE,
      margin: [0, 10, 0, 20],
      ...(titleSettings.isBold === false ? {} : { bold: true })
    }
  ];
  
  // Créer la table des totaux par pièce
  const roomTotalsTableBody = [];
  
  // Ajouter l'en-tête de la table
  roomTotalsTableBody.push([
    { 
      text: '', 
      style: 'tableHeader', 
      alignment: tableHeaderSettings.alignment || 'left', 
      color: tableHeaderSettings.color || DARK_BLUE, 
      fontSize: tableHeaderSettings.fontSize || 8 
    },
    { 
      text: 'Montant HT', 
      style: 'tableHeader', 
      alignment: 'right', 
      color: tableHeaderSettings.color || DARK_BLUE, 
      fontSize: tableHeaderSettings.fontSize || 8 
    }
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
  
  // Couleur des lignes de tableaux
  const tableLineColor = pdfSettings?.colors?.detailsLines || '#e5e7eb';
  
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
        return tableLineColor;
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
  
  return docContent;
}

// Fonction auxiliaire pour préparer le contenu de la page de garde
function prepareCoverContent(fields: any[], company: any, metadata?: ProjectMetadata) {
  console.log('Préparation du contenu de la page de garde...');
  
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  
  // Récupérer les paramètres pour différentes sections
  const insuranceSettings = pdfSettings?.elements?.insurance_info || {};
  const sloganSettings = pdfSettings?.elements?.company_slogan || {};
  const companyAddressSettings = pdfSettings?.elements?.company_address || {};
  const contactLabelSettings = pdfSettings?.elements?.contact_labels || {};
  const contactValueSettings = pdfSettings?.elements?.contact_values || {};
  const quoteNumberSettings = pdfSettings?.elements?.quote_number || {};
  const quoteDateSettings = pdfSettings?.elements?.quote_date || {};
  const quoteValiditySettings = pdfSettings?.elements?.quote_validity || {};
  const clientTitleSettings = pdfSettings?.elements?.client_title || {};
  const clientContentSettings = pdfSettings?.elements?.client_content || {};
  const projectTitleSettings = pdfSettings?.elements?.project_title || {};
  const projectLabelSettings = pdfSettings?.elements?.project_labels || {};
  const projectValueSettings = pdfSettings?.elements?.project_values || {};
  
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
            company?.logo_url ? {
              image: company.logo_url,
              width: pdfSettings?.logoSettings?.width || 172,
              height: pdfSettings?.logoSettings?.height || 72,
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
              fontSize: insuranceSettings.fontSize || 10, 
              color: insuranceSettings.color || DARK_BLUE,
              bold: insuranceSettings.isBold || false
            },
            { 
              text: 'Responsabilité civile', 
              fontSize: insuranceSettings.fontSize || 10, 
              color: insuranceSettings.color || DARK_BLUE,
              bold: insuranceSettings.isBold || false
            },
            { 
              text: 'Responsabilité civile décennale', 
              fontSize: insuranceSettings.fontSize || 10, 
              color: insuranceSettings.color || DARK_BLUE,
              bold: insuranceSettings.isBold || false
            }
          ],
          alignment: insuranceSettings.alignment || 'right'
        }
      ]
    },
    
    // Slogan
    {
      text: slogan,
      fontSize: sloganSettings.fontSize || 12,
      color: sloganSettings.color || DARK_BLUE,
      alignment: sloganSettings.alignment || 'left',
      margin: [0, 10, 0, 20],
      ...(sloganSettings.isBold === false ? {} : { bold: true })
    },
    
    // Coordonnées société - Nom et adresse combinés
    {
      text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
      fontSize: companyAddressSettings.fontSize || 11,
      color: companyAddressSettings.color || DARK_BLUE,
      alignment: companyAddressSettings.alignment || 'left',
      margin: [0, 0, 0, 3]
    },
    
    // Tél et Mail
    {
      columns: [
        {
          width: col1Width,
          text: 'Tél:',
          fontSize: contactLabelSettings.fontSize || 10,
          bold: contactLabelSettings.isBold || false,
          color: contactLabelSettings.color || DARK_BLUE,
          alignment: contactLabelSettings.alignment || 'left'
        },
        {
          width: col2Width,
          text: company?.tel1 || '',
          fontSize: contactValueSettings.fontSize || 10,
          bold: contactValueSettings.isBold || false,
          color: contactValueSettings.color || DARK_BLUE,
          alignment: contactValueSettings.alignment || 'left'
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
          fontSize: contactLabelSettings.fontSize || 10
        },
        {
          width: col2Width,
          text: company.tel2,
          fontSize: contactValueSettings.fontSize || 10,
          bold: contactValueSettings.isBold || false,
          color: contactValueSettings.color || DARK_BLUE,
          alignment: contactValueSettings.alignment || 'left'
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
          fontSize: contactLabelSettings.fontSize || 10,
          bold: contactLabelSettings.isBold || false,
          color: contactLabelSettings.color || DARK_BLUE,
          alignment: contactLabelSettings.alignment || 'left'
        },
        {
          width: col2Width,
          text: company?.email || '',
          fontSize: contactValueSettings.fontSize || 10,
          bold: contactValueSettings.isBold || false,
          color: contactValueSettings.color || DARK_BLUE,
          alignment: contactValueSettings.alignment || 'left'
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
            { 
              text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `, 
              fontSize: quoteNumberSettings.fontSize || 10, 
              bold: quoteNumberSettings.isBold || false,
              color: quoteNumberSettings.color || DARK_BLUE 
            },
            { 
              text: ` (Validité de l'offre : 3 mois.)`, 
              fontSize: quoteValiditySettings.fontSize || 9, 
              italics: true, 
              color: quoteValiditySettings.color || DARK_BLUE 
            }
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
          fontSize: clientTitleSettings.fontSize || 10,
          bold: clientTitleSettings.isBold || true,
          color: clientTitleSettings.color || DARK_BLUE,
          alignment: clientTitleSettings.alignment || 'left'
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
          fontSize: clientContentSettings.fontSize || 10,
          bold: clientContentSettings.isBold || false,
          color: clientContentSettings.color || DARK_BLUE,
          alignment: clientContentSettings.alignment || 'left',
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
      fontSize: projectTitleSettings.fontSize || 10,
      bold: projectTitleSettings.isBold || true,
      color: projectTitleSettings.color || DARK_BLUE,
      alignment: projectTitleSettings.alignment || 'left',
      margin: [0, 0, 0, 5]
    }
  ];
  
  // Ajouter les informations conditionnelles
  if (occupant) {
    content.push({
      text: occupant,
      fontSize: projectValueSettings.fontSize || 10,
      bold: projectValueSettings.isBold || false,
      color: projectValueSettings.color || DARK_BLUE,
      alignment: projectValueSettings.alignment || 'left',
      margin: [0, 5, 0, 0]
    });
  }
  
  if (projectAddress) {
    content.push({
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontSize: projectLabelSettings.fontSize || 10,
      bold: projectLabelSettings.isBold || true,
      color: projectLabelSettings.color || DARK_BLUE,
      alignment: projectLabelSettings.alignment || 'left',
      margin: [0, 5, 0, 0]
    });
    
    content.push({
      text: projectAddress,
      fontSize: projectValueSettings.fontSize || 10,
      bold: projectValueSettings.isBold || false,
      color: projectValueSettings.color || DARK_BLUE,
      alignment: projectValueSettings.alignment || 'left',
      margin: [10, 3, 0, 0]
    });
  }
  
  if (projectDescription) {
    content.push({
      text: 'Descriptif:',
      fontSize: projectLabelSettings.fontSize || 10,
      bold: projectLabelSettings.isBold || true,
      color: projectLabelSettings.color || DARK_BLUE,
      alignment: projectLabelSettings.alignment || 'left',
      margin: [0, 8, 0, 0]
    });
    
    content.push({
      text: projectDescription,
      fontSize: projectValueSettings.fontSize || 10,
      bold: projectValueSettings.isBold || false,
      color: projectValueSettings.color || DARK_BLUE,
      alignment: projectValueSettings.alignment || 'left',
      margin: [10, 3, 0, 0]
    });
  }
  
  if (additionalInfo) {
    content.push({
      text: additionalInfo,
      fontSize: projectValueSettings.fontSize || 10,
      bold: projectValueSettings.isBold || false,
      color: projectValueSettings.color || DARK_BLUE,
      alignment: projectValueSettings.alignment || 'left',
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
  metadata?: ProjectMetadata
) {
  console.log('Préparation du contenu des détails des travaux...');
  
  // Récupérer les paramètres PDF
  const pdfSettings = getPdfSettings();
  const detailTitleSettings = pdfSettings?.elements?.detail_title || {};
  const tableHeaderSettings = pdfSettings?.elements?.detail_table_header || {};
  const workDetailsSettings = pdfSettings?.elements?.work_details || {};
  const roomTitleSettings = pdfSettings?.elements?.room_title || {};
  const moSuppliesSettings = pdfSettings?.elements?.mo_supplies || {};
  const qtyColumnSettings = pdfSettings?.elements?.qty_column || {};
  const priceColumnSettings = pdfSettings?.elements?.price_column || {};
  const vatColumnSettings = pdfSettings?.elements?.vat_column || {};
  const totalColumnSettings = pdfSettings?.elements?.total_column || {};
  const roomTotalSettings = pdfSettings?.elements?.room_total || {};
  
  // Définir la couleur des lignes du tableau
  const tableLineColor = pdfSettings?.colors?.detailsLines || '#e5e7eb';
  // Définir la couleur de fond du tableau
  const tableBackgroundColor = pdfSettings?.colors?.background || '#f3f4f6';
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer l'en-tête du tableau commun
  const tableHeaderRow = [
    { 
      text: 'Description', 
      style: 'tableHeader', 
      alignment: tableHeaderSettings.alignment || 'left', 
      color: tableHeaderSettings.color || DARK_BLUE,
      fontSize: tableHeaderSettings.fontSize || 9,
      ...(tableHeaderSettings.isBold === false ? {} : { bold: true })
    },
    { 
      text: 'Quantité', 
      style: 'tableHeader', 
      alignment: 'center', 
      color: tableHeaderSettings.color || DARK_BLUE,
      fontSize: tableHeaderSettings.fontSize || 9,
      ...(tableHeaderSettings.isBold === false ? {} : { bold: true })
    },
    {
