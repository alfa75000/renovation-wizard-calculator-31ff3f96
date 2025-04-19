
import pdfMake from 'pdfmake/build/pdfmake';
import { ProjectMetadata } from '@/types';
import { configurePdfFonts } from '../utils/fontUtils';
import { formatDate } from '../utils/dateUtils';
import { DARK_BLUE } from '../constants/pdfConstants';

interface GeneratePdfDocumentOptions {
  metadata?: ProjectMetadata;
  content: any[];
  fontFamily?: string;
  title?: string;
  logoSettings?: any;
  useHeader?: boolean;
  useFooter?: boolean;
}

export const generatePdfDocument = (options: GeneratePdfDocumentOptions) => {
  // Configure fonts
  configurePdfFonts();
  
  const { 
    metadata, 
    content, 
    fontFamily = 'Roboto', 
    title, 
    logoSettings,
    useHeader = false,
    useFooter = false
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

  // Ajouter l'entête si demandé
  if (useHeader) {
    docDefinition.header = function(currentPage: number, pageCount: number) {
      if (currentPage === 1) return []; // Pas d'entête sur la première page
      
      return [
        {
          text: `DEVIS N° ${metadata?.devisNumber || 'xxxx-xx'} - page ${currentPage}/${pageCount}`,
          alignment: 'right',
          margin: [40, 20, 40, 0],
          fontSize: 8,
          color: DARK_BLUE
        }
      ];
    };
  }

  // Ajouter le pied de page si demandé
  if (useFooter) {
    docDefinition.footer = function(currentPage: number, pageCount: number) {
      const company = metadata?.company;
      if (!company) return [];
      
      // Afficher le pied de page sur la première page et la dernière page
      // Pour les pages intermédiaires (à partir de la page 2 et jusqu'à l'avant-dernière), on n'affiche pas le pied de page
      if (currentPage > 1 && currentPage < pageCount) return [];
      
      const footerContent = [
        {
          text: [
            `${company.name || ''} - ${company.address || ''} - ${company.postal_code || ''} ${company.city || ''}\n`,
            `SIRET: ${company.siret || ''} - APE: ${company.code_ape || ''} - TVA: ${company.tva_intracom || ''}`
          ],
          fontSize: 8,
          alignment: 'center',
          color: DARK_BLUE,
          margin: [40, 0, 40, 20]
        }
      ];
      
      return footerContent;
    };
  }
  
  // Générer et ouvrir le PDF
  pdfMake.createPdf(docDefinition).open();
  
  console.log('PDF généré avec succès');
  return true;
};
