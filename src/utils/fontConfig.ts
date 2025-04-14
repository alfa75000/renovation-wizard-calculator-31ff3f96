
import pdfMake from 'pdfmake/build/pdfmake';

export const configureFonts = () => {
  pdfMake.fonts = {
    Roboto: {
      normal: 'fonts/roboto/normal.ttf',
      bold: 'fonts/roboto/bold.ttf',
      italics: 'fonts/roboto/italics.ttf',
      bolditalics: 'fonts/roboto/bolditalics.ttf'
    },
    Times: {
      normal: 'fonts/times/normal.ttf',
      bold: 'fonts/times/bold.ttf',
      italics: 'fonts/times/italics.ttf',
      bolditalics: 'fonts/times/bolditalics.ttf'
    },
    Helvetica: {
      normal: 'fonts/helvetica/normal.ttf',
      bold: 'fonts/helvetica/bold.ttf',
      italics: 'fonts/helvetica/italics.ttf',
      bolditalics: 'fonts/helvetica/bolditalics.ttf'
    },
    Courier: {
      normal: 'fonts/courier/normal.ttf',
      bold: 'fonts/courier/bold.ttf',
      italics: 'fonts/courier/italics.ttf',
      bolditalics: 'fonts/courier/bolditalics.ttf'
    }
  };
};
