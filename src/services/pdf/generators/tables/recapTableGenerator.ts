
import { Room, Travail } from '@/types';
import { TableCell } from 'pdfmake/interfaces';
import { formatPrice } from '../../pdfConstants';

export const generateRecapTableHeader = (): TableCell[] => {
  return [
    { text: '', style: 'tableHeader', alignment: 'left', color: '#1a1f2c', fontSize: 8 },
    { text: 'Montant HT', style: 'tableHeader', alignment: 'right', color: '#1a1f2c', fontSize: 8 }
  ];
};

export const generateRecapTableBody = (
  rooms: Room[],
  getTravauxForPiece: (pieceId: string) => Travail[]
): { body: TableCell[][], totalHT: number, totalTVA: number } => {
  const body: TableCell[][] = [generateRecapTableHeader()];
  let totalHT = 0;
  let totalTVA = 0;
  
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
      { text: `Total ${room.name}`, alignment: 'left', fontSize: 8, bold: true },
      { text: formatPrice(roomTotalHT), alignment: 'right', fontSize: 8, color: '#1a1f2c' }
    ]);
  });
  
  return { body, totalHT, totalTVA };
};
