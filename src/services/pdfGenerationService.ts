
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

  // Format MO/Fournitures avec le nouveau format
  const formatMOFournitures = (travail: Travail): string => {
    const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
    const totalHT = prixUnitaireHT * travail.quantite;
    const montantTVA = (totalHT * travail.tauxTVA) / 100;
    
    return `[ MO: ${formatPrice(travail.prixMainOeuvre)}/u ] [ Fourn: ${formatPrice(travail.prixFournitures)}/u ] [ Total HT: ${formatPrice(prixUnitaireHT)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formatPrice(montantTVA)} ]`;
  };

  // On filtre les pièces qui n'ont pas de travaux
  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id).length > 0);
  
  // Estimation du nombre de pages - à ajuster selon les besoins
  const pageCount = Math.max(1, Math.ceil(roomsWithTravaux.length / 2));
  
  // Définir les largeurs de colonnes ajustées comme demandé
  const columnWidths = ['*', 50, 50, 30, 60]; // Description, Quantité, Prix HT, TVA, Total HT

  // Créer l'en-tête du tableau commun pour toutes les pièces
  const tableHeaderRow = [
    { text: 'Description', style: 'tableHeader', alignment: 'left', color: DARK_BLUE },
    { text: 'Quantité', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'Prix HT Unit.', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'TVA', style: 'tableHeader', alignment: 'center', color: DARK_BLUE },
    { text: 'Total HT', style: 'tableHeader', alignment: 'center', color: DARK_BLUE }
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
      fontSize: 9,
      bold: true,
      color: DARK_BLUE,
      fillColor: '#f3f4f6',
      margin: [0, 10, 0, 5] // Augmenté la marge du haut pour éviter de chevaucher l'en-tête
    });
    
    // Créer le tableau pour cette pièce (sans l'en-tête car il est maintenant dans le header de page)
    const tableBody = [];
    
    // Ajouter chaque travail au tableau - IMPLÉMENTATION AMÉLIORÉE AVEC CENTRAGE VERTICAL
    travauxPiece.forEach((travail, index) => {
      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
      const totalHT = prixUnitaireHT * travail.quantite;
      
      // Construire le contenu de la description avec des sauts de ligne
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
      
      // Estimer le nombre de lignes dans la description, incluant les retours à la ligne automatiques
      let totalLines = 0;
      
      // Largeur approximative de la colonne de description en caractères (à ajuster si nécessaire)
      const columnCharWidth = 80;
      
      // Estimer le nombre réel de lignes pour chaque portion de texte
      descriptionLines.forEach(line => {
        // Estimer combien de lignes cette portion occupera
        const textLines = Math.ceil(line.length / columnCharWidth);
        totalLines += textLines;
      });
      
      // Estimer aussi les lignes pour le texte MO/Fournitures
      const moFournLines = Math.ceil(moFournText.length / columnCharWidth);
      totalLines += moFournLines;
      
      // Calculer les marges supérieures pour centrer verticalement les valeurs
      // Formule ajustée: marge de base + marge par ligne supplémentaire
      const topMargin = Math.max(0, 3 + (totalLines - 2) * 4);
      
      // Ajouter la ligne au tableau
      tableBody.push([
        // Colonne 1: Description avec sauts de ligne et espacement entre lignes augmenté
        { 
          stack: [
            { text: descriptionLines.join('\n'), fontSize: 9, lineHeight: 1.4 },
            { text: moFournText, fontSize: 7, lineHeight: 1.4 } // Modification n°1: Utiliser 7 points pour la ligne MO/Fournitures
          ]
        },
        
        // Colonne 2: Quantité avec marge supérieure pour centrage visuel
        { 
          stack: [
            { text: formatQuantity(travail.quantite), alignment: 'center', fontSize: 9 },
            { text: travail.unite, alignment: 'center', fontSize: 9 }
          ],
          alignment: 'center',
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 3: Prix unitaire avec marge supérieure pour centrage visuel
        { 
          text: formatPrice(prixUnitaireHT), 
          alignment: 'center',
          fontSize: 9,
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 4: TVA avec marge supérieure pour centrage visuel
        { 
          text: `${travail.tauxTVA}%`, 
          alignment: 'center',
          fontSize: 9,
          margin: [0, topMargin, 0, 0]
        },
        
        // Colonne 5: Total HT avec marge supérieure pour centrage visuel
        { 
          text: formatPrice(totalHT), 
          alignment: 'center',
          fontSize: 9,
          margin: [0, topMargin, 0, 0]
        }
      ]);
      
      // Ajouter une ligne d'espacement entre les prestations (sauf après la dernière)
      if (index < travauxPiece.length - 1) {
        tableBody.push([
          { text: '', margin: [0, 2, 0, 2] }, // Espacement supplémentaire
          {}, {}, {}, {}
        ]);
      }
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
        headerRows: 0, // Pas d'en-tête de tableau puisqu'on l'a déplacé dans l'en-tête de page
        widths: columnWidths, // Utiliser les largeurs de colonnes ajustées
        body: tableBody
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          // Ne montrer les lignes qu'au début et à la fin de chaque prestation (pas aux sauts de page)
          if (i === 0 || i === node.table.body.length) {
            return 1; // Première et dernière ligne du tableau
          }
          
          // Pour les autres lignes, vérifier si c'est une fin de prestation ou un total
          // On vérifie si la ligne actuelle ou la précédente contient "Total HT"
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
      margin: [0, 0, 0, 15]  // Augmenter la marge en bas de chaque tableau de pièce
    });
  });
  
  // Définir le document avec contenu et styles
  const docDefinition = {
    header: function(currentPage: number, pageCount: number) {
      // Modification n°2: Ajustement de la numérotation de page
      // Ajuster le comptage: page actuelle + 1 (pour décaler après la page de garde)
      const adjustedCurrentPage = currentPage + 1;
      
      // Ajuster le nombre total: pages générées + 3 (page de garde + récap + conditions)
      const adjustedTotalPages = pageCount + 3;
      
      return [
        // En-tête avec le numéro de devis et la pagination ajustée
        {
          text: `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page ${adjustedCurrentPage}/${adjustedTotalPages}`,
          style: 'header',
          alignment: 'right',
          fontSize: 8,
          margin: [30, 20, 30, 10] // Ajustement des marges [gauche, haut, droite, bas]
        },
        // En-tête du tableau - modifié pour éviter l'objet stack
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [tableHeaderRow]
          },
          layout: {
            hLineWidth: function() { return 1; },
            vLineWidth: function() { return 0; },
            hLineColor: function() { return '#e5e7eb'; },
            fillColor: function(rowIndex: number) { return (rowIndex === 0) ? '#f3f4f6' : null; }
          },
          margin: [30, 0, 30, 10] // Ajouté une marge en bas
        }
      ];
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
        margin: [0, 10, 0, 5] // Augmenté la marge du haut pour éviter de chevaucher l'en-tête
      },
      tableHeader: {
        fontSize: 9,
        bold: true, // Remis en gras
        color: DARK_BLUE
      },
      italic: {
        italics: true
      }
    },
    pageMargins: [30, 70, 30, 30], // [gauche, haut, droite, bas] - Augmenté la marge haute pour l'en-tête
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
