import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfContent } from '@/services/pdf/types/pdfTypes';
import { formatPrice } from '@/services/pdf/utils/priceUtils';
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

export const prepareRecapContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
): PdfContent[] => {
  
  // Filtrer les pièces qui ont des travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Calcul des totaux
  let totalHT = 0;
  let totalTVA = 0;

  roomsWithTravaux.forEach(room => {
    const travauxForRoom = getTravauxForPiece(room.id);
    travauxForRoom.forEach(travail => {
      totalHT += travail.prixTotalHT || 0;
      totalTVA += travail.montantTVA || 0;
    });
  });

  const totalTTC = totalHT + totalTVA;
  
  // Création du contenu du récapitulatif
  let content: PdfContent[] = [
    {
      text: 'RÉCAPITULATIF',
      style: 'roomTitle',
      alignment: 'center',
      fontSize: 14,
      bold: true,
      // Suppression de pageBreak: 'before' pour éviter la page vide
      margin: [0, 10, 0, 20]
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              stack: [
                { text: 'Signature', style: 'tableHeader', margin: [0, 0, 0, 5] },
                { text: PDF_TEXTS.SIGNATURE.CONTENT, fontSize: 8, margin: [0, 0, 0, 5] },
                ...PDF_TEXTS.SIGNATURE.POINTS.map(point => ({ text: point.text, fontSize: 8, bold: point.bold, margin: [0, 0, 0, 3] }))
              ],
              style: 'signatureZone'
            },
            {
              stack: [
                { text: 'Détails', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
                {
                  table: {
                    widths: ['*', '*'],
                    body: [
                      [
                        { text: 'Total HT :', alignment: 'right', fontSize: 9, color: '#002855' },
                        { text: formatPrice(totalHT), alignment: 'right', fontSize: 9, color: '#002855' }
                      ],
                      [
                        { text: 'TVA :', alignment: 'right', fontSize: 9, color: '#002855' },
                        { text: formatPrice(totalTVA), alignment: 'right', fontSize: 9, color: '#002855' }
                      ],
                      [
                        { text: 'Total TTC :', alignment: 'right', fontSize: 10, bold: true, color: '#002855' },
                        { text: formatPrice(totalTTC), alignment: 'right', fontSize: 10, bold: true, color: '#002855' }
                      ]
                    ]
                  },
                  layout: 'noBorders',
                  style: 'totalsTable'
                }
              ],
              style: 'totalsColumn'
            }
          ]
        ]
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 20]
    },
    {
      text: PDF_TEXTS.SALUTATION,
      fontSize: 9,
      color: '#002855',
      margin: [0, 0, 0, 10]
    },
    {
      text: PDF_TEXTS.CGV.TITLE,
      style: 'tableHeader',
      fontSize: 12,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 10]
    },
    ...PDF_TEXTS.CGV.SECTIONS.map(section => ([
      { text: section.title, style: 'tableHeader', fontSize: 10, bold: true, margin: [0, 0, 0, 5] },
      { text: section.content, fontSize: 8, margin: [0, 0, 0, 5] },
      ...(section.subsections || []).flatMap(subsection => ([
        { text: subsection.title, style: 'tableHeader', fontSize: 9, bold: true, margin: [0, 0, 0, 5] },
        { text: subsection.content, fontSize: 8, margin: [0, 0, 0, 5] },
        ...(subsection.bullets || []).map(bullet => ({ text: bullet, fontSize: 8, margin: [0, 0, 0, 3], listType: 'bullet' })),
        { text: subsection.content_after || '', fontSize: 8, margin: [0, 0, 0, 5] }
      ]))
    ])).flat()
  ];
  
  return content;
};
