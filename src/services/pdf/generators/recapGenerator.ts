//src/services/pdf/generators/recapGenerator.ts
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
import { 
  formatPrice,
  applyElementStyles,
  wrapWithBorders
} from '@/services/pdf/utils/pdfUtils';

export const prepareRecapContent = (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
): PdfContent[] => {
  console.log('Préparation du contenu du récapitulatif avec paramètres PDF:', pdfSettings);
  
  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Créer le contenu du document
  const docContent: any[] = [];
  
  // Définir le titre avec styles personnalisables
  let titleElement = applyElementStyles(
    {
      text: 'RÉCAPITULATIF',
    },
    'recap_title',
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
  
  // Vérifier si nous devons ajouter des bordures autour du titre
  if (titleElement._hasBorder && titleElement._borderSettings) {
    docContent.push(
      wrapWithBorders(
        {
          text: 'RÉCAPITULATIF',
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
    // Ajouter l'élément de titre sans bordures
    docContent.push(titleElement);
  }
  
  // Créer la table des totaux par pièce avec styles personnalisables
  const roomTotalsTableBody = [];
  
  // Ajouter l'en-tête de la table avec styles personnalisables
  const headerFirstCell = applyElementStyles(
    { text: '', alignment: 'left' },
    'recap_table_header',
    pdfSettings,
    { 
      fontSize: 8, 
      color: DARK_BLUE,
      isBold: true
    }
  );
  
  const headerSecondCell = applyElementStyles(
    { text: 'Montant HT', alignment: 'right' },
    'recap_table_header',
    pdfSettings,
    { 
      fontSize: 8, 
      color: DARK_BLUE,
      isBold: true
    }
  );
  
  roomTotalsTableBody.push([headerFirstCell, headerSecondCell]);
    
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
    
    // Appliquer les styles personnalisables aux cellules de la table
    const roomNameCell = applyElementStyles(
      { text: `Total ${room.name}`, alignment: 'left' },
      'room_title',
      pdfSettings,
      { 
        fontSize: 8,
        isBold: true
      }
    );
    
    const roomTotalCell = applyElementStyles(
      { text: formatPrice(roomTotalHT), alignment: 'right' },
      'total_column',
      pdfSettings,
      { 
        fontSize: 8,
        color: DARK_BLUE
      }
    );
    
    // Ajouter la ligne à la table
    roomTotalsTableBody.push([roomNameCell, roomTotalCell]);
  });
  
  // Ajouter la table au document avec des styles personnalisables
  const roomTotalsTable = {
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
  };
  
  docContent.push(roomTotalsTable);
  
  // Table des totaux généraux
  const totalTTC = totalHT + totalTVA;

  // Structure de la page récapitulative avec styles personnalisables
  const signatureContent = generateSignatureContent(pdfSettings);
  const salutationContent = generateSalutationContent(pdfSettings);
  const standardTotalsTable = generateStandardTotalsTable(totalHT, totalTVA, pdfSettings);
  const ttcTable = generateTTCTable(totalTTC, pdfSettings);
  
  // Créer la mise en page à deux colonnes
  docContent.push({
    columns: [
      // Colonne gauche - Texte de signature (environ 70% de la largeur)
      {
        width: '70%',
        stack: [
          // Contenu de signature généré
          ...signatureContent,
          
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
          standardTotalsTable,
          // Ensuite le tableau du Total TTC avec bordure complète
          ttcTable
        ]
      }
    ],
    margin: [0, 0, 0, 20]
  });

  // Ajouter le texte de salutation sur toute la largeur
  docContent.push(salutationContent);
  
  // Ajouter les conditions générales de vente avec styles personnalisables
  const cgvContent = generateCGVContent(pdfSettings);
  
  // Ajouter chaque élément du contenu CGV
  docContent.push(...cgvContent);
  
  return docContent;
};
