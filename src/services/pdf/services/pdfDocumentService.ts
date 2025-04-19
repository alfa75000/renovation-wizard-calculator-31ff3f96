
import pdfMake from 'pdfmake/build/pdfmake';
import { ProjectMetadata } from '@/types';
import { configurePdfFonts } from '../utils/fontUtils';

interface GeneratePdfDocumentOptions {
  metadata?: ProjectMetadata;
  content: any[];
  fontFamily?: string;
  title?: string;
}

export const generatePdfDocument = (options: GeneratePdfDocumentOptions) => {
  // Configure fonts
  configurePdfFonts();
  
  const { metadata, content, fontFamily = 'Roboto', title } = options;
  
  // Créer le document PDF
  const docDefinition = {
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
  
  // Générer et ouvrir le PDF
  pdfMake.createPdf(docDefinition).open();
  
  console.log('PDF généré avec succès');
  return true;
};
