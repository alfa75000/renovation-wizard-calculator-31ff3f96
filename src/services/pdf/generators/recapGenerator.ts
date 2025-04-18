
import { Room, Travail, ProjectMetadata } from '@/types';
import { Content } from 'pdfmake/interfaces';
import { 
  generateRecapTableBody,
  generateStandardTotalsTable,
  generateTTCTable 
} from './tables/totalsTableGenerator';
import { getPdfSettings } from '../config/pdfSettingsManager';
import { generateSignatureContent, generateSalutationContent } from './contentGenerator';

export const generateRecapContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
): Content[] => {
  const settings = getPdfSettings();
  const content: Content[] = [];
  
  // Titre
  content.push({
    text: 'RÉCAPITULATIF',
    style: 'header',
    alignment: 'center',
    fontSize: settings?.fontSize?.header || 12,
    bold: true,
    color: settings?.colors?.mainText || '#1a1f2c',
    margin: [0, 10, 0, 20]
  });
  
  // Tableau récapitulatif
  const { body, totalHT, totalTVA } = generateRecapTableBody(rooms, getTravauxForPiece);
  const totalTTC = totalHT + totalTVA;
  
  // Structure de la page récapitulative
  content.push({
    columns: [
      {
        width: '70%',
        stack: [
          ...generateSignatureContent(),
          // Lignes vides pour la signature
          ...Array(10).fill({ text: "", margin: [0, 5, 0, 0] })
        ]
      },
      {
        width: '30%',
        stack: [
          generateStandardTotalsTable(totalHT, totalTVA),
          generateTTCTable(totalTTC)
        ]
      }
    ],
    margin: [0, 0, 0, 20]
  });

  // Texte de salutation
  content.push(generateSalutationContent());

  return content;
};
