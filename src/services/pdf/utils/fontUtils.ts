
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Liste des polices disponibles par défaut dans pdfMake
export const AVAILABLE_FONTS = ['Roboto', 'Courier', 'Helvetica', 'Times'];

/**
 * Configure pdfMake with the default fonts
 */
export const configurePdfFonts = () => {
  // The correct way to set up vfs
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
  
  // Make sure fonts are properly registered
  if (!pdfMake.fonts) {
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };
  }
};

/**
 * Assure que la police demandée est disponible, sinon retourne 'Roboto'
 */
export const ensureSupportedFont = (fontFamily?: string): string => {
  if (!fontFamily || !AVAILABLE_FONTS.includes(fontFamily)) {
    console.warn(`Font "${fontFamily}" is not supported, using Roboto instead`);
    return 'Roboto'; // Police par défaut si celle demandée n'est pas disponible
  }
  return fontFamily;
};
