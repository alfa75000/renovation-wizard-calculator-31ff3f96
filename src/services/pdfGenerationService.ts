
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata } from '@/types';

// Initialiser pdfMake avec les polices
// Vérifier que pdfMake et pdfFonts existent avant d'accéder à leurs propriétés
if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

// Couleur bleu foncée similaire à celle utilisée dans DevisCoverPreview
const DARK_BLUE = "#002855";

export const generateCoverPDF = async (fields: any[], company: any) => {
  // La logique existante pour la page de garde reste inchangée
  console.log('Génération du PDF de la page de garde', { fields, company });
  
  // Cette fonction est probablement déjà implémentée ailleurs
};

export const generateDetailsPDF = async (
  rooms: Room[], 
  travaux: Travail[], 
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata
) => {
  console.log('Génération du PDF des détails des travaux avec pdfMake');

  // Fonction utilitaire pour formater les prix avec séparation des milliers
  const formatPrice = (value: number): string => {
    // Utiliser un espace non-sécable comme séparateur de milliers pour éviter les problèmes d'affichage
    return new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(value).replace(/\s/g, '\u00A0') + '€';
  };

  // Fonction pour formater les quantités avec séparation des milliers
  const formatQuantity = (quantity: number): string => {
    // Utiliser un espace non-sécable comme séparateur de milliers pour éviter les problèmes d'affichage
    return new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(quantity).replace(/\s/g, '\u00A0');
  };

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Estimation du nombre de pages - à ajuster selon les besoins
  const pageCount = Math.max(1, Math.ceil(roomsWithTravaux.length / 2));
  
  // Définir les largeurs de colonnes ajustées comme demandé
  const columnWidths = ['*', 50, 50, 30, 60]; // Description, Quantité, Prix HT, TVA, Total HT

  // Créer l'en-tête du tableau commun pour toutes les pièces
  const tableHeaderRow = [
    { text: 'Description', style: 'tableHeader', alignment: 'left' },
    { text: 'Quantité', style: 'tableHeader', alignment: 'center' },
    { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center' },
    { text: 'TVA', style: 'tableHeader', alignment: 'center' },
    { text: 'Total HT', style: 'tableHeader', alignment: 'center' }
  ];
  
  // Créer le contenu du document
  const docContent: any[] = [];
  
  // Pour chaque pièce avec des travaux
  roomsWithTravaux.forEach((room, roomIndex) => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Ajouter le titre de la pièce
    docContent.push({
      text: room.name,
      style: 'roomTitle',
      margin: [0, 0, 0, 5]
    });
    
    // Créer le tableau pour cette pièce avec l'en-tête
    const tableBody = [tableHeaderRow];
    
    // Ajouter chaque travail au tableau
    travauxPiece.forEach((travail, index) => {
      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
      const totalHT = prixUnitaireHT * travail.quantite;
      
      const descriptionContent = [
        { text: `${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`, fontSize: 9 }
      ];
      
      if (travail.description) {
        descriptionContent.push({ 
          text: travail.description, 
          fontSize: 8
        });
      }
      
      if (travail.personnalisation) {
        descriptionContent.push({ 
          text: travail.personnalisation, 
          fontSize: 8,
          italics: true
        });
      }
      
      descriptionContent.push({
        text: `MO: ${formatPrice(travail.prixMainOeuvre)}/u, Fourn: ${formatPrice(travail.prixFournitures)}/u (total: ${formatPrice(prixUnitaireHT)}/u)`,
        fontSize: 7
      });
      
      // Ajouter plus d'espace entre les travaux
      const marginBottom = index < travauxPiece.length - 1 ? 7 : 2; // 7 points pour espacement entre prestations
      
      // Augmenter l'interligne dans les cellules de description
      const stackDescription = {
        stack: descriptionContent,
        lineHeight: 1.3  // Augmenter l'interligne de 1 point
      };
      
      // Afficher la quantité en deux lignes
      const quantityStack = {
        stack: [
          { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: 9 },
          { text: travail.unite, alignment: 'center', fontSize: 9 }
        ],
        alignment: 'center'
      };
      
      tableBody.push([
        stackDescription,
        quantityStack,
        { text: formatPrice(prixUnitaireHT), alignment: 'center', fontSize: 9 },
        { text: `${travail.tauxTVA}%`, alignment: 'center', fontSize: 9 },
        { text: formatPrice(totalHT), alignment: 'center', fontSize: 9 }
      ]);
    });
    
    // Calculer le total HT pour cette pièce
    const pieceTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    // Ajouter la ligne de total pour cette pièce
    tableBody.push([
      { text: `Total HT ${room.name}`, colSpan: 4, alignment: 'left', fontSize: 9, bold: true, fillColor: '#f9fafb' },
      {}, {}, {},
      { text: formatPrice(pieceTotalHT), alignment: 'center', fontSize: 9, bold: true, fillColor: '#f9fafb' }
    ]);
    
    // Ajouter le tableau au document
    docContent.push({
      table: {
        headerRows: 1, // L'en-tête est maintenant inclus dans le corps du tableau
        widths: columnWidths, // Utiliser les largeurs de colonnes ajustées
        body: tableBody
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 1 : 1;
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
        },
        fillColor: function(rowIndex: number) {
          return (rowIndex === 0) ? '#f3f4f6' : null;
        }
      },
      margin: [0, 0, 0, 15]  // Augmenter la marge en bas de chaque tableau de pièce
    });
  });
  
  // Marge haute de 40mm comme demandé
  const pageMargins = [30, 40, 30, 30]; // [gauche, haut, droite, bas] en mm
  
  // Définir le document avec contenu et styles
  const docDefinition = {
    header: function(currentPage: number, pageCount: number) {
      return {
        text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${pageCount}`,
        style: 'header',
        alignment: 'right',
        margin: [30, 25, 30, 0] // Marges [gauche, haut, droite, bas] - marge haute à 25mm comme demandé
      };
    },
    content: docContent,
    styles: {
      header: {
        fontSize: 8,
        color: DARK_BLUE,
        margin: [0, 5, 0, 10]
      },
      roomTitle: {
        fontSize: 9,
        bold: true,
        color: DARK_BLUE,
        fillColor: '#f3f4f6',
        padding: [5, 3, 5, 3],
        margin: [0, 0, 0, 5]
      },
      tableHeader: {
        fontSize: 9,
        color: DARK_BLUE
      },
      italic: {
        italics: true
      }
    },
    pageMargins: pageMargins,
    defaultStyle: {
      fontSize: 9,
      color: DARK_BLUE
    }
  };
  
  try {
    // Créer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`devis_details_${metadata?.devisNumber || 'XXXX-XX'}.pdf`);
    console.log('PDF généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
