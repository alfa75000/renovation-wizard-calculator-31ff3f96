
import { Room, Travail, ProjectMetadata } from '@/types';
import { Content } from 'pdfmake/interfaces';
import { generateRecapTableBody } from './tables/recapTableGenerator';
import { generateStandardTotalsTable, generateTTCTable } from './tables/totalsTableGenerator';
import { getPdfSettings } from '../config/pdfSettingsManager';
import { generateSignatureContent, generateSalutationContent } from './contentGenerator';
import { 
  ELEMENT_IDS, 
  convertToPdfStyle, 
  getPdfColors 
} from '../utils/styleUtils';

/**
 * Génère le contenu pour la page récapitulative
 * @param rooms - Liste des pièces
 * @param travaux - Liste des travaux
 * @param getTravauxForPiece - Fonction pour récupérer les travaux d'une pièce
 * @param metadata - Métadonnées du projet
 * @returns Content[] - Contenu formaté pour la page récapitulative
 */
export const generateRecapContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
): Content[] => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const content: Content[] = [];
  
  // Titre
  content.push({
    text: 'RÉCAPITULATIF',
    style: 'header',
    alignment: 'center',
    ...(convertToPdfStyle(ELEMENT_IDS.RECAP_TITLE, settings) as object),
    color: colors.mainText,
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
