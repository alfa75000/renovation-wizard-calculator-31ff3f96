
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfSettings } from './config/pdfSettingsTypes';
import { PDF_MARGINS, DARK_BLUE } from './pdfConstants';

/**
 * Configure les polices et styles PDF en fonction des paramètres utilisateur
 */
export const configurePdfStyles = (pdfSettings: PdfSettings) => {
  // Log des paramètres reçus
  console.log('[configurePdfStyles] Configuration des styles avec les paramètres :', pdfSettings);
  
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
  const mainColor = pdfSettings?.colors?.mainText || DARK_BLUE;
  
  console.log('[configurePdfStyles] Utilisation de la couleur principale:', mainColor);
  
  const styles = {
    header: {
      fontSize: pdfSettings?.fontSize?.heading || 8,
      color: mainColor,
      margin: [0, 5, 0, 10]
    },
    roomTitle: {
      fontSize: pdfSettings?.fontSize?.details || 9,
      bold: true,
      color: mainColor,
      fillColor: pdfSettings?.colors?.background || '#f3f4f6',
      padding: [5, 3, 5, 3],
      margin: [0, 10, 0, 5]
    },
    tableHeader: {
      fontSize: pdfSettings?.fontSize?.details || 9,
      bold: true,
      color: mainColor
    },
    italic: {
      italics: true
    }
  };

  const defaultStyle = {
    fontSize: pdfSettings?.fontSize?.normal || 9,
    color: mainColor
  };
  
  console.log('[configurePdfStyles] Styles configurés:', {
    headerFontSize: styles.header.fontSize,
    headerColor: styles.header.color,
    defaultFontSize: defaultStyle.fontSize,
    defaultColor: defaultStyle.color
  });

  return {
    fonts,
    styles,
    defaultStyle
  };
};

/**
 * Récupère les marges du document en fonction des paramètres utilisateur
 */
export const getDocumentMargins = (pdfSettings: PdfSettings, pageType: 'cover' | 'details' | 'recap') => {
  console.log('[getDocumentMargins] Récupération des marges pour le type de page:', pageType);
  console.log('[getDocumentMargins] Paramètres PDF disponibles:', pdfSettings);
  
  let margins;
  
  switch (pageType) {
    case 'cover':
      margins = pdfSettings?.margins?.cover || PDF_MARGINS.COVER;
      break;
    case 'details':
      margins = pdfSettings?.margins?.details || PDF_MARGINS.DETAILS;
      break;
    case 'recap':
      margins = pdfSettings?.margins?.recap || PDF_MARGINS.RECAP;
      break;
    default:
      margins = PDF_MARGINS.COVER;
  }
  
  console.log('[getDocumentMargins] Marges appliquées:', margins);
  return margins;
};

/**
 * Récupère les couleurs personnalisées pour le document
 */
export const getCustomColors = (pdfSettings: PdfSettings) => {
  const colors = {
    mainText: pdfSettings?.colors?.mainText || DARK_BLUE,
    detailsText: pdfSettings?.colors?.detailsText || '#4D7C8A',
    coverLines: pdfSettings?.colors?.coverLines || DARK_BLUE,
    detailsLines: pdfSettings?.colors?.detailsLines || '#4D7C8A',
    totalBoxLines: pdfSettings?.colors?.totalBoxLines || '#e5e7eb',
    background: pdfSettings?.colors?.background || '#F3F4F6'
  };
  
  console.log('[getCustomColors] Couleurs appliquées:', colors);
  return colors;
};

/**
 * Récupère les tailles de police personnalisées
 */
export const getFontSizes = (pdfSettings: PdfSettings) => {
  const sizes = {
    title: pdfSettings?.fontSize?.title || 18,
    subtitle: pdfSettings?.fontSize?.subtitle || 14,
    heading: pdfSettings?.fontSize?.heading || 12,
    normal: pdfSettings?.fontSize?.normal || 10,
    small: pdfSettings?.fontSize?.small || 8,
    details: pdfSettings?.fontSize?.details || 9
  };
  
  console.log('[getFontSizes] Tailles de police appliquées:', sizes);
  return sizes;
};
