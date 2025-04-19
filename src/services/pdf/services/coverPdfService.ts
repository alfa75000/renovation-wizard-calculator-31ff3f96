
import { CompanyData, PrintableField, ProjectMetadata } from '@/types';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { ensureSupportedFont } from '../utils/fontUtils';
import { generatePdfDocument } from './pdfDocumentService';
import { prepareCoverContent } from '../generators/coverGenerator';
import { PDF_MARGINS } from '../constants/pdfConstants';

/**
 * Génère un PDF contenant uniquement la page de garde
 */
export const generateCoverPagePDF = async (
  enabledFields: PrintableField[],
  companyData: CompanyData | null,
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log("### COVER PDF SERVICE - DÉBUT DE GÉNÉRATION ###");
    console.log("PDF Settings reçus:", pdfSettings);
    console.log("Company data reçu:", companyData);
    console.log("Logo dans companyData:", companyData?.logo_url);
    console.log("Paramètres du logo dans pdfSettings:", pdfSettings?.logoSettings);
    
    // Assurons-nous d'utiliser une police supportée
    const safeSettings = pdfSettings ? {
      ...pdfSettings,
      fontFamily: ensureSupportedFont(pdfSettings.fontFamily)
    } : undefined;
    
    console.log("SafeSettings appliqués:", safeSettings);
    
    // Préparer les champs pour la page de garde
    const fields = enabledFields
      .filter(field => field.id !== 'companyLogo' && field.id !== 'summary')
      .map(field => ({
        id: field.id,
        content: field.content || ''
      }));

    console.log("Fields préparés pour la page de garde:", fields);
    
    // Si logo est activé, assurons-nous qu'il est bien passé
    const logoEnabled = enabledFields.find(field => field.id === 'companyLogo')?.enabled || false;
    console.log("Logo est activé:", logoEnabled);
    console.log("Logo content:", enabledFields.find(field => field.id === 'companyLogo')?.content);
    
    // Si un logo_url est fourni dans le champ content, utilisons-le au lieu de celui dans companyData
    const logoContent = enabledFields.find(field => field.id === 'companyLogo')?.content;
    if (logoContent && typeof logoContent === 'string' && logoContent.trim() !== '') {
      console.log("Logo trouvé dans le contenu du champ:", logoContent);
      
      // Si companyData existe, mettons à jour le logo_url
      if (companyData) {
        companyData = {
          ...companyData,
          logo_url: logoContent
        };
        console.log("Logo URL mis à jour dans companyData:", companyData.logo_url);
      }
    }
    
    // Si pdfSettings a un logoUrl et que useDefaultLogo est true, utilisons-le
    if (safeSettings?.logoSettings?.useDefaultLogo && safeSettings?.logoSettings?.logoUrl) {
      console.log("Utilisation du logo par défaut des paramètres:", safeSettings.logoSettings.logoUrl);
      
      // Si companyData existe, mettons à jour le logo_url
      if (companyData) {
        companyData = {
          ...companyData,
          logo_url: safeSettings.logoSettings.logoUrl
        };
        console.log("Logo URL mis à jour dans companyData avec le logo par défaut:", companyData.logo_url);
      }
    }
    
    // Assurons-nous que company est inclus dans metadata
    if (!metadata?.company && companyData) {
      metadata = {
        ...metadata,
        company: companyData
      };
      console.log("Company data ajouté à metadata");
    }
    
    // Si metadata a déjà company, assurons-nous que le logo_url est présent
    if (metadata?.company && companyData?.logo_url) {
      console.log("Avant update: metadata.company.logo_url =", metadata.company.logo_url);
      
      // Mettre à jour le logo dans metadata si nécessaire
      if ((!metadata.company.logo_url || metadata.company.logo_url === '') && companyData.logo_url) {
        metadata = {
          ...metadata,
          company: {
            ...metadata.company,
            logo_url: companyData.logo_url
          }
        };
        console.log("Logo URL mis à jour dans metadata:", metadata.company.logo_url);
      }
    }

    // Générer le contenu de la page de garde
    console.log("Début génération du contenu de couverture avec logo");
    console.log("Données company envoyées à coverGenerator:", companyData);
    console.log("Logo URL dans company avant génération:", companyData?.logo_url);
    
    const coverContent = prepareCoverContent(fields, companyData, metadata, safeSettings);
    console.log("Contenu de couverture généré, premier élément:", coverContent[0]);
    
    // Définir les marges
    const margins = safeSettings?.margins?.cover || PDF_MARGINS.COVER;

    // Construire le contenu du document
    const content = [
      { margin: margins, stack: coverContent }
    ];
    
    console.log("Contenu du document prêt pour génération PDF");
    console.log("Logo URL final avant génération:", metadata?.company?.logo_url);

    return generatePdfDocument({
      metadata,
      content,
      fontFamily: safeSettings?.fontFamily,
      showHeader: false, // Pas d'entête sur la page de garde
      showFooter: true
    });
    
  } catch (error) {
    console.error("Erreur lors de la génération du PDF de la page de garde:", error);
    throw error;
  }
};
