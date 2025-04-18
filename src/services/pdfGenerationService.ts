
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata, CompanyData } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { prepareCoverContent } from '@/services/pdf/generators/coverGenerator';
import { prepareDetailsContent } from '@/services/pdf/generators/detailsGenerator';
import { prepareRecapContent } from '@/services/pdf/generators/recapGenerator';
import { PDF_STYLES, PDF_MARGINS, DARK_BLUE } from '@/services/pdf/constants/pdfConstants';
import { generateHeaderContent, generateFooter } from '@/services/pdf/components/pdfComponents';
import { TABLE_COLUMN_WIDTHS } from '@/services/pdf/utils/pdfUtils';

// Initialize pdfMake with fonts
if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export const generateCompletePDF = async (
  fields: any[],
  company: CompanyData | null,
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  console.log('Génération du PDF complet du devis avec paramètres:', pdfSettings);
  
  try {
    // Prepare content for each section
    const coverContent = prepareCoverContent(fields, company, metadata);
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // Merge all contents into one document
    const docDefinition = {
      content: [
        ...coverContent,
        { text: '', pageBreak: 'before' },
        ...detailsContent,
        { text: '', pageBreak: 'before' },
        ...recapContent
      ],
      styles: PDF_STYLES,
      defaultStyle: {
        fontSize: 9,
        color: '#002855'
      },
      pageMargins: PDF_MARGINS.COVER,
      footer: (currentPage: number, pageCount: number) => generateFooter(metadata),
      header: (currentPage: number, pageCount: number) => {
        if (currentPage === 1) return null;
        return generateHeaderContent(metadata, currentPage, pageCount);
      }
    };
    
    // Generate and download the complete PDF
    pdfMake.createPdf(docDefinition).download(`devis-complet-${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF complet généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    throw error;
  }
};

export const generateDetailsPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  console.log('Génération du PDF des détails des travaux avec pdfMake:', { pdfSettings });

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
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
