
// Fonctions utilitaires pour générer des parties spécifiques des PDF

import { Travail, ProjectMetadata } from '@/types';
import { 
  PDF_TEXTS, 
  DARK_BLUE, 
  formatPrice, 
  formatQuantity,
  TABLE_COLUMN_WIDTHS
} from './pdfConstants';
import { PdfSettings } from './config/pdfSettingsTypes';
import { getCustomColors, getFontSizes } from './pdfGenerationUtils';

/**
 * Génère le contenu de l'en-tête pour les documents PDF
 */
export const generateHeaderContent = (metadata?: ProjectMetadata, currentPage: number = 1, totalPages: number = 1, pdfSettings?: PdfSettings) => {
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});
  
  console.log('[generateHeaderContent] En-tête généré avec les couleurs:', colors);
  console.log('[generateHeaderContent] En-tête généré avec les tailles de police:', fontSizes);
  
  return {
    text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${totalPages}`,
    alignment: 'right',
    fontSize: fontSizes.small,
    color: colors.mainText,
    margin: [40, 20, 40, 10]
  };
};

/**
 * Génère le pied de page standard pour tous les documents PDF
 * Utilise les données de l'entreprise stockées dans metadata.company
 */
export const generateFooter = (metadata?: ProjectMetadata, pdfSettings?: PdfSettings) => {
  console.log("[generateFooter] Données de l'entreprise:", metadata?.company);
  
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});
  
  console.log('[generateFooter] Pied de page généré avec les couleurs:', colors);
  console.log('[generateFooter] Pied de page généré avec les tailles de police:', fontSizes);
  
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
    fontSize: fontSizes.small,
    color: colors.mainText,
    alignment: 'center',
    margin: [40, 0, 40, 20]
  };
};

/**
 * Génère le format MO/Fournitures avec TVA
 * Modifié: Retiré le Total HT par unité et augmenté la taille de police
 */
export const formatMOFournitures = (travail: Travail, pdfSettings?: PdfSettings): string => {
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
export const generateStandardTotalsTable = (totalHT: number, totalTVA: number, pdfSettings?: PdfSettings) => {
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});

  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { text: 'Total HT', alignment: 'left', fontSize: fontSizes.small, bold: false },
          { text: formatPrice(totalHT), alignment: 'right', fontSize: fontSizes.small, color: colors.mainText }
        ],
        [
          { text: 'Total TVA', alignment: 'left', fontSize: fontSizes.small, bold: false },
          { text: formatPrice(totalTVA), alignment: 'right', fontSize: fontSizes.small, color: colors.mainText }
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
export const generateTTCTable = (totalTTC: number, pdfSettings?: PdfSettings) => {
  const colors = getCustomColors(pdfSettings || {});
  const fontSizes = getFontSizes(pdfSettings || {});

  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { text: 'Total TTC', alignment: 'left', fontSize: fontSizes.small, bold: true },
          { text: formatPrice(totalTTC), alignment: 'right', fontSize: fontSizes.small, color: colors.mainText, bold: true }
        ]
      ]
    },
    layout: {
      hLineWidth: function() { return 1; },
      vLineWidth: function(i, node) { 
        // Supprimer la ligne verticale centrale (i=1)
        return i === 0 || i === 2 ? 1 : 0;
      },
      hLineColor: function() { return colors.totalBoxLines; },
      vLineColor: function() { return colors.totalBoxLines; },
      paddingLeft: function() { return 5; },
      paddingRight: function() { return 5; },
      paddingTop: function() { return 5; },
      paddingBottom: function() { return 5; }
    },
    margin: [0, 0, 0, 0]
  };
};
