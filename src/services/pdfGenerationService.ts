
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
    return new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + '€';
  };

  // Fonction pour formater les quantités avec séparation des milliers
  const formatQuantity = (quantity: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(quantity);
  };

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Calculer le nombre total de pages (approximatif)
  const pageCount = 1; // Estimation d'une seule page pour toutes les pièces
  
  // Créer le contenu du document
  const docContent: any[] = [];
  
  // Marge globale de 15mm
  const pageMargins = [15, 15, 15, 15]; // [gauche, haut, droite, bas] en mm

  // Ajouter l'en-tête avec le numéro de devis et la pagination
  docContent.push({
    text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page 1/${pageCount}`,
    style: 'header',
    alignment: 'right',
    fontSize: 8,
    margin: [0, 0, 0, 20] // Marge bas pour espacer l'en-tête du contenu
  });

  // Définir les largeurs de colonnes constantes pour tous les tableaux
  const columnWidths = ['*', 60, 75, 40, 60]; // Description, Quantité, Prix HT, TVA, Total HT

  // Ajouter l'en-tête du tableau commun pour toutes les pièces (une seule fois en haut de la page)
  const tableHeaderRow = [
    { text: 'Description', style: 'tableHeader', alignment: 'left', color: DARK_BLUE },
    { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'TVA', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: DARK_BLUE }
  ];

  // Créer un tableau pour l'en-tête
  docContent.push({
    table: {
      headerRows: 1,
      widths: columnWidths, // Utiliser les largeurs de colonnes définies
      body: [tableHeaderRow]
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
    margin: [0, 0, 0, 10]
  });

  // Pour chaque pièce avec des travaux, sans forcer de saut de page
  roomsWithTravaux.forEach((room, roomIndex) => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Ajouter le titre de la pièce
    docContent.push({
      text: room.name,
      style: 'roomTitle',
      fontSize: 9,
      bold: true,
      color: DARK_BLUE,
      fillColor: '#f3f4f6',
      margin: [0, 0, 0, 5]
    });
    
    // Créer le tableau pour cette pièce (sans l'en-tête)
    const tableBody = [];
    
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
          italic: true  // Correction: utiliser 'italic' au lieu de 'italics'
        });
      }
      
      descriptionContent.push({
        text: `MO: ${formatPrice(travail.prixMainOeuvre)}/u, Fourn: ${formatPrice(travail.prixFournitures)}/u (total: ${formatPrice(prixUnitaireHT)}/u)`,
        fontSize: 7
      });
      
      // Ajouter plus d'espace entre les travaux
      const marginBottom = index < travauxPiece.length - 1 ? 7 : 2; // 7 points pour espacement entre prestations
      
      // Augmenter l'interligne dans les cellules de description
      const stack = {
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
        stack,
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
        headerRows: 0, // Pas d'en-tête de tableau puisqu'on l'a déjà ajouté en haut
        widths: columnWidths, // Utiliser les largeurs de colonnes définies
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
        }
      },
      margin: [0, 0, 0, 15]  // Augmenter la marge en bas de chaque tableau de pièce
    });
  });
  
  // Définir le document avec contenu et styles
  const docDefinition = {
    content: docContent,
    styles: {
      header: {
        fontSize: 8,
        color: DARK_BLUE,
        margin: [0, 5, 0, 20]
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
        bold: true,
        color: DARK_BLUE
      }
    },
    pageMargins: pageMargins, // Réduction des marges à 15mm sur tous les côtés
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
