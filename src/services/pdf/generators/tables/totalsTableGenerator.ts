
import { formatPrice } from '../../pdfConstants';
import { 
  ELEMENT_IDS, 
  getElementSettings, 
  getPdfColors 
} from '../../utils/styleUtils';
import { getPdfSettings } from '../../config/pdfSettingsManager';

/**
 * Génère une structure de tableau pour les totaux (HT et TVA) sans bordures
 * @param totalHT - Total HT
 * @param totalTVA - Total TVA
 * @returns Object - Structure du tableau
 */
export const generateStandardTotalsTable = (totalHT: number, totalTVA: number) => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const totalHTSettings = getElementSettings(ELEMENT_IDS.RECAP_TOTAL_HT);
  const totalTVASettings = getElementSettings(ELEMENT_IDS.RECAP_TOTAL_TVA);
  
  return {
    table: {
      widths: ['50%', '50%'],
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
            alignment: totalHTSettings.alignment || 'right', 
            fontSize: totalHTSettings.fontSize, 
            color: colors.mainText,
            bold: totalHTSettings.isBold
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
            alignment: totalTVASettings.alignment || 'right', 
            fontSize: totalTVASettings.fontSize, 
            color: colors.mainText,
            bold: totalTVASettings.isBold
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
 * Génère une structure de tableau pour le Total TTC avec bordure complète
 * @param totalTTC - Total TTC
 * @returns Object - Structure du tableau
 */
export const generateTTCTable = (totalTTC: number) => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const totalTTCSettings = getElementSettings(ELEMENT_IDS.RECAP_TOTAL_TTC);
  
  return {
    table: {
      widths: ['50%', '50%'],
      body: [
        [
          { 
            text: 'Total TTC', 
            alignment: 'left', 
            fontSize: totalTTCSettings.fontSize, 
            bold: totalTTCSettings.isBold
          },
          { 
            text: formatPrice(totalTTC), 
            alignment: totalTTCSettings.alignment || 'right', 
            fontSize: totalTTCSettings.fontSize, 
            color: colors.mainText,
            bold: totalTTCSettings.isBold
          }
        ]
      ]
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: (i) => i === 0 || i === 2 ? 1 : 0,
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
