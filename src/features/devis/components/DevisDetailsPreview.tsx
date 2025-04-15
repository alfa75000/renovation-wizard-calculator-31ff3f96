
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
import { calculerTotalHTTravaux } from "@/features/travaux/utils/travauxUtils";

interface DevisDetailsPreviewProps {
  rooms: Room[];
  travaux: Travail[];
  company: Company | null;
  getTravauxForPiece: (pieceId: string) => Travail[];
  onClose: () => void;
}

export const DevisDetailsPreview: React.FC<DevisDetailsPreviewProps> = ({
  rooms,
  travaux,
  company,
  getTravauxForPiece,
  onClose
}) => {
  const [logoExists, setLogoExists] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [docDefinition, setDocDefinition] = useState<any>(null);

  // Charger le logo et générer la définition du document
  useEffect(() => {
    const loadLogoAndCreateDoc = async () => {
      // Charger le logo
      const { dataUrl, exists } = await convertImageToDataUrl(PDF_CONSTANTS.LOGO_PATH);
      setLogoDataUrl(dataUrl);
      setLogoExists(exists);
      
      // Créer la définition du document pour les détails des travaux
      createDetailsDocDefinition(dataUrl, exists);
    };
    
    loadLogoAndCreateDoc();
  }, [rooms, travaux, company]);

  // Fonction pour créer la définition du document de détails
  const createDetailsDocDefinition = (logoDataUrl: string | null, logoExists: boolean) => {
    // Créer un contenu pour chaque pièce avec ses travaux
    const content: any[] = [];
    
    // En-tête standard
    content.push(createStandardHeader(company, logoDataUrl, logoExists, "Détails des travaux"));
    
    // Pour chaque pièce avec des travaux
    rooms.forEach(room => {
      const travauxPiece = getTravauxForPiece(room.id);
      if (travauxPiece.length === 0) return;
      
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
          color: PDF_CONSTANTS.DARK_BLUE
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
      title="Aperçu des détails des travaux"
      fileName="details-travaux.pdf"
    />
  );
};

export default DevisDetailsPreview;
