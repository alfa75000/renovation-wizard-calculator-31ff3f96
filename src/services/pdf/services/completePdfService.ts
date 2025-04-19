
import { Room, Travail, ProjectMetadata, PrintableField, CompanyData } from '@/types';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { ensureSupportedFont } from '../utils/fontUtils';
import { generatePdfDocument } from './pdfDocumentService';
import { prepareCoverContent } from '../generators/coverGenerator';
import { prepareDetailsContent } from '../generators/detailsGenerator';
import { prepareRecapContent } from '../generators/recapGenerator';
import { PDF_MARGINS } from '../constants/pdfConstants';

export const generateCompletePDF = async (
  enabledFields: PrintableField[],
  companyData: CompanyData | null,
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('Génération du PDF complet avec les paramètres:', pdfSettings);
    
    // Assurons-nous d'utiliser une police supportée
    const safeSettings = pdfSettings ? {
      ...pdfSettings,
      fontFamily: ensureSupportedFont(pdfSettings.fontFamily)
    } : undefined;
    
    // Préparer les champs pour la page de garde
    const fields = enabledFields
      .filter(field => field.id !== 'companyLogo' && field.id !== 'summary')
      .map(field => ({
        id: field.id,
        content: field.content || ''
      }));

    // Générer les contenus
    const coverContent = prepareCoverContent(fields, companyData, metadata, safeSettings);
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);

    // Définir les marges
    const margins = {
      cover: safeSettings?.margins?.cover || PDF_MARGINS.COVER,
      details: safeSettings?.margins?.details || PDF_MARGINS.DETAILS,
      recap: safeSettings?.margins?.recap || PDF_MARGINS.RECAP
    };

    // Construire le contenu du document
    const content: any[] = [
      { margin: margins.cover, stack: coverContent },
      { pageBreak: 'before', margin: margins.details, stack: detailsContent }
    ];

    // Ajouter le récapitulatif si activé
    if (enabledFields.find(field => field.id === 'summary')?.enabled) {
      content.push({ pageBreak: 'before', margin: margins.recap, stack: recapContent });
    }

    return generatePdfDocument({
      metadata,
      content,
      fontFamily: safeSettings?.fontFamily
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    throw error;
  }
};
