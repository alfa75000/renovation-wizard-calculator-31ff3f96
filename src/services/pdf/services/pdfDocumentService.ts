
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
  
  console.log('### PDF DOCUMENT SERVICE - DÉBUT DE GÉNÉRATION ###');
  console.log('Génération du document PDF avec les options suivantes:');
  console.log('- Metadata présent:', !!metadata);
  console.log('- Company dans metadata:', !!metadata?.company);
  console.log('- Logo URL dans metadata:', metadata?.company?.logo_url);
  console.log('- Nombre d\'éléments de contenu:', content.length);
  console.log('- Police:', fontFamily);
  console.log('- Afficher entête:', showHeader);
  console.log('- Afficher pied de page:', showFooter);
  
  // Vérification des images dans le contenu
  try {
    const contentString = JSON.stringify(content);
    const hasImages = contentString.includes('"image":');
    console.log('Le contenu contient des images:', hasImages);
    
    if (hasImages) {
      // Chercher toutes les URLs d'images dans le contenu
      const regex = /"image"\s*:\s*"([^"]+)"/g;
      const matches = [...contentString.matchAll(regex)];
      console.log(`Nombre d'images trouvées dans le contenu: ${matches.length}`);
      
      if (matches.length > 0) {
        matches.forEach((match, index) => {
          const imageUrl = match[1];
          const shortUrl = imageUrl.length > 50 ? 
            imageUrl.substring(0, 25) + '...' + imageUrl.substring(imageUrl.length - 25) : 
            imageUrl;
          console.log(`Image ${index + 1}: ${shortUrl}`);
        });
      }
    }
    
    // Recherche de logos dans le contenu
    let logoFound = false;
    
    if (metadata?.company?.logo_url) {
      const logoUrl = metadata.company.logo_url;
      const logoInContent = contentString.includes(logoUrl);
      console.log('Logo URL:', logoUrl.substring(0, 30) + '...');
      console.log('Logo URL trouvé dans le contenu JSON:', logoInContent);
      
      if (logoInContent) {
        logoFound = true;
        
        // Compter combien de fois le logo apparaît
        const logoCount = (contentString.match(new RegExp(logoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        console.log(`Le logo apparaît ${logoCount} fois dans le contenu`);
      } else {
        console.log('Logo URL présent dans metadata mais PAS trouvé dans le contenu');
      }
    } else {
      console.log('Aucun logo_url dans metadata.company');
    }
    
    console.log('Logo trouvé dans le contenu:', logoFound);
  } catch (e) {
    console.log('Erreur lors de la vérification des images dans le contenu:', e);
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
    docDefinition.header = function(currentPage: number, pageCount: number) {
      // Ne pas afficher l'entête sur la page de garde (page 1)
      if (currentPage === 1) return null;

      console.log(`Génération de l'entête pour la page ${currentPage}/${pageCount}`);
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
    docDefinition.footer = function(currentPage: number) {
      console.log(`Génération du pied de page pour la page ${currentPage}`);
      
      const company = metadata.company;
      
      if (!company) {
        console.log('Aucune donnée d\'entreprise disponible pour le pied de page');
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
  console.log('Création du PDF via pdfMake...');
  
  try {
    pdfMake.createPdf(docDefinition).open();
    console.log('PDF généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    // Si l'erreur concerne les images, donnons plus de détails
    if (error.toString().includes('image') || error.toString().includes('logo')) {
      console.error('Détails des images/logo pour diagnostic:');
      console.error('- Logo URL:', metadata?.company?.logo_url ? 
        metadata.company.logo_url.substring(0, 30) + '...' : 'null');
      console.error('- Format attendu pour les images:', 'Data URL (base64) ou URL accessible');
    }
    throw error;
  }
};
