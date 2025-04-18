import { Room, Travail, ProjectMetadata } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { PdfContent } from '@/services/pdf/types/pdfTypes';
import { 
  generateSignatureContent,
  generateSalutationContent,
  generateCGVContent,
  generateStandardTotalsTable,
  generateTTCTable
} from '@/services/pdf/components/pdfComponents';
import { DARK_BLUE } from '@/services/pdf/constants/pdfConstants';
import { formatPrice } from '@/services/pdf/utils/pdfUtils';

export const prepareRecapContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
): PdfContent[] => {
  console.log('Préparation du contenu du récapitulatif avec paramètres PDF:', pdfSettings);
  console.log('Éléments de récapitulatif:', pdfSettings?.elements?.recap_title);
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer le contenu du document
  const docContent: any[] = [
    // Titre du récapitulatif avec les paramètres personnalisés
    {
      text: 'RÉCAPITULATIF',
      fontFamily: pdfSettings?.elements?.recap_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.recap_title?.fontSize || 12,
      bold: pdfSettings?.elements?.recap_title?.isBold !== undefined ? pdfSettings.elements.recap_title.isBold : true,
      italic: pdfSettings?.elements?.recap_title?.isItalic || false,
      color: pdfSettings?.elements?.recap_title?.color || DARK_BLUE,
      alignment: pdfSettings?.elements?.recap_title?.alignment || 'center',
      margin: [
        pdfSettings?.elements?.recap_title?.spacing?.left || 0,
        pdfSettings?.elements?.recap_title?.spacing?.top || 10,
        pdfSettings?.elements?.recap_title?.spacing?.right || 0,
        pdfSettings?.elements?.recap_title?.spacing?.bottom || 20
      ],
      pageBreak: 'before'
    }
  ];
  
  // Ajout de la bordure si elle est définie
  // Vérification de la présence des paramètres de bordure
  if (pdfSettings?.elements?.recap_title?.border) {
    const border = pdfSettings.elements.recap_title.border;
    console.log('Bordures récapitulatif trouvées:', border);
    
    // Création de la structure de tableau pour appliquer des bordures
    // Utiliser un tableau pour encapsuler le texte avec des bordures
    const hasBorder = border.top || border.right || border.bottom || border.left;
    
    if (hasBorder) {
      // Remplacer l'élément de texte simple par un tableau avec bordures
      docContent[0] = {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'RÉCAPITULATIF',
                fontFamily: pdfSettings?.elements?.recap_title?.fontFamily || 'Roboto',
                fontSize: pdfSettings?.elements?.recap_title?.fontSize || 12,
                bold: pdfSettings?.elements?.recap_title?.isBold !== undefined ? pdfSettings.elements.recap_title.isBold : true,
                italic: pdfSettings?.elements?.recap_title?.isItalic || false,
                color: pdfSettings?.elements?.recap_title?.color || DARK_BLUE,
                alignment: pdfSettings?.elements?.recap_title?.alignment || 'center',
                margin: [
                  pdfSettings?.elements?.recap_title?.spacing?.left || 0,
                  pdfSettings?.elements?.recap_title?.spacing?.top || 10,
                  pdfSettings?.elements?.recap_title?.spacing?.right || 0,
                  pdfSettings?.elements?.recap_title?.spacing?.bottom || 20
                ]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: function(i: number, node: any) {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: function(i: number, node: any) {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: function() {
            return border.color || DARK_BLUE;
          },
          vLineColor: function() {
            return border.color || DARK_BLUE;
          }
        },
        pageBreak: 'before',
        margin: [0, 0, 0, 20]
      };
    }
  } else {
    console.log('Aucune bordure définie pour le récapitulatif');
  }
  
  // Créer la table des totaux par pièce
  const roomTotalsTableBody = [];
  
  // Ajouter l'en-tête de la table
  roomTotalsTableBody.push([
    { text: '', style: 'tableHeader', alignment: 'left', color: DARK_BLUE, fontSize: 8 },
    { text: 'Montant HT', style: 'tableHeader', alignment: 'right', color: DARK_BLUE, fontSize: 8 }
  ]);
    
  // Pour chaque pièce avec des travaux
  let totalHT = 0;
  let totalTVA = 0;
  
  roomsWithTravaux.forEach(room => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Calculer le total HT pour cette pièce
    const roomTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    // Calculer la TVA pour cette pièce
    const roomTVA = travauxPiece.reduce((sum, t) => {
      const totalHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
      return sum + (totalHT * t.tauxTVA / 100);
    }, 0);
    
    // Ajouter à nos totaux
    totalHT += roomTotalHT;
    totalTVA += roomTVA;
    
    // Ajouter la ligne à la table
    roomTotalsTableBody.push([
      { text: `Total ${room.name}`, alignment: 'left', fontSize: 8, bold: true },
      { text: formatPrice(roomTotalHT), alignment: 'right', fontSize: 8, color: DARK_BLUE }
    ]);
  });
  
  // Ajouter la table au document
  docContent.push({
    table: {
      headerRows: 1,
      widths: ['*', 100],
      body: roomTotalsTableBody
    },
    layout: {
      hLineWidth: function(i: number, node: any) {
        return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0;
      },
      vLineWidth: function() {
        return 0;
      },
      hLineColor: function() {
        return '#e5e7eb';
      },
      paddingLeft: function() {
        return 10;
      },
      paddingRight: function() {
        return 10;
      },
      paddingTop: function() {
        return 5;
      },
      paddingBottom: function() {
        return 5;
      }
    },
    margin: [0, 0, 0, 20]
  });
  
  // Table des totaux généraux
  const totalTTC = totalHT + totalTVA;

  // Structure de la page récapitulative
  docContent.push({
    columns: [
      // Colonne gauche - Texte de signature (environ 70% de la largeur)
      {
        width: '70%',
        stack: [
          // Contenu de signature généré
          ...generateSignatureContent(),
          
          // 10 lignes vides pour la signature
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] },
          { text: "", margin: [0, 5, 0, 0] }
        ]
      },
      // Colonne droite - Tableaux des totaux (environ 30% de la largeur)
      {
        width: '30%',
        stack: [
          // D'abord le tableau standard sans bordures
          generateStandardTotalsTable(totalHT, totalTVA),
          // Ensuite le tableau du Total TTC avec bordure complète
          generateTTCTable(totalTTC)
        ]
      }
    ],
    margin: [0, 0, 0, 20]
  });

  // Ajouter le texte de salutation sur toute la largeur
  docContent.push(generateSalutationContent());
  
  // Ajouter les conditions générales de vente
  const cgvContent = generateCGVContent();
  
  // Ajouter chaque élément du contenu CGV
  docContent.push(...cgvContent);
  
  return docContent;
};
