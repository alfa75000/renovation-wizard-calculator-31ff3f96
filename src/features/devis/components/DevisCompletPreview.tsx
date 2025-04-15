
import React, { useState, useEffect } from "react";
import { Company, Room, Travail } from "@/types";
import { 
  convertImageToDataUrl,
  createCoverPageDefinition, 
  createStandardHeader,
  createStandardFooter,
  PDF_CONSTANTS 
} from "../services/pdfGenerationService";
import PdfPreviewDialog from "./PdfPreviewDialog";
import { formaterPrix } from "@/lib/utils";
import { 
  calculerTotalHTTravaux,
  calculerMontantTVA,
  calculerTotalTTCTravaux,
  grouperTravauxParTVA
} from "@/features/travaux/utils/travauxUtils";

interface DevisCompletPreviewProps {
  fields: any[]; // PrintableField[]
  rooms: Room[];
  travaux: Travail[];
  company: Company | null;
  getTravauxForPiece: (pieceId: string) => Travail[];
  onClose: () => void;
}

export const DevisCompletPreview: React.FC<DevisCompletPreviewProps> = ({
  fields,
  rooms,
  travaux,
  company,
  getTravauxForPiece,
  onClose
}) => {
  const [logoExists, setLogoExists] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [docDefinition, setDocDefinition] = useState<any>(null);

  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;

  // Charger le logo et générer la définition du document
  useEffect(() => {
    const loadLogoAndCreateDoc = async () => {
      // Charger le logo
      const { dataUrl, exists } = await convertImageToDataUrl(PDF_CONSTANTS.LOGO_PATH);
      setLogoDataUrl(dataUrl);
      setLogoExists(exists);
      
      // Créer la définition du document complet
      createCompleteDocDefinition(dataUrl, exists);
    };
    
    loadLogoAndCreateDoc();
  }, [fields, rooms, travaux, company]);

  // Fonction pour créer la définition du document complet
  const createCompleteDocDefinition = (logoDataUrl: string | null, logoExists: boolean) => {
    // Array pour stocker toutes les définitions de pages
    const content: any[] = [];
    
    // 1. Page de garde
    const coverPageContent = createCoverPageDefinition(fields, company, logoDataUrl, logoExists).content;
    content.push(...coverPageContent);
    
    // Saut de page après la page de garde
    content.push({ text: '', pageBreak: 'after' });
    
    // 2. Pages de détails des travaux
    content.push(createStandardHeader(company, logoDataUrl, logoExists, "Détails des travaux"));
    
    // Pour chaque pièce avec des travaux
    let hasContent = false;
    rooms.forEach(room => {
      const travauxPiece = getTravauxForPiece(room.id);
      if (travauxPiece.length === 0) return;
      
      hasContent = true;
      // Calculer le total HT pour cette pièce
      const totalHT = calculerTotalHTTravaux(travauxPiece);
      
      // Ajouter le nom de la pièce
      content.push({
        text: room.name,
        fontSize: 12,
        bold: true,
        color: PDF_CONSTANTS.DARK_BLUE,
        margin: [0, 15, 0, 5]
      });
      
      // Tableau des travaux pour la pièce
      const tableBody = [
        // En-tête du tableau
        [
          { text: 'Description', style: 'tableHeader', alignment: 'left' },
          { text: 'Quantité', style: 'tableHeader', alignment: 'right' },
          { text: 'Prix Unitaire HT', style: 'tableHeader', alignment: 'center' },
          { text: 'TVA', style: 'tableHeader', alignment: 'right' },
          { text: 'Total HT', style: 'tableHeader', alignment: 'right' }
        ]
      ];
      
      // Ajouter chaque travail au tableau
      travauxPiece.forEach(travail => {
        tableBody.push([
          { text: travail.description, style: 'tableCell', alignment: 'left' },
          { text: `${travail.quantite} ${travail.unite}`, style: 'tableCell', alignment: 'right' },
          { text: formaterPrix(travail.prixFournitures + travail.prixMainOeuvre), style: 'tableCell', alignment: 'right' },
          { text: `${travail.tauxTVA}%`, style: 'tableCell', alignment: 'right' },
          { text: formaterPrix((travail.prixFournitures + travail.prixMainOeuvre) * travail.quantite), style: 'tableCell', alignment: 'right' }
        ]);
      });
      
      // Ajouter la ligne de total pour cette pièce
      tableBody.push([
        { text: `Total HT ${room.name}`, style: 'tableTotal', alignment: 'left', bold: true },
        { text: '', style: 'tableTotal' },
        { text: '', style: 'tableTotal' },
        { text: '', style: 'tableTotal' },
        { text: formaterPrix(totalHT), style: 'tableTotal', alignment: 'right', bold: true }
      ]);
      
      // Ajouter le tableau au contenu
      content.push({
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody
        },
        layout: {
          hLineWidth: function(i: number, node: any) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
          },
          vLineWidth: function() {
            return 0;
          },
          hLineColor: function(i: number) {
            return i === 1 ? '#aaa' : '#ddd';
          },
          paddingLeft: function(i: number) {
            return i === 0 ? 0 : 8;
          },
          paddingRight: function(i: number, node: any) {
            return (i === node.table.widths.length - 1) ? 0 : 8;
          },
          paddingTop: function() {
            return 8;
          },
          paddingBottom: function() {
            return 8;
          }
        },
        margin: [0, 0, 0, 15]
      });
    });
    
    if (hasContent) {
      // Ajouter le pied de page standard pour les détails
      content.push(createStandardFooter(company));
      
      // Saut de page après les détails
      content.push({ text: '', pageBreak: 'after' });
    }
    
    // 3. Page de récapitulatif
    // Calculer les totaux globaux
    const totalHT = calculerTotalHTTravaux(travaux);
    const totalTVA = travaux.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
    const totalTTC = calculerTotalTTCTravaux(travaux);
    
    // Calculer les détails de TVA par taux
    const travauxParTVA = grouperTravauxParTVA(travaux);
    const tauxTVA = Object.keys(travauxParTVA).map(Number).sort();
    
    content.push(createStandardHeader(company, logoDataUrl, logoExists, "Récapitulatif des travaux"));
    
    // Tableau récapitulatif par pièce
    const tableBodyRecap = [
      // En-tête du tableau
      [
        { text: 'Désignation', style: 'tableHeader', alignment: 'center' },
        { text: 'Total HT', style: 'tableHeader', alignment: 'right' },
        { text: 'Total TVA', style: 'tableHeader', alignment: 'right' },
        { text: 'Total TTC', style: 'tableHeader', alignment: 'right' }
      ]
    ];
    
    // Ajouter chaque pièce au tableau
    rooms.forEach(room => {
      const travauxPiece = getTravauxForPiece(room.id);
      if (travauxPiece.length === 0) return;
      
      // Calculer les montants pour cette pièce
      const totalHTRoom = calculerTotalHTTravaux(travauxPiece);
      const totalTVARoom = travauxPiece.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
      const totalTTCRoom = calculerTotalTTCTravaux(travauxPiece);
      
      tableBodyRecap.push([
        { text: room.name, style: 'tableCell', alignment: 'left' },
        { text: formaterPrix(totalHTRoom), style: 'tableCell', alignment: 'right' },
        { text: formaterPrix(totalTVARoom), style: 'tableCell', alignment: 'right' },
        { text: formaterPrix(totalTTCRoom), style: 'tableCell', alignment: 'right' }
      ]);
    });
    
    // Ajouter le tableau au contenu
    content.push({
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto'],
        body: tableBodyRecap
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
        },
        vLineWidth: function() {
          return 0;
        },
        hLineColor: function(i: number) {
          return i === 1 ? '#aaa' : '#ddd';
        },
        paddingLeft: function(i: number) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function(i: number, node: any) {
          return (i === node.table.widths.length - 1) ? 0 : 8;
        },
        paddingTop: function() {
          return 8;
        },
        paddingBottom: function() {
          return 8;
        }
      },
      margin: [0, 0, 0, 20]
    });
    
    // Ajouter le tableau de totaux
    content.push({
      table: {
        widths: ['*', 'auto'],
        body: [
          [
            { text: 'Montant Total HT', style: 'tableTotal', alignment: 'right', bold: true },
            { text: formaterPrix(totalHT), style: 'tableTotal', alignment: 'right', bold: true }
          ],
          ...(tauxTVA.map(taux => {
            const travauxTaux = travauxParTVA[taux];
            const totalHTTaux = calculerTotalHTTravaux(travauxTaux);
            const montantTVA = travauxTaux.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
            
            return [
              { text: `TVA ${taux}% (sur ${formaterPrix(totalHTTaux)})`, style: 'tableCell', alignment: 'right' },
              { text: formaterPrix(montantTVA), style: 'tableCell', alignment: 'right' }
            ];
          })),
          [
            { text: 'Montant Total TTC', style: 'tableTotal', alignment: 'right', bold: true },
            { text: formaterPrix(totalTTC), style: 'tableTotal', alignment: 'right', bold: true }
          ]
        ]
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
        },
        vLineWidth: function() {
          return 0;
        },
        hLineColor: function() {
          return '#ddd';
        },
        paddingLeft: function() {
          return 8;
        },
        paddingRight: function() {
          return 8;
        },
        paddingTop: function() {
          return 8;
        },
        paddingBottom: function() {
          return 8;
        }
      },
      margin: [0, 0, 0, 15]
    });
    
    // Ajouter le pied de page standard
    content.push(createStandardFooter(company));
    
    // Définition complète du document
    const doc = {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 50],
      content: content,
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: PDF_CONSTANTS.DARK_BLUE
        },
        tableCell: {
          fontSize: 9,
          color: PDF_CONSTANTS.DARK_BLUE
        },
        tableTotal: {
          fontSize: 10,
          color: PDF_CONSTANTS.DARK_BLUE,
          bold: true
        }
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE,
        color: PDF_CONSTANTS.DARK_BLUE,
        lineHeight: 1.3
      },
      footer: function(currentPage: number, pageCount: number, pageSize: any) {
        // Ne pas ajouter de pied de page à la première page (page de garde)
        if (currentPage === 1) return null;
        
        return { 
          text: `Page ${currentPage.toString()} / ${pageCount.toString()}`,
          alignment: 'center',
          fontSize: 8,
          margin: [0, 10, 0, 0]
        };
      }
    };
    
    setDocDefinition(doc);
  };

  return (
    <PdfPreviewDialog
      open={true}
      onClose={onClose}
      docDefinition={docDefinition}
      title="Aperçu du devis complet"
      fileName={`devis-${devisNumber || 'complet'}.pdf`}
    />
  );
};

export default DevisCompletPreview;
