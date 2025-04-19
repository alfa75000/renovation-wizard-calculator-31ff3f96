
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
    console.log('### COMPLETE PDF SERVICE - DÉBUT DE GÉNÉRATION ###');
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
    
    // Si logo est activé, assurons-nous qu'il est bien passé
    const logoEnabled = enabledFields.find(field => field.id === 'companyLogo')?.enabled || false;
    console.log('Logo est activé:', logoEnabled);
    
    // Récupérer le contenu du logo s'il existe
    const logoContent = enabledFields.find(field => field.id === 'companyLogo')?.content;
    console.log('Logo content dans les champs activés:', logoContent);
    
    // Si un logo_url est fourni dans le champ content, utilisons-le
    if (logoContent && typeof logoContent === 'string' && logoContent.trim() !== '') {
      console.log('Logo trouvé dans le contenu du champ:', logoContent);
      
      // Si companyData existe, mettons à jour le logo_url
      if (companyData) {
        companyData = {
          ...companyData,
          logo_url: logoContent
        };
        console.log('Logo URL mis à jour dans companyData:', companyData.logo_url);
      }
    }
    
    // Si pdfSettings a un logoUrl et que useDefaultLogo est true, utilisons-le
    if (safeSettings?.logoSettings?.useDefaultLogo && safeSettings?.logoSettings?.logoUrl) {
      console.log('Utilisation du logo par défaut des paramètres:', safeSettings.logoSettings.logoUrl);
      
      if (companyData) {
        companyData = {
          ...companyData,
          logo_url: safeSettings.logoSettings.logoUrl
        };
        console.log('Logo URL mis à jour dans companyData avec le logo par défaut:', companyData.logo_url);
      }
    }

    // Assurons-nous que company est inclus dans metadata
    let updatedMetadata = metadata || {};
    
    if (!updatedMetadata.company && companyData) {
      updatedMetadata = {
        ...updatedMetadata,
        company: companyData
      };
      console.log('Company data ajouté à metadata');
    }
    
    // Si metadata a déjà company, assurons-nous que le logo_url est présent
    if (updatedMetadata.company && companyData?.logo_url) {
      console.log('Avant update: metadata.company.logo_url =', updatedMetadata.company.logo_url);
      
      // Mettre à jour le logo dans metadata si nécessaire
      if ((!updatedMetadata.company.logo_url || updatedMetadata.company.logo_url === '') && companyData.logo_url) {
        updatedMetadata = {
          ...updatedMetadata,
          company: {
            ...updatedMetadata.company,
            logo_url: companyData.logo_url
          }
        };
        console.log('Logo URL mis à jour dans metadata:', updatedMetadata.company.logo_url);
      }
    }

    // Générer les contenus
    console.log('Début génération du contenu de couverture avec logo');
    console.log('Données company envoyées à coverGenerator:', companyData);
    console.log('Logo URL dans company avant génération:', companyData?.logo_url);
    
    const coverContent = prepareCoverContent(fields, companyData, updatedMetadata, safeSettings);
    console.log('Contenu de couverture généré, premier élément:', coverContent[0]);
    
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, updatedMetadata, safeSettings);
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, updatedMetadata, safeSettings);

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
    const summaryEnabled = enabledFields.find(field => field.id === 'summary')?.enabled;
    if (summaryEnabled) {
      console.log('Récapitulatif activé, ajout de la section');
      content.push({ 
        pageBreak: 'before', 
        margin: margins.recap, 
        stack: recapContent 
      });
    }
    
    console.log('Contenu du document prêt pour génération PDF');
    console.log('Logo URL final avant génération:', updatedMetadata?.company?.logo_url);
    console.log('Structure du premier élément de contenu:', JSON.stringify(content[0]).substring(0, 200) + '...');

    return generatePdfDocument({
      metadata: updatedMetadata,
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
