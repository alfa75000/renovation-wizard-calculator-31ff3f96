
import { Room, Travail } from '@/types';
import { 
  TableCell, 
  Table
} from 'pdfmake/interfaces';
import { 
  TABLE_COLUMN_WIDTHS,
  formatPrice,
  formatQuantity
} from '../../pdfConstants';
import { formatMOFournitures } from '../../formatters';

export const generateDetailsTableHeader = (): TableCell[] => {
  return [
    { text: 'Description', style: 'tableHeader', alignment: 'left', color: '#1a1f2c' },
    { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: '#1a1f2c' },
    { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: '#1a1f2c' },
    { text: 'TVA', style: 'tableHeader', alignment: 'center', color: '#1a1f2c' },
    { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: '#1a1f2c' }
  ];
};

export const generateDetailsTableBody = (
  room: Room,
  travaux: Travail[]
): any[] => {
  const tableBody = [];
  
  travaux.forEach((travail, index) => {
    const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
    const totalHT = prixUnitaireHT * travail.quantite;
    
    // Construire le contenu de la description
    const descriptionLines = [
      `${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`,
      travail.description,
      travail.personnalisation
    ].filter(Boolean);
    
    const moFournText = formatMOFournitures(travail);
    
    // Ajouter la ligne au tableau
    tableBody.push([
      { 
        stack: [
          { text: descriptionLines.join('\n'), fontSize: 9, lineHeight: 1.4 },
          { text: moFournText, fontSize: 7, lineHeight: 1.4 }
        ]
      },
      { 
        stack: [
          { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: 9 },
          { text: travail.unite, alignment: 'center', fontSize: 9 }
        ],
        alignment: 'center'
      },
      { 
        text: formatPrice(prixUnitaireHT), 
        alignment: 'center',
        fontSize: 9
      },
      { 
        text: `${travail.tauxTVA}%`, 
        alignment: 'center',
        fontSize: 9
      },
      { 
        text: formatPrice(totalHT), 
        alignment: 'center',
        fontSize: 9
      }
    ]);
    
    // Ajouter une ligne d'espacement entre les prestations
    if (index < travaux.length - 1) {
      tableBody.push([
        { text: '', margin: [0, 2, 0, 2] },
        {}, {}, {}, {}
      ]);
    }
  });

  return tableBody;
};

export const generateRoomTotalRow = (room: Room, travaux: Travail[]): TableCell[] => {
  const pieceTotalHT = travaux.reduce((sum, t) => {
    return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
  }, 0);
  
  return [
    { 
      text: `Total HT ${room.name}`, 
      colSpan: 4, 
      alignment: 'left', 
      fontSize: 9, 
      bold: true, 
      fillColor: '#f9fafb' 
    },
    {}, {}, {},
    { 
      text: formatPrice(pieceTotalHT), 
      alignment: 'center', 
      fontSize: 9, 
      bold: true, 
      fillColor: '#f9fafb' 
    }
  ];
};
