
import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { ensureSupportedFont } from '../utils/fontUtils';
import { generatePdfDocument } from './pdfDocumentService';
import { prepareCoverContent } from '../generators/coverGenerator';
import { prepareDetailsContent } from '../generators/detailsGenerator';
import { prepareRecapContent } from '../generators/recapGenerator';
import { PDF_MARGINS } from '../constants/pdfConstants';

export const generateDetailsPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('Génération du PDF avec les paramètres:', pdfSettings);
    
    // Assurons-nous d'utiliser une police supportée
    const safeSettings = pdfSettings ? {
      ...pdfSettings,
      fontFamily: ensureSupportedFont(pdfSettings.fontFamily)
    } : undefined;
    
    // Préparer les champs pour la page de garde
    const fields = [
      { id: 'devisNumber', content: metadata?.devisNumber || 'D-' + new Date().toISOString().slice(0, 10) },
      { id: 'devisDate', content: metadata?.dateDevis || new Date().toISOString().slice(0, 10) },
      { id: 'client', content: metadata?.clientsData || 'Client non spécifié' },
      { id: 'projectDescription', content: metadata?.descriptionProjet || '' },
      { id: 'projectAddress', content: metadata?.adresseChantier || '' },
      { id: 'occupant', content: metadata?.occupant || '' },
      { id: 'additionalInfo', content: metadata?.infoComplementaire || '' }
    ];

    // Générer les contenus des différentes parties du PDF
    const coverContent = prepareCoverContent(fields, metadata?.company || null, metadata, safeSettings);
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, safeSettings);

    // Définir les marges pour chaque partie
    const margins = {
      cover: safeSettings?.margins?.cover || PDF_MARGINS.COVER,
      details: safeSettings?.margins?.details || PDF_MARGINS.DETAILS,
      recap: safeSettings?.margins?.recap || PDF_MARGINS.RECAP
    };

    return generatePdfDocument({
      metadata,
      content: [
        { margin: margins.cover, stack: coverContent },
        { pageBreak: 'before', margin: margins.details, stack: detailsContent },
        { pageBreak: 'before', margin: margins.recap, stack: recapContent }
      ],
      fontFamily: safeSettings?.fontFamily,
      logoSettings: safeSettings?.logoSettings,
      useHeader: true,
      useFooter: true
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
