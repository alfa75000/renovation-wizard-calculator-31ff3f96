
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
import { getPdfSettings } from '../../config/pdfSettingsManager';
import { 
  ELEMENT_IDS, 
  getElementSettings, 
  getPdfColors 
} from '../../utils/styleUtils';

/**
 * Génère l'en-tête du tableau de détails
 * @returns TableCell[] - Cellules d'en-tête du tableau
 */
export const generateDetailsTableHeader = (): TableCell[] => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const descriptionSettings = getElementSettings(ELEMENT_IDS.DETAILS_DESCRIPTION);
  
  return [
    { 
      text: 'Description', 
      style: 'tableHeader', 
      alignment: 'left', 
      color: colors.mainText,
      fontSize: descriptionSettings.fontSize 
    },
    { 
      text: 'Quantité', 
      style: 'tableHeader', 
      alignment: 'center', 
      color: colors.mainText,
      fontSize: descriptionSettings.fontSize 
    },
    { 
      text: 'Prix HT Unit.', 
      style: 'tableHeader', 
      alignment: 'center', 
      color: colors.mainText,
      fontSize: descriptionSettings.fontSize 
    },
    { 
      text: 'TVA', 
      style: 'tableHeader', 
      alignment: 'center', 
      color: colors.mainText,
      fontSize: descriptionSettings.fontSize 
    },
    { 
      text: 'Total HT', 
      style: 'tableHeader', 
      alignment: 'center', 
      color: colors.mainText,
      fontSize: descriptionSettings.fontSize 
    }
  ];
};

/**
 * Génère le corps du tableau de détails
 * @param room - Pièce concernée
 * @param travaux - Liste des travaux pour cette pièce
 * @returns TableCell[][] - Corps du tableau
 */
export const generateDetailsTableBody = (
  room: Room,
  travaux: Travail[]
): TableCell[][] => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const descriptionSettings = getElementSettings(ELEMENT_IDS.DETAILS_DESCRIPTION);
  const quantitySettings = getElementSettings(ELEMENT_IDS.DETAILS_QUANTITY);
  const priceSettings = getElementSettings(ELEMENT_IDS.DETAILS_PRICE);
  const tvaSettings = getElementSettings(ELEMENT_IDS.DETAILS_TVA);
  const totalSettings = getElementSettings(ELEMENT_IDS.DETAILS_TOTAL);
  const extrasSettings = getElementSettings(ELEMENT_IDS.DETAILS_EXTRAS);
  
  const tableBody: TableCell[][] = [];
  
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
          { 
            text: descriptionLines.join('\n'), 
            fontSize: descriptionSettings.fontSize,
            lineHeight: 1.4
          },
          { 
            text: moFournText, 
            fontSize: extrasSettings.fontSize,
            lineHeight: 1.4,
            color: colors.detailsText
          }
        ]
      },
      { 
        stack: [
          { 
            text: formatQuantity(travail.quantite), 
            alignment: quantitySettings.alignment || 'center', 
            fontSize: quantitySettings.fontSize
          },
          { 
            text: travail.unite, 
            alignment: quantitySettings.alignment || 'center', 
            fontSize: quantitySettings.fontSize
          }
        ],
        alignment: 'center'
      },
      { 
        text: formatPrice(prixUnitaireHT), 
        alignment: priceSettings.alignment || 'center',
        fontSize: priceSettings.fontSize
      },
      { 
        text: `${travail.tauxTVA}%`, 
        alignment: tvaSettings.alignment || 'center',
        fontSize: tvaSettings.fontSize
      },
      { 
        text: formatPrice(totalHT), 
        alignment: totalSettings.alignment || 'center',
        fontSize: totalSettings.fontSize
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

/**
 * Génère la ligne de total pour une pièce
 * @param room - Pièce concernée
 * @param travaux - Liste des travaux pour cette pièce
 * @returns TableCell[] - Ligne de total
 */
export const generateRoomTotalRow = (room: Room, travaux: Travail[]): TableCell[] => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const roomTotalSettings = getElementSettings(ELEMENT_IDS.DETAILS_ROOM_TOTAL);
  
  const pieceTotalHT = travaux.reduce((sum, t) => {
    return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
  }, 0);
  
  return [
    { 
      text: `Total HT ${room.name}`, 
      colSpan: 4, 
      alignment: 'left', 
      fontSize: roomTotalSettings.fontSize, 
      bold: roomTotalSettings.isBold, 
      fillColor: colors.background 
    },
    {}, {}, {},
    { 
      text: formatPrice(pieceTotalHT), 
      alignment: roomTotalSettings.alignment || 'center', 
      fontSize: roomTotalSettings.fontSize, 
      bold: roomTotalSettings.isBold, 
      fillColor: colors.background 
    }
  ];
};
