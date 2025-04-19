
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
    console.log('Company data reçu pour le PDF complet:', companyData);
    console.log('Logo dans companyData:', companyData?.logo_url);
    console.log('Paramètres du logo dans pdfSettings:', pdfSettings?.logoSettings);
    
    // Assurons-nous d'utiliser une police supportée
    const safeSettings = pdfSettings ? {
      ...pdfSettings,
      fontFamily: ensureSupportedFont(pdfSettings.fontFamily)
    } : undefined;
    
    console.log('SafeSettings appliqués:', safeSettings);
    
    // Préparer les champs pour la page de garde
    const fields = enabledFields
      .filter(field => field.id !== 'companyLogo' && field.id !== 'summary')
      .map(field => ({
        id: field.id,
        content: field.content || ''
      }));

    console.log('Fields préparés pour la page de garde:', fields);
    console.log('Logo activé?', enabledFields.find(field => field.id === 'companyLogo')?.enabled);
    
    // Si logo est activé, assurons-nous qu'il est bien passé
    const logoEnabled = enabledFields.find(field => field.id === 'companyLogo')?.enabled || false;
    console.log('Logo est activé:', logoEnabled);
    
    // Si metadata a déjà company, assurons-nous que le logo_url est présent
    if (metadata?.company && companyData?.logo_url) {
      console.log('Avant update: metadata.company.logo_url =', metadata.company.logo_url);
      
      // Mettre à jour le logo dans metadata si nécessaire
      if (!metadata.company.logo_url && companyData.logo_url) {
        metadata = {
          ...metadata,
          company: {
            ...metadata.company,
            logo_url: companyData.logo_url
          }
        };
        console.log('Logo URL mis à jour dans metadata:', metadata.company.logo_url);
      }
    }
    
    // Assurons-nous que company est inclus dans metadata
    if (!metadata?.company && companyData) {
      metadata = {
        ...metadata,
        company: companyData
      };
      console.log('Company data ajouté à metadata');
    }

    // Générer les contenus
    console.log('Début génération du contenu de couverture avec logo');
    const coverContent = prepareCoverContent(fields, companyData, metadata, safeSettings);
    console.log('Contenu de couverture généré, premier élément:', coverContent[0]);
    
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
    
    console.log('Contenu du document prêt pour génération PDF');
    console.log('Logo URL final avant génération:', metadata?.company?.logo_url);

    return generatePdfDocument({
      metadata,
      content,
      fontFamily: safeSettings?.fontFamily,
      showHeader: true,
      showFooter: true
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    throw error;
  }
};
