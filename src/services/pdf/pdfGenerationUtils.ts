
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfSettings } from './config/pdfSettingsTypes';
import { PDF_MARGINS, DARK_BLUE } from './pdfConstants';

/**
 * Configure les polices et styles PDF en fonction des paramètres utilisateur
 */
export const configurePdfStyles = (pdfSettings: PdfSettings) => {
  // Configuration des polices (à implémenter dans une prochaine étape)
  const fonts = {
    // Par défaut, on utilise les polices intégrées de pdfMake
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
  
  // Styles par défaut pour les documents PDF basés sur les paramètres utilisateur
  const mainColor = pdfSettings.colors?.mainText || DARK_BLUE;
  
  const styles = {
    header: {
      fontSize: pdfSettings.fontSize?.heading || 8,
      color: mainColor,
      margin: [0, 5, 0, 10]
    },
    roomTitle: {
      fontSize: pdfSettings.fontSize?.details || 9,
      bold: true,
      color: mainColor,
      fillColor: pdfSettings.colors?.background || '#f3f4f6',
      padding: [5, 3, 5, 3],
      margin: [0, 10, 0, 5]
    },
    tableHeader: {
      fontSize: pdfSettings.fontSize?.details || 9,
      bold: true,
      color: mainColor
    },
    italic: {
      italics: true
    }
  };

  return {
    fonts,
    styles,
    defaultStyle: {
      fontSize: pdfSettings.fontSize?.normal || 9,
      color: mainColor
    }
  };
};

/**
 * Récupère les marges du document en fonction des paramètres utilisateur
 */
export const getDocumentMargins = (pdfSettings: PdfSettings, pageType: 'cover' | 'details' | 'recap') => {
  switch (pageType) {
    case 'cover':
      return pdfSettings.margins?.cover || PDF_MARGINS.COVER;
    case 'details':
      return pdfSettings.margins?.details || PDF_MARGINS.DETAILS;
    case 'recap':
      return pdfSettings.margins?.recap || PDF_MARGINS.RECAP;
    default:
      return PDF_MARGINS.COVER;
  }
};

/**
 * Récupère les couleurs personnalisées pour le document
 */
export const getCustomColors = (pdfSettings: PdfSettings) => {
  return {
    mainText: pdfSettings.colors?.mainText || DARK_BLUE,
    detailsText: pdfSettings.colors?.detailsText || '#4D7C8A',
    coverLines: pdfSettings.colors?.coverLines || DARK_BLUE,
    detailsLines: pdfSettings.colors?.detailsLines || '#4D7C8A',
    totalBoxLines: pdfSettings.colors?.totalBoxLines || '#e5e7eb',
    background: pdfSettings.colors?.background || '#F3F4F6'
  };
};

/**
 * Récupère les tailles de police personnalisées
 */
export const getFontSizes = (pdfSettings: PdfSettings) => {
  return {
    title: pdfSettings.fontSize?.title || 18,
    subtitle: pdfSettings.fontSize?.subtitle || 14,
    heading: pdfSettings.fontSize?.heading || 12,
    normal: pdfSettings.fontSize?.normal || 10,
    small: pdfSettings.fontSize?.small || 8,
    details: pdfSettings.fontSize?.details || 9
  };
};
