
// Fonctions utilitaires pour générer des parties spécifiques des PDF

import { Room, Travail, ProjectMetadata } from '@/types';
import { 
  PDF_TEXTS, 
  DARK_BLUE, 
  formatPrice, 
  formatQuantity,
  TABLE_COLUMN_WIDTHS
} from './pdfConstants';
import { getElementStyles } from './utils/pdfStyleUtils';

/**
 * Génère le contenu de l'en-tête pour les documents PDF
 */
export const generateHeaderContent = (metadata?: ProjectMetadata, currentPage: number = 1, totalPages: number = 1) => {
  const headerDefaultStyles = {
    alignment: 'right' as const,
    fontSize: 8,
    color: DARK_BLUE,
    margin: [40, 20, 40, 10]
  };

  const headerStyles = getElementStyles('detail_header', headerDefaultStyles);

  return {
    text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${totalPages}`,
    ...headerStyles
  };
};

/**
 * Génère le pied de page standard pour tous les documents PDF
 */
export const generateFooter = (metadata?: ProjectMetadata) => {
  const footerDefaultStyles = {
    fontSize: 7,
    color: DARK_BLUE,
    alignment: 'center' as const,
    margin: [40, 0, 40, 20]
  };

  const footerStyles = getElementStyles('cover_footer', footerDefaultStyles);
  const company = metadata?.company;
  
  return {
    text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
    ...footerStyles
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

/**
 * Fonction auxiliaire pour préparer le contenu du r��capitulatif
 */
function prepareRecapContent(
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
) {
  const recapTitleDefaultStyles = {
    text: 'RÉCAPITULATIF',
    style: 'header',
    alignment: 'center' as const,
    fontSize: 12,
    bold: true as const,
    color: DARK_BLUE,
    margin: [0, 10, 0, 20]
  };

  const recapTitleStyles = getElementStyles('recap_title', recapTitleDefaultStyles);
  
  const docContent: any[] = [
    // Titre du récapitulatif
    {
      ...recapTitleStyles,
      text: recapTitleStyles.text,
      pageBreak: 'before'
    }
  ];

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
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

