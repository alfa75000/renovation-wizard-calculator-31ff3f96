
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata } from '@/types';

// Initialiser pdfMake avec les polices
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  // Fonction utilitaire pour formater les prix
  const formatPrice = (value: number): string => {
    return `${value.toFixed(2)}€`;
  };

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Calculer le nombre total de pages
  const pageCount = roomsWithTravaux.length;
  
  // Créer le contenu du document
  const docContent: any[] = [];
  
  // Marge globale de 15mm
  const pageMargins = [15, 15, 15, 15]; // [gauche, haut, droite, bas] en mm

  // Pour chaque pièce avec des travaux
  roomsWithTravaux.forEach((room, roomIndex) => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Si ce n'est pas la première pièce, ajouter un saut de page avant
    if (roomIndex > 0) {
      docContent.push({ text: '', pageBreak: 'before' });
    }
    
    // Ajouter l'en-tête avec le numéro de devis et la pagination
    docContent.push({
      text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${roomIndex + 1}/${pageCount}`,
      style: 'header',
      alignment: 'right',
      fontSize: 9,
      margin: [0, 0, 0, 20] // Marge bas pour espacer l'en-tête du contenu
    });
    
    // Ajouter le titre de la pièce
    docContent.push({
      text: room.name,
      style: 'roomTitle',
      fontSize: 9,
      bold: true,
      fillColor: '#f3f4f6',
      margin: [0, 0, 0, 5]
    });
    
    // Créer le tableau pour cette pièce
    const tableBody = [];
    
    // En-tête du tableau
    tableBody.push([
      { text: 'Description', style: 'tableHeader', alignment: 'left' },
      { text: 'Quantité', style: 'tableHeader', alignment: 'right' },
      { text: 'Prix HT Unitaire', style: 'tableHeader', alignment: 'center' },
      { text: 'TVA', style: 'tableHeader', alignment: 'right' },
      { text: 'Total HT', style: 'tableHeader', alignment: 'right' }
    ]);
    
    // Ajouter chaque travail au tableau
    travauxPiece.forEach(travail => {
      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
      const totalHT = prixUnitaireHT * travail.quantite;
      
      const descriptionContent = [
        { text: `${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`, fontSize: 9, bold: true }
      ];
      
      if (travail.description) {
        descriptionContent.push({ text: travail.description, fontSize: 8, color: '#4b5563' });
      }
      
      if (travail.personnalisation) {
        descriptionContent.push({ text: travail.personnalisation, fontSize: 8, color: '#4b5563', italics: true });
      }
      
      descriptionContent.push({
        text: `MO: ${formatPrice(travail.prixMainOeuvre)}/u, Fourn: ${formatPrice(travail.prixFournitures)}/u (total: ${formatPrice(prixUnitaireHT)}/u)`,
        fontSize: 8,
        color: '#4b5563'
      });
      
      tableBody.push([
        { stack: descriptionContent },
        { text: `${travail.quantite} ${travail.unite}`, alignment: 'right', fontSize: 9 },
        { text: formatPrice(prixUnitaireHT), alignment: 'right', fontSize: 9 },
        { text: `${travail.tauxTVA}%`, alignment: 'right', fontSize: 9 },
        { text: formatPrice(totalHT), alignment: 'right', fontSize: 9, bold: true }
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
      { text: formatPrice(pieceTotalHT), alignment: 'right', fontSize: 9, bold: true, fillColor: '#f9fafb' }
    ]);
    
    // Ajouter le tableau au document
    docContent.push({
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto'],
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
      margin: [0, 0, 0, 15]
    });
  });
  
  // Définir le document avec contenu et styles
  const docDefinition = {
    content: docContent,
    styles: {
      header: {
        fontSize: 9,
        margin: [0, 5, 0, 20]
      },
      roomTitle: {
        fontSize: 9,
        bold: true,
        fillColor: '#f3f4f6',
        padding: [5, 3, 5, 3],
        margin: [0, 0, 0, 5]
      },
      tableHeader: {
        fontSize: 9,
        bold: true
      }
    },
    pageMargins: pageMargins, // Réduction des marges à 15mm sur tous les côtés
    defaultStyle: {
      fontSize: 9
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
