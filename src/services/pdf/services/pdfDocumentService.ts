
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
    docDefinition.footer = function() {
      const company = metadata.company;
      
      if (!company) {
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
  pdfMake.createPdf(docDefinition).open();
  
  console.log('PDF généré avec succès');
  return true;
};
