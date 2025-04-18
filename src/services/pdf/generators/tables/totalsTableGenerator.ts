
import { TableCell } from 'pdfmake/interfaces';
import { formatPrice } from '../../pdfConstants';

export const generateStandardTotalsTable = (totalHT: number, totalTVA: number) => {
  const body: TableCell[][] = [
    [
      { text: 'Total HT', alignment: 'left', fontSize: 8, bold: false },
      { text: formatPrice(totalHT), alignment: 'right', fontSize: 8, color: '#1a1f2c' }
    ],
    [
      { text: 'Total TVA', alignment: 'left', fontSize: 8, bold: false },
      { text: formatPrice(totalTVA), alignment: 'right', fontSize: 8, color: '#1a1f2c' }
    ]
  ];

  return {
    table: {
      widths: ['*', 100],
      body
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

export const generateTTCTable = (totalTTC: number) => {
  return {
    table: {
      widths: ['*', 100],
      body: [[
        { text: 'Total TTC', alignment: 'left', fontSize: 8, bold: true },
        { text: formatPrice(totalTTC), alignment: 'right', fontSize: 8, color: '#1a1f2c', bold: true }
      ]]
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: (i) => i === 0 || i === 2 ? 1 : 0,
      hLineColor: () => '#e5e7eb',
      vLineColor: () => '#e5e7eb',
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 5,
      paddingBottom: () => 5
    },
    margin: [0, 0, 0, 0]
  };
};
