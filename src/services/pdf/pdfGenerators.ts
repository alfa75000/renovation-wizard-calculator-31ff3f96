
// Fonctions utilitaires pour générer des parties spécifiques des PDF

import { Travail, ProjectMetadata } from '@/types';
import { 
  PDF_TEXTS, 
  DARK_BLUE, 
  formatPrice, 
  formatQuantity,
  TABLE_COLUMN_WIDTHS
} from './pdfConstants';

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
 */
export const formatMOFournitures = (travail: Travail): string => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = (totalHT * travail.tauxTVA) / 100;
  
  return `[ MO: ${formatPrice(travail.prixMainOeuvre)}/u ] [ Fourn: ${formatPrice(travail.prixFournitures)}/u ] [ Total HT: ${formatPrice(prixUnitaireHT)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formatPrice(montantTVA)} ]`;
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
