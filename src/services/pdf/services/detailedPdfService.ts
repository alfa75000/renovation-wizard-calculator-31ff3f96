import { Room, Travail, ProjectMetadata, PrintableField, CompanyData } from '@/types';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { ensureSupportedFont } from '../utils/fontUtils';
import { generatePdfDocument } from './pdfDocumentService';
import { prepareCoverContent } from '../generators/coverGenerator';
import { prepareDetailsContent } from '../generators/detailsGenerator';
import { prepareRecapContent } from '../generators/recapGenerator';
import { PDF_MARGINS } from '../constants/pdfConstants';

export const generateCoverPDF = async (
  enabledFields: PrintableField[],
  companyData: CompanyData | null,
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('[detailedPdfService] Début de la génération du PDF de la page de garde');
    console.log('[detailedPdfService] Champs activés reçus:', enabledFields);
    console.log('[detailedPdfService] Données de l\'entreprise reçues:', companyData);
    console.log('[detailedPdfService] Logo URL dans companyData:', companyData?.logo_url);
    console.log('[detailedPdfService] Paramètres PDF reçus:', pdfSettings);
    console.log('[detailedPdfService] Logo settings dans pdfSettings:', pdfSettings?.logoSettings);
    
    // Vérifier si les paramètres du logo sont définis
    if (pdfSettings?.logoSettings) {
      console.log('[detailedPdfService] useDefaultLogo:', pdfSettings.logoSettings.useDefaultLogo);
      console.log('[detailedPdfService] logoUrl dans pdfSettings:', pdfSettings.logoSettings.logoUrl);
      console.log('[detailedPdfService] width:', pdfSettings.logoSettings.width);
      console.log('[detailedPdfService] height:', pdfSettings.logoSettings.height);
      console.log('[detailedPdfService] alignment:', pdfSettings.logoSettings.alignment);
    }
    
    // Assurons-nous d'utiliser une police supportée
    const safeSettings = pdfSettings ? {
      ...pdfSettings,
      fontFamily: ensureSupportedFont(pdfSettings.fontFamily)
    } : undefined;

    console.log('[detailedPdfService] Police sécurisée:', safeSettings?.fontFamily);
    
    // Préparer les champs pour la page de garde
    const fields = enabledFields
      .filter(field => field.id !== 'companyLogo' && field.id !== 'summary')
      .map(field => ({
        id: field.id,
        content: field.content || ''
      }));

    console.log('[detailedPdfService] Champs préparés pour la page de garde:', fields);
    
    // Vérifier si le logo est activé
    const logoEnabled = enabledFields.find(field => field.id === 'companyLogo')?.enabled || false;
    console.log('[detailedPdfService] Logo est activé:', logoEnabled);
    
    // Vérifier les données du logo dans company et metadata
    console.log('[detailedPdfService] Logo URL dans companyData avant préparation contenu:', companyData?.logo_url);
    
    if (metadata?.company) {
      console.log('[detailedPdfService] Logo URL dans metadata.company:', metadata.company.logo_url);
    } else {
      console.log('[detailedPdfService] Aucune donnée company dans metadata');
    }
    
    // Si metadata n'a pas de company mais que companyData existe, l'ajouter
    if (!metadata?.company && companyData) {
      metadata = {
        ...metadata,
        company: companyData
      };
      console.log('[detailedPdfService] Company data ajouté à metadata');
    }
    
    // Vérifier l'état final de metadata.company
    if (metadata?.company) {
      console.log('[detailedPdfService] Logo URL final dans metadata.company:', metadata.company.logo_url);
    }
    
    // Vérifier si on a besoin d'utiliser le logo par défaut
    let defaultLogoUrlUsed = false;
    if (pdfSettings?.logoSettings?.useDefaultLogo) {
      console.log('[detailedPdfService] Le logo par défaut doit être utilisé selon les paramètres');
      
      // Rechercher un logo par défaut
      const defaultLogoUrl = '/images/lrs-logo.jpg'; // Chemin vers le logo par défaut
      console.log('[detailedPdfService] URL du logo par défaut à utiliser:', defaultLogoUrl);
      
      // Vérifier si le projet contient une référence à ce logo par défaut
      console.log('[detailedPdfService] Tentative d\'utilisation du logo par défaut:', defaultLogoUrl);
      defaultLogoUrlUsed = true;
    }
    
    console.log('[detailedPdfService] Logo par défaut utilisé:', defaultLogoUrlUsed);

    // Générer le contenu de la page de garde
    console.log('[detailedPdfService] Appel de prepareCoverContent avec fields, companyData, metadata et safeSettings');
    const coverContent = prepareCoverContent(fields, companyData, metadata, safeSettings);
    console.log('[detailedPdfService] Contenu de la page de garde généré');
    
    // Vérifier si le contenu contient des images
    const contentJSON = JSON.stringify(coverContent);
    const hasImages = contentJSON.includes('"image":');
    console.log('[detailedPdfService] Le contenu contient-il des images?', hasImages);
    
    // Extraire les URLs d'images si présentes
    if (hasImages) {
      try {
        const imageMatches = contentJSON.match(/"image"\s*:\s*"([^"]+)"/g);
        if (imageMatches) {
          console.log('[detailedPdfService] Images trouvées dans le contenu:', imageMatches);
        }
      } catch (e) {
        console.log('[detailedPdfService] Erreur lors de l\'extraction des images:', e);
      }
    }

    // Définir les marges
    const margins = safeSettings?.margins?.cover || PDF_MARGINS.COVER;
    console.log('[detailedPdfService] Marges utilisées:', margins);

    console.log('[detailedPdfService] Préparation pour générer le document PDF final');
    console.log('[detailedPdfService] Logo URL final avant génération:', metadata?.company?.logo_url);
    
    // Générer le document PDF
    return generatePdfDocument({
      metadata,
      content: [{ margin: margins, stack: coverContent }],
      fontFamily: safeSettings?.fontFamily,
      title: 'Page de garde du devis',
      showHeader: false,
      showFooter: true
    });
    
  } catch (error) {
    console.error('[detailedPdfService] Erreur lors de la génération du PDF de la page de garde:', error);
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
      showHeader: true,
      showFooter: true
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
