
import { Room, Travail, CompanyData, ProjectMetadata, PrintableField } from '@/types';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { ensureSupportedFont } from '../utils/fontUtils';
import { generatePdfDocument } from './pdfDocumentService';
import { prepareCoverContent } from '../generators/coverGenerator';
import { prepareDetailsContent } from '../generators/detailsGenerator';
import { prepareRecapContent } from '../generators/recapGenerator';
import { PDF_MARGINS } from '../constants/pdfConstants';

export const generateCompletePDF = async (
  enabledFields: PrintableField[],
  company: CompanyData | null,
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
    
    // Transformer les champs en structure attendue par le générateur
    const fields = enabledFields.map(field => ({
      id: field.id,
      content: field.content
    }));
    
    // Collecter toutes les parties du document
    const documentParts = [];
    
    // Vérifier si la page de garde est activée
    const includeCover = enabledFields.some(field => 
      ['companyLogo', 'companyName', 'client', 'devisNumber', 'devisDate', 
      'validityOffer', 'projectDescription', 'projectAddress', 'occupant', 
      'additionalInfo'].includes(field.id) && field.enabled
    );
    
    // Vérifier si le récapitulatif est activé
    const includeRecap = enabledFields.some(field => field.id === 'summary' && field.enabled);
    
    // Définir les marges pour chaque partie
    const margins = {
      cover: safeSettings?.margins?.cover || PDF_MARGINS.COVER,
      details: safeSettings?.margins?.details || PDF_MARGINS.DETAILS,
      recap: safeSettings?.margins?.recap || PDF_MARGINS.RECAP
    };
    
    // Ajouter la page de garde si activée
    if (includeCover) {
      const coverContent = prepareCoverContent(fields, company, metadata, safeSettings);
      documentParts.push({
        margin: margins.cover,
        stack: coverContent
      });
    }
    
    // Ajouter la page de détails des travaux
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);
    documentParts.push({
      pageBreak: documentParts.length > 0 ? 'before' : undefined,
      margin: margins.details,
      stack: detailsContent
    });
    
    // Ajouter la page de récapitulatif si activée
    if (includeRecap) {
      const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);
      documentParts.push({
        pageBreak: 'before',
        margin: margins.recap,
        stack: recapContent
      });
    }
    
    // Générer le document PDF
    return generatePdfDocument({
      metadata,
      content: documentParts,
      fontFamily: safeSettings?.fontFamily,
      logoSettings: safeSettings?.logoSettings,
      useHeader: true,
      useFooter: true
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    throw error;
  }
};
