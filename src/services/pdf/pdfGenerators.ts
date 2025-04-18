
// Fonctions utilitaires pour générer des parties spécifiques des PDF

import { Travail, ProjectMetadata } from '@/types';
import { 
  formatPrice, 
  formatQuantity,
  TABLE_COLUMN_WIDTHS,
  DARK_BLUE
} from './pdfConstants';
import { PDF_TEXTS } from './config/pdfTexts';
import { getPdfSettings } from './config/pdfSettingsManager';

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
 */
export const formatMOFournitures = (travail: Travail): string => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = (totalHT * travail.tauxTVA) / 100;
  
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
        if (subsection.title) {
          // Titre de sous-section
          content.push({
            text: subsection.title,
            bold: true,
            fontSize: 9,
            margin: [0, 0, 0, 5]
          });
        }
        
        // Contenu principal de la sous-section
        if (subsection.content) {
          content.push({
            text: subsection.content,
            fontSize: 9,
            margin: [0, 0, 0, subsection.bullets ? 5 : 10]
          });
        }
        
        // Points à puces si présents
        if (subsection.bullets) {
          subsection.bullets.forEach(bullet => {
            content.push({
              text: `• ${bullet}`,
              fontSize: 9,
              margin: [10, 0, 0, 3]
            });
          });
          
          // Contenu après les puces si présent
          if (subsection.content_after) {
            content.push({
              text: subsection.content_after,
              fontSize: 9,
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
 * Génère le contenu pour la section de signature
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
 * Génère le texte de salutation
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
