
import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { PdfContent } from '@/services/pdf/types/pdfTypes';
import { 
  TABLE_COLUMN_WIDTHS, 
  formatMOFournitures, 
  formatPrice, 
  formatQuantity,
  applyElementStyles,
  wrapWithBorders 
} from '@/services/pdf/utils/pdfUtils';
import { DARK_BLUE } from '@/services/pdf/constants/pdfConstants';

export const prepareDetailsContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
): PdfContent[] => {
  console.log('Préparation du contenu des détails des travaux avec paramètres:', pdfSettings);
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer l'en-tête du tableau commun avec styles personnalisables
  const tableHeaderRow = [
    applyElementStyles(
      { text: 'Description', alignment: 'left' },
      'detail_table_header',
      pdfSettings,
      { color: DARK_BLUE, isBold: true }
    ),
    applyElementStyles(
      { text: 'Quantité', alignment: 'center' },
      'detail_table_header',
      pdfSettings,
      { color: DARK_BLUE, isBold: true }
    ),
    applyElementStyles(
      { text: 'Prix HT Unit.', alignment: 'center' },
      'detail_table_header',
      pdfSettings,
      { color: DARK_BLUE, isBold: true }
    ),
    applyElementStyles(
      { text: 'TVA', alignment: 'center' },
      'detail_table_header',
      pdfSettings,
      { color: DARK_BLUE, isBold: true }
    ),
    applyElementStyles(
      { text: 'Total HT', alignment: 'center' },
      'detail_table_header',
      pdfSettings,
      { color: DARK_BLUE, isBold: true }
    )
  ];
  
  // Créer le contenu du document
  const docContent: any[] = [];
  
  // Ajouter le titre de la section avec styles personnalisables
  let titleElement = applyElementStyles(
    { text: 'DÉTAILS DES TRAVAUX' },
    'details_title',
    pdfSettings,
    {
      fontFamily: 'Roboto',
      fontSize: 12,
      isBold: true,
      isItalic: false,
      color: DARK_BLUE,
      alignment: 'center',
      spacing: {
        left: 0,
        top: 10,
        right: 0,
        bottom: 20
      }
    }
  );
  
  // Vérifier si nous devons ajouter des bordures au titre
  if (titleElement._hasBorder && titleElement._borderSettings) {
    docContent.push(
      wrapWithBorders(
        {
          text: 'DÉTAILS DES TRAVAUX',
          fontFamily: titleElement.fontFamily || 'Roboto',
          fontSize: titleElement.fontSize || 12,
          bold: titleElement.bold !== undefined ? titleElement.bold : true,
          italic: titleElement.italic || false,
          color: titleElement.color || DARK_BLUE,
          alignment: titleElement.alignment || 'center',
          margin: titleElement.margin || [0, 10, 0, 20]
        },
        titleElement._borderSettings
      )
    );
  } else {
    docContent.push(titleElement);
  }
  
  // Ajouter l'en-tête du tableau
  docContent.push({
    table: {
      headerRows: 1,
      widths: TABLE_COLUMN_WIDTHS.DETAILS,
      body: [tableHeaderRow]
    },
    layout: {
      hLineWidth: function() { return 1; },
      vLineWidth: function() { return 0; },
      hLineColor: function() { return '#e5e7eb'; },
      fillColor: function(rowIndex: number) { return (rowIndex === 0) ? '#f3f4f6' : null; }
    },
    margin: [0, 0, 0, 10]
  });
  
  // Pour chaque pièce avec des travaux
  roomsWithTravaux.forEach((room, roomIndex) => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Ajouter le titre de la pièce avec styles personnalisables
    const roomTitleElement = applyElementStyles(
      { text: room.name },
      'room_title',
      pdfSettings,
      {
        fontSize: 9,
        isBold: true,
        color: DARK_BLUE,
        fillColor: '#f3f4f6',
        spacing: {
          left: 0,
          top: 10,
          right: 0,
          bottom: 5
        }
      }
    );
    
    docContent.push(roomTitleElement);
    
    // Créer le tableau pour cette pièce
    const tableBody = [];
    
    // Ajouter chaque travail au tableau
    travauxPiece.forEach((travail, index) => {
      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
      const totalHT = prixUnitaireHT * travail.quantite;
      
      // Construire le contenu de la description
      let descriptionLines = [];
      descriptionLines.push(`${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`);
      
      if (travail.description) {
        descriptionLines.push(travail.description);
      }
      
      if (travail.personnalisation) {
        descriptionLines.push(travail.personnalisation);
      }
      
      // Utiliser le nouveau format pour MO/Fournitures
      const moFournText = formatMOFournitures(travail);
      
      // Estimer le nombre de lignes dans la description
      let totalLines = 0;
      
      // Largeur approximative de la colonne de description en caractères
      const columnCharWidth = 80;
      
      // Estimer le nombre réel de lignes pour chaque portion de texte
      descriptionLines.forEach(line => {
        const textLines = Math.ceil(line.length / columnCharWidth);
        totalLines += textLines;
      });
      
      // Estimer aussi les lignes pour le texte MO/Fournitures
      const moFournLines = Math.ceil(moFournText.length / columnCharWidth);
      totalLines += moFournLines;
      
      // Calculer les marges supérieures pour centrer verticalement
      const topMargin = Math.max(0, 3 + (totalLines - 2) * 4);
      
      // Appliquer les styles personnalisables aux différentes cellules
      const workDetailsElement = applyElementStyles(
        { 
          stack: [
            { text: descriptionLines.join('\n'), lineHeight: 1.4 },
            applyElementStyles(
              { text: moFournText, lineHeight: 1.4 },
              'mo_supplies',
              pdfSettings,
              { fontSize: 7 }
            )
          ]
        },
        'work_details',
        pdfSettings,
        { fontSize: 9 }
      );
      
      const qtyElement = applyElementStyles(
        { 
          stack: [
            { text: formatQuantity(travail.quantite), alignment: 'center' },
            { text: travail.unite, alignment: 'center' }
          ],
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        'qty_column',
        pdfSettings,
        { fontSize: 9 }
      );
      
      const priceElement = applyElementStyles(
        { 
          text: formatPrice(prixUnitaireHT), 
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        'price_column',
        pdfSettings,
        { fontSize: 9 }
      );
      
      const vatElement = applyElementStyles(
        { 
          text: `${travail.tauxTVA}%`, 
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        'vat_column',
        pdfSettings,
        { fontSize: 9 }
      );
      
      const totalElement = applyElementStyles(
        { 
          text: formatPrice(totalHT), 
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        'total_column',
        pdfSettings,
        { fontSize: 9 }
      );
      
      // Ajouter la ligne au tableau
      tableBody.push([
        workDetailsElement,
        qtyElement,
        priceElement,
        vatElement,
        totalElement
      ]);
      
      // Ajouter une ligne d'espacement entre les prestations
      if (index < travauxPiece.length - 1) {
        tableBody.push([
          { text: '', margin: [0, 2, 0, 2] },
          {}, {}, {}, {}
        ]);
      }
    });
    
    // Calculer le total HT pour cette pièce
    const pieceTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    // Ajouter la ligne de total pour cette pièce avec styles personnalisables
    const roomTotalLabelElement = applyElementStyles(
      { 
        text: `Total HT ${room.name}`, 
        colSpan: 4, 
        alignment: 'left', 
        fillColor: '#f9fafb'
      },
      'room_total',
      pdfSettings,
      { 
        fontSize: 9, 
        isBold: true
      }
    );
    
    const roomTotalValueElement = applyElementStyles(
      { 
        text: formatPrice(pieceTotalHT), 
        alignment: 'center', 
        fillColor: '#f9fafb'
      },
      'total_column',
      pdfSettings,
      { 
        fontSize: 9, 
        isBold: true
      }
    );
    
    tableBody.push([
      roomTotalLabelElement,
      {}, {}, {},
      roomTotalValueElement
    ]);
    
    // Ajouter le tableau au document
    docContent.push({
      table: {
        headerRows: 0,
        widths: TABLE_COLUMN_WIDTHS.DETAILS,
        body: tableBody
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          if (i === 0 || i === node.table.body.length) {
            return 1;
          }
          
          const isEndOfPrestation = i < node.table.body.length && 
            ((node.table.body[i][0] && 
              node.table.body[i][0].text && 
              node.table.body[i][0].text.toString().includes('Total HT')) ||
            (i > 0 && node.table.body[i-1][0] && 
              node.table.body[i-1][0].text && 
              node.table.body[i-1][0].text.toString().includes('Total HT')));
          
          return isEndOfPrestation ? 1 : 0;
        },
        vLineWidth: function() {
          return 0;
        },
        hLineColor: function() {
          return '#e5e7eb';
        },
        paddingLeft: function() {
          return 4;
        },
        paddingRight: function() {
          return 4;
        },
        paddingTop: function() {
          return 2;
        },
        paddingBottom: function() {
          return 2;
        }
      },
      margin: [0, 0, 0, 15]
    });
  });
  
  return docContent;
};
