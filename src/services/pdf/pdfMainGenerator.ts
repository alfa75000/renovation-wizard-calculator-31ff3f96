
import { Room, Travail, ProjectMetadata, CompanyData } from '@/types';
import pdfMake from '../pdf/pdfInit';
import { generateCoverContent } from './generators/coverGenerator';
import { generateDetailsContent } from './generators/detailsGenerator';
import { generateRecapContent } from './generators/recapGenerator';
import { getPdfSettings } from './config/pdfSettingsManager';
import { getPdfMargins } from './utils/styleUtils';
import { PDF_STYLES } from './pdfConstants';

/**
 * Génère le PDF complet du devis
 * @param fields - Champs du devis
 * @param company - Informations de l'entreprise
 * @param rooms - Liste des pièces
 * @param travaux - Liste des travaux
 * @param getTravauxForPiece - Fonction pour récupérer les travaux d'une pièce
 * @param metadata - Métadonnées du projet
 * @returns Promise<boolean> - Promesse résolue lorsque le PDF est généré
 */
export const generateCompletePDF = async (
  fields: any[],
  company: CompanyData | null,
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
): Promise<boolean> => {
  console.log('Génération du PDF complet du devis avec les nouveaux paramètres...');
  
  try {
    const settings = getPdfSettings();
    
    // Générer les contenus des différentes parties
    const coverContent = generateCoverContent(fields, company, metadata);
    const detailsContent = generateDetailsContent(rooms, travaux, getTravauxForPiece, metadata);
    const recapContent = generateRecapContent(rooms, travaux, getTravauxForPiece, metadata);
    
    // Définition du document
    const docDefinition: any = {
      content: [
        // Page de garde
        ...coverContent,
        // Page(s) de détails
        { text: '', pageBreak: 'before' },
        ...detailsContent,
        // Page récapitulative
        { text: '', pageBreak: 'before' },
        ...recapContent
      ],
      styles: PDF_STYLES,
      defaultStyle: {
        fontSize: 9,
        color: '#333333'
      },
      pageMargins: getPdfMargins('cover', settings),
      // Pied de page
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: `${company?.name || 'Entreprise'} - Page ${currentPage} sur ${pageCount}`,
          alignment: 'center',
          fontSize: 8,
          margin: [40, 0, 40, 10]
        };
      }
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`devis-${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF complet généré avec succès');
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

/**
 * Génère le PDF des pages de détails seulement
 * @param rooms - Liste des pièces
 * @param travaux - Liste des travaux
 * @param getTravauxForPiece - Fonction pour récupérer les travaux d'une pièce
 * @param metadata - Métadonnées du projet
 * @returns Promise<boolean> - Promesse résolue lorsque le PDF est généré
 */
export const generateDetailsPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
): Promise<boolean> => {
  console.log('Génération du PDF des détails avec les nouveaux paramètres...');
  
  try {
    const settings = getPdfSettings();
    
    // Générer le contenu des détails
    const detailsContent = generateDetailsContent(rooms, travaux, getTravauxForPiece, metadata);
    
    // Définition du document
    const docDefinition: any = {
      content: detailsContent,
      styles: PDF_STYLES,
      defaultStyle: {
        fontSize: 9,
        color: '#333333'
      },
      pageMargins: getPdfMargins('details', settings),
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: `Détails des travaux - Page ${currentPage} sur ${pageCount}`,
          alignment: 'center',
          fontSize: 8,
          margin: [40, 0, 40, 10]
        };
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
};

/**
 * Génère le PDF de la page récapitulative seulement
 * @param rooms - Liste des pièces
 * @param travaux - Liste des travaux
 * @param getTravauxForPiece - Fonction pour récupérer les travaux d'une pièce
 * @param metadata - Métadonnées du projet
 * @returns Promise<boolean> - Promesse résolue lorsque le PDF est généré
 */
export const generateRecapPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
): Promise<boolean> => {
  console.log('Génération du PDF récapitulatif avec les nouveaux paramètres...');
  
  try {
    const settings = getPdfSettings();
    
    // Générer le contenu du récapitulatif
    const recapContent = generateRecapContent(rooms, travaux, getTravauxForPiece, metadata);
    
    // Définition du document
    const docDefinition: any = {
      content: recapContent,
      styles: PDF_STYLES,
      defaultStyle: {
        fontSize: 9,
        color: '#333333'
      },
      pageMargins: getPdfMargins('recap', settings),
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: `Récapitulatif - Page ${currentPage} sur ${pageCount}`,
          alignment: 'center',
          fontSize: 8,
          margin: [40, 0, 40, 10]
        };
      }
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`devis-recap-${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF récapitulatif généré avec succès');
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF récapitulatif:', error);
    throw error;
  }
};
