
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
      
      // Afficher le pied de page sur toutes les pages
      // Nous ne filtrons plus les pages intermédiaires pour résoudre le problème de pied de page manquant
      
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
  
  try {
    // Générer et ouvrir le PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.open();
    
    console.log('PDF généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
