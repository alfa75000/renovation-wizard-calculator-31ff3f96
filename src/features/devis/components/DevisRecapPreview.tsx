
import React, { useState, useEffect } from "react";
import { Company, Room, Travail } from "@/types";
import { 
  convertImageToDataUrl,
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

interface DevisRecapPreviewProps {
  rooms: Room[];
  travaux: Travail[];
  company: Company | null;
  getTravauxForPiece: (pieceId: string) => Travail[];
  onClose: () => void;
}

export const DevisRecapPreview: React.FC<DevisRecapPreviewProps> = ({
  rooms,
  travaux,
  company,
  getTravauxForPiece,
  onClose
}) => {
  const [logoExists, setLogoExists] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [docDefinition, setDocDefinition] = useState<any>(null);

  // Calculer les totaux globaux
  const totalHT = calculerTotalHTTravaux(travaux);
  const totalTVA = travaux.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
  const totalTTC = calculerTotalTTCTravaux(travaux);
  
  // Calculer les détails de TVA par taux
  const travauxParTVA = grouperTravauxParTVA(travaux);
  const tauxTVA = Object.keys(travauxParTVA).map(Number).sort();

  // Charger le logo et générer la définition du document
  useEffect(() => {
    const loadLogoAndCreateDoc = async () => {
      // Charger le logo
      const { dataUrl, exists } = await convertImageToDataUrl(PDF_CONSTANTS.LOGO_PATH);
      setLogoDataUrl(dataUrl);
      setLogoExists(exists);
      
      // Créer la définition du document pour le récapitulatif
      createRecapDocDefinition(dataUrl, exists);
    };
    
    loadLogoAndCreateDoc();
  }, [rooms, travaux, company]);

  // Fonction pour créer la définition du document de récapitulatif
  const createRecapDocDefinition = (logoDataUrl: string | null, logoExists: boolean) => {
    // Créer un contenu pour le récapitulatif
    const content: any[] = [];
    
    // En-tête standard
    content.push(createStandardHeader(company, logoDataUrl, logoExists, "Récapitulatif des travaux"));
    
    // Tableau récapitulatif par pièce
    const tableBody = [
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
      
      tableBody.push([
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
      footer: function(currentPage: number, pageCount: number) { 
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
      title="Aperçu du récapitulatif"
      fileName="recap-travaux.pdf"
    />
  );
};

export default DevisRecapPreview;
