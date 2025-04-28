//src/services/pdf/utils/fontUtils.ts
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Only list fonts that are properly configured
export const AVAILABLE_FONTS = ['Roboto', 'Helvetica', 'Courier', 'ModernSans'];

/**
 * Configure pdfMake with the default fonts
 */
export const configurePdfFonts = () => {
  // Set up virtual file system for fonts
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

  // Configure fonts with complete font styles
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
    Courier: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique'
    }
  };
};

/**
 * Ensures that the requested font is supported, falls back to Roboto if not
 */
export const ensureSupportedFont = (fontFamily?: string): string => {
  if (!fontFamily || !AVAILABLE_FONTS.includes(fontFamily)) {
    if (fontFamily) {
      console.warn(`Font "${fontFamily}" is not supported, using Roboto instead`);
    }
    return 'Roboto';
  }
  return fontFamily;
};

