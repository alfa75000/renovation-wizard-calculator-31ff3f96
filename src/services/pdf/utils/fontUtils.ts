
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
};

/**
 * Assure que la police demandée est disponible, sinon retourne 'Roboto'
 */
export const ensureSupportedFont = (fontFamily?: string): string => {
  if (!fontFamily || !AVAILABLE_FONTS.includes(fontFamily)) {
    return 'Roboto'; // Police par défaut si celle demandée n'est pas disponible
  }
  return fontFamily;
};
