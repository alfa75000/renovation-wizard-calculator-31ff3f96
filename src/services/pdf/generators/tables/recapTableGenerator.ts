
import { Room, Travail } from '@/types';
import { TableCell } from 'pdfmake/interfaces';
import { formatPrice } from '../../pdfConstants';
import { 
  ELEMENT_IDS, 
  getElementSettings, 
  getPdfColors 
} from '../../utils/styleUtils';
import { getPdfSettings } from '../../config/pdfSettingsManager';

/**
 * Génère l'en-tête du tableau récapitulatif
 * @returns TableCell[] - Cellules d'en-tête du tableau
 */
export const generateRecapTableHeader = (): TableCell[] => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const roomLabelSettings = getElementSettings(ELEMENT_IDS.RECAP_ROOM_LABEL);
  
  return [
    { 
      text: '', 
      style: 'tableHeader', 
      alignment: roomLabelSettings.alignment, 
      color: colors.mainText, 
      fontSize: roomLabelSettings.fontSize 
    },
    { 
      text: 'Montant HT', 
      style: 'tableHeader', 
      alignment: 'right', 
      color: colors.mainText, 
      fontSize: roomLabelSettings.fontSize 
    }
  ];
};

/**
 * Génère le corps du tableau récapitulatif
 * @param rooms - Liste des pièces
 * @param getTravauxForPiece - Fonction pour récupérer les travaux d'une pièce
 * @returns Object - Corps du tableau, total HT et total TVA
 */
export const generateRecapTableBody = (
  rooms: Room[],
  getTravauxForPiece: (pieceId: string) => Travail[]
): { body: TableCell[][], totalHT: number, totalTVA: number } => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const body: TableCell[][] = [generateRecapTableHeader()];
  let totalHT = 0;
  let totalTVA = 0;
  
  const roomLabelSettings = getElementSettings(ELEMENT_IDS.RECAP_ROOM_LABEL);
  const roomTotalSettings = getElementSettings(ELEMENT_IDS.RECAP_ROOM_TOTAL);
  
  rooms.forEach(room => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    const roomTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    const roomTVA = travauxPiece.reduce((sum, t) => {
      const totalHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
      return sum + (totalHT * t.tauxTVA / 100);
    }, 0);
    
    totalHT += roomTotalHT;
    totalTVA += roomTVA;
    
    body.push([
      { 
        text: `Total ${room.name}`, 
        alignment: roomLabelSettings.alignment, 
        fontSize: roomLabelSettings.fontSize, 
        bold: roomLabelSettings.isBold, 
        fillColor: colors.background 
      },
      { 
        text: formatPrice(roomTotalHT), 
        alignment: roomTotalSettings.alignment || 'right', 
        fontSize: roomTotalSettings.fontSize, 
        color: colors.mainText, 
        bold: roomTotalSettings.isBold, 
        fillColor: colors.background 
      }
    ]);
  });
  
  return { body, totalHT, totalTVA };
};
