
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

// Importer les constantes et les utilitaires
import { 
  DARK_BLUE, 
  PDF_STYLES, 
  PDF_MARGINS, 
  TABLE_COLUMN_WIDTHS
} from './pdf/pdfConstants';

// Importer les générateurs de contenu
import {
  generateFooter,
  generateHeaderContent,
} from './pdf/pdfGenerators';

// Importer les générateurs modulaires
import {
  prepareCoverContent,
  prepareDetailsContent,
  prepareRecapContent
} from './pdf/generators';

// Initialiser pdfMake avec les polices
if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

// Fonction pour générer le PDF complet du devis
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

// Fonction pour générer uniquement la page de garde du PDF
export const generateCoverPDF = async (fields: any[], company: any) => {
  console.log('Génération du PDF de la page de garde', { fields, company });
  
  try {
    // Utiliser le générateur de contenu pour la page de garde
    const coverContent = prepareCoverContent(fields, company);
    
    // Créer le document PDF
    const docDefinition = {
      content: coverContent,
      styles: PDF_STYLES,
      defaultStyle: {
        fontSize: 9,
        color: DARK_BLUE
      },
      pageMargins: PDF_MARGINS.COVER
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`page-garde-devis.pdf`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF de la page de garde:', error);
    throw error;
  }
};

// Fonction pour générer uniquement les détails des travaux
export const generateDetailsPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  console.log('Génération du PDF des détails des travaux avec pdfMake:', { pdfSettings });

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

// Fonction pour générer uniquement le récapitulatif
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
