
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialiser pdfMake avec les polices
if (pdfMake && pdfFonts) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export default pdfMake;
