
import { TableCell } from 'pdfmake/interfaces';
import { TABLE_COLUMN_WIDTHS, formatPrice } from '../../pdfConstants';
import { getPdfSettings } from '../../config/pdfSettingsManager';
import { 
  ELEMENT_IDS, 
  getElementSettings, 
  getPdfColors 
} from '../../utils/styleUtils';

/**
 * Génère un tableau standard pour les totaux (HT et TVA)
 * @param totalHT - Total HT
 * @param totalTVA - Total TVA
 * @returns Object - Définition du tableau pour pdfmake
 */
export const generateStandardTotalsTable = (totalHT: number, totalTVA: number) => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const totalHTSettings = getElementSettings(ELEMENT_IDS.RECAP_TOTAL_HT);
  const totalTVASettings = getElementSettings(ELEMENT_IDS.RECAP_TOTAL_TVA);
  
  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { 
            text: 'Total HT', 
            alignment: 'left', 
            fontSize: totalHTSettings.fontSize, 
            bold: totalHTSettings.isBold 
          },
          { 
            text: formatPrice(totalHT), 
            alignment: 'right', 
            fontSize: totalHTSettings.fontSize, 
            color: colors.mainText 
          }
        ],
        [
          { 
            text: 'Total TVA', 
            alignment: 'left', 
            fontSize: totalTVASettings.fontSize, 
            bold: totalTVASettings.isBold 
          },
          { 
            text: formatPrice(totalTVA), 
            alignment: 'right', 
            fontSize: totalTVASettings.fontSize, 
            color: colors.mainText 
          }
        ]
      ]
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 5,
      paddingBottom: () => 5
    },
    margin: [0, 0, 0, 0]
  };
};

/**
 * Génère un tableau pour le Total TTC avec bordure complète
 * @param totalTTC - Total TTC
 * @returns Object - Définition du tableau pour pdfmake
 */
export const generateTTCTable = (totalTTC: number) => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const totalTTCSettings = getElementSettings(ELEMENT_IDS.RECAP_TOTAL_TTC);
  
  return {
    table: {
      widths: TABLE_COLUMN_WIDTHS.TOTALS,
      body: [
        [
          { 
            text: 'Total TTC', 
            alignment: 'left', 
            fontSize: totalTTCSettings.fontSize, 
            bold: totalTTCSettings.isBold || true 
          },
          { 
            text: formatPrice(totalTTC), 
            alignment: 'right', 
            fontSize: totalTTCSettings.fontSize, 
            color: colors.mainText, 
            bold: totalTTCSettings.isBold || true 
          }
        ]
      ]
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: (i: number) => {
        // Supprimer la ligne verticale centrale (i=1)
        return i === 0 || i === 2 ? 1 : 0;
      },
      hLineColor: () => colors.totalBoxLines,
      vLineColor: () => colors.totalBoxLines,
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 5,
      paddingBottom: () => 5
    },
    margin: [0, 0, 0, 0]
  };
};
