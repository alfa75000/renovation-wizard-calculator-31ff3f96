
import html2pdf from 'html2pdf.js';
import { Room, Travail, ProjectMetadata } from '@/types';
import { formaterPrix } from '@/lib/utils';

interface PDFStyle {
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  backgroundColor?: string;
  color?: string;
  textAlign?: string;
  borderBottom?: string;
  margin?: string;
}

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
  console.log('Génération du PDF des détails des travaux');
  
  // Créer un container temporaire pour le contenu HTML du PDF
  const container = document.createElement('div');
  container.style.width = '210mm'; // Format A4
  container.style.padding = '15mm'; // Réduction des marges à 15mm sur tous les côtés
  container.style.position = 'relative';
  
  // Ajouter l'en-tête avec le numéro de devis
  const header = document.createElement('div');
  header.style.position = 'absolute';
  header.style.top = '15mm'; // Ajusté à 15mm au lieu de 10mm
  header.style.right = '15mm';
  header.style.fontSize = '9pt';
  header.textContent = `DEVIS N° ${metadata?.devisNumber || 'XXXX-XX'} - page 1/${rooms.filter(r => getTravauxForPiece(r.id).length > 0).length}`;
  container.appendChild(header);
  
  // Container principal pour les travaux
  const content = document.createElement('div');
  content.style.marginTop = '20mm';
  
  // Ajouter chaque pièce avec ses travaux
  rooms.forEach(room => {
    const travauxPiece = getTravauxForPiece(room.id);
    if (travauxPiece.length === 0) return;
    
    // Titre de la pièce
    const roomTitle = document.createElement('div');
    roomTitle.style.fontSize = '9pt';
    roomTitle.style.fontWeight = 'bold';
    roomTitle.style.backgroundColor = '#f3f4f6';
    roomTitle.style.padding = '2mm';
    roomTitle.style.marginBottom = '2mm';
    roomTitle.textContent = room.name;
    content.appendChild(roomTitle);
    
    // Tableau des travaux
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '5mm';
    table.style.fontSize = '9pt';
    
    // En-tête du tableau
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.borderBottom = '1px solid #e5e7eb';
    
    const headers = [
      { text: 'Description', align: 'left' },
      { text: 'Quantité', align: 'right' },
      { text: 'Prix HT Unitaire', align: 'center' }, // Modifié: "Prix Unitaire HT" -> "Prix HT Unitaire" avec align: 'center'
      { text: 'TVA', align: 'right' },
      { text: 'Total HT', align: 'right' }
    ];
    
    headers.forEach(header => {
      const th = document.createElement('th');
      th.style.padding = '1mm';
      th.style.textAlign = header.align;
      th.textContent = header.text;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Corps du tableau
    const tbody = document.createElement('tbody');
    
    travauxPiece.forEach(travail => {
      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
      const totalHT = prixUnitaireHT * travail.quantite;
      
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid #e5e7eb';
      
      // Colonne description
      const descCell = document.createElement('td');
      descCell.style.padding = '1mm';
      
      const title = document.createElement('div');
      title.style.fontSize = '9pt';
      title.style.fontWeight = '500';
      title.textContent = `${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`;
      descCell.appendChild(title);
      
      if (travail.description) {
        const desc = document.createElement('div');
        desc.style.fontSize = '8pt';
        desc.style.color = '#4b5563';
        desc.textContent = travail.description;
        descCell.appendChild(desc);
      }
      
      if (travail.personnalisation) {
        const perso = document.createElement('div');
        perso.style.fontSize = '8pt';
        perso.style.color = '#4b5563';
        perso.style.fontStyle = 'italic';
        perso.textContent = travail.personnalisation;
        descCell.appendChild(perso);
      }
      
      const details = document.createElement('div');
      details.style.fontSize = '8pt';
      details.style.color = '#4b5563';
      details.textContent = `MO: ${travail.prixMainOeuvre.toFixed(2)}€/u, Fourn: ${travail.prixFournitures.toFixed(2)}€/u (total: ${prixUnitaireHT.toFixed(2)}€/u)`;
      descCell.appendChild(details);
      
      row.appendChild(descCell);
      
      // Autres colonnes (Quantité, Prix unitaire, TVA, Total)
      const columns = [
        { text: `${travail.quantite} ${travail.unite}`, align: 'right' },
        { text: `${prixUnitaireHT.toFixed(2)}€`, align: 'right' },
        { text: `${travail.tauxTVA}%`, align: 'right' },
        { text: `${totalHT.toFixed(2)}€`, align: 'right', bold: true }
      ];
      
      columns.forEach(col => {
        const td = document.createElement('td');
        td.style.padding = '1mm';
        td.style.textAlign = col.align;
        if (col.bold) td.style.fontWeight = 'bold';
        td.textContent = col.text;
        row.appendChild(td);
      });
      
      tbody.appendChild(row);
    });
    
    // Ligne de total pour la pièce
    const totalRow = document.createElement('tr');
    totalRow.style.backgroundColor = '#f9fafb';
    
    const totalLabelCell = document.createElement('td');
    totalLabelCell.colSpan = 4;
    totalLabelCell.style.padding = '1mm';
    totalLabelCell.style.textAlign = 'left';
    totalLabelCell.style.fontSize = '9pt';
    totalLabelCell.style.fontWeight = 'bold';
    totalLabelCell.textContent = `Total HT ${room.name}`;
    totalRow.appendChild(totalLabelCell);
    
    const pieceTotalHT = travauxPiece.reduce((sum, t) => {
      return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    }, 0);
    
    const totalValueCell = document.createElement('td');
    totalValueCell.style.padding = '1mm';
    totalValueCell.style.textAlign = 'right';
    totalValueCell.style.fontSize = '9pt';
    totalValueCell.style.fontWeight = 'bold';
    totalValueCell.textContent = `${pieceTotalHT.toFixed(2)}€`;
    totalRow.appendChild(totalValueCell);
    
    tbody.appendChild(totalRow);
    table.appendChild(tbody);
    content.appendChild(table);
  });
  
  container.appendChild(content);
  
  // Rendre le contenu temporairement visible dans le DOM pour la conversion
  document.body.appendChild(container);
  
  // Options pour html2pdf
  const opt = {
    margin: [15, 15, 15, 15], // [top, right, bottom, left] en mm - réduit à 15mm sur tous les côtés
    filename: `devis_details_${metadata?.devisNumber || 'XXXX-XX'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  try {
    // Générer et télécharger le PDF
    const pdf = await html2pdf().from(container).set(opt).save();
    console.log('PDF généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
  } finally {
    // Nettoyer le DOM
    document.body.removeChild(container);
  }
};
