
import pdfMake from 'pdfmake/build/pdfmake';
import { ProjectMetadata } from '@/types';
import { configurePdfFonts } from '../utils/fontUtils';
import { DARK_BLUE } from '../constants/pdfConstants';

interface GeneratePdfDocumentOptions {
  metadata?: ProjectMetadata;
  content: any[];
  fontFamily?: string;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const generatePdfDocument = (options: GeneratePdfDocumentOptions) => {
  console.log('[LOGO DEBUG] === DÉBUT GÉNÉRATION DOCUMENT PDF ===');
  // Configure fonts
  configurePdfFonts();
  
  const { 
    metadata, 
    content, 
    fontFamily = 'Roboto', 
    title, 
    showHeader = true, 
    showFooter = true 
  } = options;
  
  console.log('[LOGO DEBUG] Génération du document PDF avec les options suivantes:');
  console.log('[LOGO DEBUG] - Metadata présent:', !!metadata);
  console.log('[LOGO DEBUG] - Company dans metadata:', !!metadata?.company);
  console.log('[LOGO DEBUG] - Logo URL dans metadata:', metadata?.company?.logo_url);
  console.log('[LOGO DEBUG] - Nombre d\'éléments de contenu:', content.length);
  console.log('[LOGO DEBUG] - Police:', fontFamily);
  console.log('[LOGO DEBUG] - Afficher entête:', showHeader);
  console.log('[LOGO DEBUG] - Afficher pied de page:', showFooter);
  
  // Vérification des images dans le contenu
  try {
    const contentString = JSON.stringify(content);
    const hasImages = contentString.includes('"image":');
    console.log('[LOGO DEBUG] Le contenu contient des images:', hasImages);
    
    if (hasImages) {
      console.log('[LOGO DEBUG] Analyse du contenu pour trouver des images:');
      // Explorer le contenu pour trouver les images
      const findImagesInContent = (obj: any, path = '') => {
        if (!obj) return;
        
        if (typeof obj === 'object') {
          if (obj.image) {
            console.log(`[LOGO DEBUG] Image trouvée à ${path}:`, obj.image);
            console.log(`[LOGO DEBUG] Dimensions:`, { width: obj.width, height: obj.height });
          }
          
          // Si c'est un tableau, vérifier chaque élément
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              findImagesInContent(item, `${path}[${index}]`);
            });
          } else {
            // Si c'est un objet, vérifier chaque propriété
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                findImagesInContent(obj[key], path ? `${path}.${key}` : key);
              }
            }
          }
        }
      };
      
      content.forEach((item, index) => {
        findImagesInContent(item, `content[${index}]`);
      });
    }
    
    // Recherche de logos dans le contenu
    let logoFound = false;
    if (metadata?.company?.logo_url && contentString.includes(metadata.company.logo_url)) {
      console.log('[LOGO DEBUG] Logo URL de company trouvé dans le contenu JSON');
      logoFound = true;
    }
    
    // Recherche du logo par défaut
    if (contentString.includes('/images/lrs-logo.jpg')) {
      console.log('[LOGO DEBUG] Logo par défaut trouvé dans le contenu JSON');
      logoFound = true;
    }
    
    console.log('[LOGO DEBUG] Logo trouvé dans le contenu:', logoFound);
  } catch (e) {
    console.log('[LOGO DEBUG] Erreur lors de la vérification des images dans le contenu:', e);
  }
  
  // Créer le document PDF
  const docDefinition: any = {
    info: {
      title: title || `Devis - ${metadata?.nomProjet || 'Projet'}`,
      author: metadata?.company?.name || 'LRS Rénovation',
      subject: 'Devis de travaux',
      keywords: 'devis, travaux, rénovation'
    },
    defaultStyle: {
      font: fontFamily
    },
    content
  };

  // Ajouter l'entête si nécessaire
  if (showHeader) {
    console.log('[LOGO DEBUG] Configuration de l\'entête du document');
    docDefinition.header = function(currentPage: number, pageCount: number) {
      // Ne pas afficher l'entête sur la page de garde (page 1)
      if (currentPage === 1) return null;

      console.log(`[LOGO DEBUG] Génération de l'entête pour la page ${currentPage}/${pageCount}`);
      return {
        text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${pageCount}`,
        alignment: 'right',
        fontSize: 8,
        color: DARK_BLUE,
        margin: [40, 20, 40, 10]
      };
    };
  }

  // Ajouter le pied de page si nécessaire
  if (showFooter && metadata?.company) {
    console.log('[LOGO DEBUG] Configuration du pied de page du document');
    docDefinition.footer = function(currentPage: number) {
      console.log(`[LOGO DEBUG] Génération du pied de page pour la page ${currentPage}`);
      
      const company = metadata.company;
      
      if (!company) {
        console.log('[LOGO DEBUG] Aucune donnée d\'entreprise disponible pour le pied de page');
        return null;
      }
      
      const companyName = company.name || '';
      const capitalSocial = company.capital_social || '10000';
      const address = company.address || '';
      const postalCode = company.postal_code || '';
      const city = company.city || '';
      const siret = company.siret || '';
      const codeApe = company.code_ape || '';
      const tvaIntracom = company.tva_intracom || '';
      
      return {
        text: `${companyName} - SASU au Capital de ${capitalSocial} € - ${address} ${postalCode} ${city} - Siret : ${siret} - Code APE : ${codeApe} - N° TVA Intracommunautaire : ${tvaIntracom}`,
        fontSize: 7,
        color: DARK_BLUE,
        alignment: 'center',
        margin: [40, 0, 40, 20]
      };
    };
  }
  
  // Générer et ouvrir le PDF
  console.log('[LOGO DEBUG] Création du PDF via pdfMake...');
  
  try {
    pdfMake.createPdf(docDefinition).open();
    console.log('[LOGO DEBUG] PDF généré avec succès');
    console.log('[LOGO DEBUG] === FIN GÉNÉRATION DOCUMENT PDF ===');
    return true;
  } catch (error) {
    console.error('[LOGO DEBUG] Erreur lors de la génération du PDF:', error);
    // Si l'erreur concerne les images, donnons plus de détails
    if (error.toString().includes('image') || error.toString().includes('logo')) {
      console.error('[LOGO DEBUG] Détails des images/logo pour diagnostic:');
      console.error('[LOGO DEBUG] - Logo URL:', metadata?.company?.logo_url);
      console.error('[LOGO DEBUG] - Format attendu pour les images:', 'Data URL (base64) ou URL accessible');
    }
    console.log('[LOGO DEBUG] === FIN GÉNÉRATION DOCUMENT PDF (AVEC ERREUR) ===');
    throw error;
  }
};
