
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
