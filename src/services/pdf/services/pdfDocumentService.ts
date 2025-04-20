
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
  
  console.log('[pdfDocumentService] Génération du document PDF avec les options suivantes:');
  console.log('[pdfDocumentService] - Metadata présent:', !!metadata);
  console.log('[pdfDocumentService] - Company dans metadata:', !!metadata?.company);
  console.log('[pdfDocumentService] - Logo URL dans metadata:', metadata?.company?.logo_url);
  console.log('[pdfDocumentService] - Nombre d\'éléments de contenu:', content.length);
  console.log('[pdfDocumentService] - Police:', fontFamily);
  console.log('[pdfDocumentService] - Afficher entête:', showHeader);
  console.log('[pdfDocumentService] - Afficher pied de page:', showFooter);
  
  // Vérification des images dans le contenu
  try {
    const contentStr = JSON.stringify(content);
    const hasImages = contentStr.includes('"image":');
    console.log('[pdfDocumentService] Le contenu contient des images:', hasImages);
    
    // Si le contenu contient des images, essayer de trouver toutes les URLs d'images
    if (hasImages) {
      const imageMatches = contentStr.match(/"image"\s*:\s*"([^"]+)"/g);
      if (imageMatches) {
        console.log('[pdfDocumentService] Nombre d\'images trouvées:', imageMatches.length);
        // Pour chaque match, extraire l'URL (sans afficher le contenu complet des data URLs)
        imageMatches.forEach((match, idx) => {
          const urlStart = match.substring(0, 40);
          console.log(`[pdfDocumentService] Image ${idx+1}: ${urlStart}... (truncated)`);
        });
      }
    }
    
    // Recherche de logos dans le contenu
    let logoFound = false;
    if (metadata?.company?.logo_url && contentStr.includes(metadata.company.logo_url)) {
      console.log('[pdfDocumentService] Logo URL de company trouvé dans le contenu JSON');
      logoFound = true;
    }
    
    // Rechercher les références au logo par défaut
    if (contentStr.includes('/images/lrs-logo.jpg')) {
      console.log('[pdfDocumentService] Référence au logo par défaut trouvée dans le contenu');
      logoFound = true;
    }
    
    // Vérifier également les data URLs (logos uploadés)
    if (contentStr.includes('"image":"data:image/')) {
      console.log('[pdfDocumentService] Data URL d\'image trouvée dans le contenu (probablement un logo uploadé)');
      logoFound = true;
    }
    
    console.log('[pdfDocumentService] Logo trouvé dans le contenu:', logoFound);
  } catch (e) {
    console.log('[pdfDocumentService] Erreur lors de la vérification des images dans le contenu:', e);
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
    console.log('[pdfDocumentService] Configuration de l\'entête pour toutes les pages sauf la première');
    docDefinition.header = function(currentPage: number, pageCount: number) {
      // Ne pas afficher l'entête sur la page de garde (page 1)
      if (currentPage === 1) {
        console.log(`[pdfDocumentService] Entête ignoré pour la page 1`);
        return null;
      }

      console.log(`[pdfDocumentService] Génération de l'entête pour la page ${currentPage}/${pageCount}`);
      return {
        text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${pageCount}`,
        alignment: 'right',
        fontSize: 8,
        color: DARK_BLUE,
        margin: [40, 20, 40, 10]
      };
    };
  } else {
    console.log('[pdfDocumentService] Aucun entête configuré (showHeader = false)');
  }

  // Ajouter le pied de page si nécessaire
  if (showFooter && metadata?.company) {
    console.log('[pdfDocumentService] Configuration du pied de page avec les informations de l\'entreprise');
    docDefinition.footer = function(currentPage: number) {
      console.log(`[pdfDocumentService] Génération du pied de page pour la page ${currentPage}`);
      
      const company = metadata.company;
      
      if (!company) {
        console.log('[pdfDocumentService] Aucune donnée d\'entreprise disponible pour le pied de page');
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
      
      console.log('[pdfDocumentService] Données entreprise pour le pied de page:', { 
        companyName, capitalSocial, address, postalCode, city, siret 
      });
      
      return {
        text: `${companyName} - SASU au Capital de ${capitalSocial} € - ${address} ${postalCode} ${city} - Siret : ${siret} - Code APE : ${codeApe} - N° TVA Intracommunautaire : ${tvaIntracom}`,
        fontSize: 7,
        color: DARK_BLUE,
        alignment: 'center',
        margin: [40, 0, 40, 20]
      };
    };
  } else {
    console.log('[pdfDocumentService] Aucun pied de page configuré (showFooter = false ou pas de company)');
  }
  
  // Générer et ouvrir le PDF
  console.log('[pdfDocumentService] Création du PDF via pdfMake...');
  
  try {
    pdfMake.createPdf(docDefinition).open();
    console.log('[pdfDocumentService] PDF généré avec succès');
    return true;
  } catch (error) {
    console.error('[pdfDocumentService] Erreur lors de la génération du PDF:', error);
    // Si l'erreur concerne les images, donnons plus de détails
    if (error.toString().includes('image') || error.toString().includes('logo')) {
      console.error('[pdfDocumentService] Détails des images/logo pour diagnostic:');
      console.error('[pdfDocumentService] - Logo URL:', metadata?.company?.logo_url);
      console.error('[pdfDocumentService] - Format attendu pour les images:', 'Data URL (base64) ou URL accessible');
    }
    throw error;
  }
};
