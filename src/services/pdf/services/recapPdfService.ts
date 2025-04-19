
import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { ensureSupportedFont } from '../utils/fontUtils';
import { generatePdfDocument } from './pdfDocumentService';
import { prepareRecapContent } from '../generators/recapGenerator';
import { PDF_MARGINS } from '../constants/pdfConstants';

export const generateRecapPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('Génération du PDF récapitulatif avec les paramètres:', pdfSettings);
    
    // Assurons-nous d'utiliser une police supportée
    const safeSettings = pdfSettings ? {
      ...pdfSettings,
      fontFamily: ensureSupportedFont(pdfSettings.fontFamily)
    } : undefined;
    
    // Générer le contenu du récapitulatif
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);
    
    // Définir les marges
    const margins = safeSettings?.margins?.recap || PDF_MARGINS.RECAP;
    
    return generatePdfDocument({
      metadata,
      content: [{ margin: margins, stack: recapContent }],
      fontFamily: safeSettings?.fontFamily,
      title: `Récapitulatif - ${metadata?.nomProjet || 'Projet'}`,
      logoSettings: safeSettings?.logoSettings,
      useHeader: true,
      useFooter: true
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF récapitulatif:', error);
    throw error;
  }
};
