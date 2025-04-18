
import { Room, Travail, ProjectMetadata } from '@/types';
import { Content } from 'pdfmake/interfaces';
import { 
  generateDetailsTableHeader,
  generateDetailsTableBody,
  generateRoomTotalRow 
} from './tables/detailsTableGenerator';
import { TABLE_COLUMN_WIDTHS } from '../pdfConstants';
import { getPdfSettings } from '../config/pdfSettingsManager';

export const generateDetailsContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
): Content[] => {
  const settings = getPdfSettings();
  const content: Content[] = [];
  
  // Filtrer les pièces avec des travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  roomsWithTravaux.forEach(room => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Titre de la pièce
    content.push({
      text: room.name,
      style: 'roomTitle',
      fontSize: settings?.fontSize?.roomTitle || 9,
      bold: true,
      color: settings?.colors?.mainText || '#1a1f2c',
      fillColor: settings?.colors?.background || '#f3f4f6',
      margin: [0, 10, 0, 5]
    });
    
    // Table des travaux
    const tableBody = generateDetailsTableBody(room, travauxPiece);
    tableBody.push(generateRoomTotalRow(room, travauxPiece));
    
    content.push({
      table: {
        headerRows: 0,
        widths: TABLE_COLUMN_WIDTHS.DETAILS,
        body: tableBody
      },
      layout: {
        hLineWidth: (i, node) => {
          if (i === 0 || i === node.table.body.length) return 1;
          const isEndOfPrestation = i < node.table.body.length && 
            ((node.table.body[i][0]?.text?.includes('Total HT')) ||
            (i > 0 && node.table.body[i-1][0]?.text?.includes('Total HT')));
          return isEndOfPrestation ? 1 : 0;
        },
        vLineWidth: () => 0,
        hLineColor: () => settings?.colors?.detailsLines || '#e5e7eb',
        paddingLeft: () => 4,
        paddingRight: () => 4,
        paddingTop: () => 2,
        paddingBottom: () => 2
      },
      margin: [0, 0, 0, 15]
    });
  });

  return content;
};
