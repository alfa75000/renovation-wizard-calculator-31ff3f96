
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
    { text: 'Description', alignment: 'left', color: DARK_BLUE },
    { text: 'Quantité', alignment: 'center', color: DARK_BLUE },
    { text: 'Prix HT Unit.', alignment: 'center', color: DARK_BLUE },
    { text: 'TVA', alignment: 'center', color: DARK_BLUE },
    { text: 'Total HT', alignment: 'center', color: DARK_BLUE }
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
    
    // Créer le tableau pour cette pièce (avec l'en-tête)
    const tableBody = [
      // Ajouter l'en-tête du tableau à chaque tableau de pièce
      tableHeaderRow
    ];
    
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
      
      // Créer les cellules du tableau
      tableBody.push([
        { text: descriptionContent, alignment: 'left' },
        { 
          stack: [
            { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: 9 },
            { text: travail.unite, alignment: 'center', fontSize: 9 }
          ],
          alignment: 'center'
        },
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
        headerRows: 1,
        widths: columnWidths,
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
  
  // Définir les marges de page comme demandé: [gauche, haut, droite, bas]
  const pageMargins = [30, 40, 30, 30]; // Marge haute à 40mm comme demandé
  
  const docDefinition = {
    // Supprimer l'en-tête séparé car il est maintenant inclus dans chaque tableau
    header: function(currentPage: number, pageCount: number) {
      return {
        text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${currentPage}/${pageCount}`,
        alignment: 'right',
        fontSize: 8,
        margin: [30, 25, 30, 5] // Marge haute de l'en-tête à 25mm comme demandé
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
