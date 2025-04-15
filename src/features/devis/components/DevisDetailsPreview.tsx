
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { PrintableField, CompanyInfo, PDF_CONFIG, formatDate, PDFStyle } from "../services/pdfGenerationService";

// Initialiser pdfMake avec les polices
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

interface DevisDetailsPreviewProps {
  fields: PrintableField[];
  company: CompanyInfo | null;
  onClose: () => void;
}

export const DevisDetailsPreview: React.FC<DevisDetailsPreviewProps> = ({
  fields,
  company,
  onClose
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const { state } = useProject();
  const { travaux, getTravauxForPiece } = useTravaux();
  const { property, rooms } = state;
  
  // Récupérer les valeurs des champs imprimables
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  
  // Calculer les totaux
  const calculateRoomTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;
    
    rooms.forEach(room => {
      const roomTravaux = getTravauxForPiece(room.id);
      roomTravaux.forEach(travail => {
        const prixHT = travail.prixHT || 0;
        const tauxTVA = travail.tauxTVA || 20;
        const montantTVA = (prixHT * tauxTVA) / 100;
        
        totalHT += prixHT;
        totalTVA += montantTVA;
        totalTTC += prixHT + montantTVA;
      });
    });
    
    return { totalHT, totalTVA, totalTTC };
  };
  
  const { totalHT, totalTVA, totalTTC } = calculateRoomTotals();
  
  // Fonction pour générer le PDF
  const createDocDefinition = () => {
    // Déterminer le nombre total de pages
    const totalPages = 2; // 1 pour les détails + 1 pour le récapitulatif
    
    // Définitions des styles
    const styles: Record<string, PDFStyle> = {
      header: {
        fontSize: 10,
        color: PDF_CONFIG.DARK_BLUE
      },
      subheader: {
        fontSize: 10,
        color: PDF_CONFIG.DARK_BLUE
      },
      tableHeader: {
        fontSize: 9,
        color: PDF_CONFIG.DARK_BLUE
      },
      tableContent: {
        fontSize: 9,
        color: PDF_CONFIG.DARK_BLUE
      },
      totalRow: {
        fontSize: 10,
        color: PDF_CONFIG.DARK_BLUE
      }
    };
    
    // Contenu du document
    const content: any[] = [
      // En-tête
      {
        columns: [
          { width: '*', text: '' },
          { 
            width: 'auto', 
            text: `DEVIS N° ${devisNumber || ''} - Page 1/${totalPages}`,
            style: 'header',
            alignment: 'right'
          }
        ]
      },
      { text: `Date: ${formatDate(devisDate)}`, style: 'subheader' },
      { text: `Client: ${client || ''}`, style: 'subheader' },
      { text: `Description: ${projectDescription || ''}`, style: 'subheader' },
      { text: 'DÉTAIL DES PRESTATIONS', style: 'header', alignment: 'center' },
    ];
    
    // Ajouter les tableaux de travaux par pièce
    rooms.forEach(room => {
      const roomTravaux = getTravauxForPiece(room.id);
      
      // Si pas de travaux pour cette pièce, ne pas l'inclure
      if (roomTravaux.length === 0) return;
      
      // Calculer les totaux pour cette pièce
      let roomTotalHT = 0;
      
      roomTravaux.forEach(travail => {
        roomTotalHT += travail.prixHT || 0;
      });
      
      // Données pour le tableau
      const tableBody = [
        [
          { text: 'Désignation', style: 'tableHeader' },
          { text: 'Qté', style: 'tableHeader', alignment: 'center' },
          { text: 'Unité', style: 'tableHeader', alignment: 'center' },
          { text: 'Prix U.HT', style: 'tableHeader', alignment: 'right' },
          { text: 'TVA %', style: 'tableHeader', alignment: 'center' },
          { text: 'Total HT', style: 'tableHeader', alignment: 'right' }
        ],
        ...roomTravaux.map(travail => {
          const prixUnitaireHT = travail.prixUnitaireHT || 0;
          const quantite = travail.quantite || 0;
          const prixHT = travail.prixHT || 0;
          
          return [
            { text: travail.description || travail.sousTypeLabel || 'Sans nom', style: 'tableContent', alignment: 'left' },
            { text: quantite.toString(), style: 'tableContent', alignment: 'center' },
            { text: travail.unite || 'U', style: 'tableContent', alignment: 'center' },
            { text: prixUnitaireHT.toFixed(2) + ' €', style: 'tableContent', alignment: 'right' },
            { text: (travail.tauxTVA || 20).toString() + ' %', style: 'tableContent', alignment: 'center' },
            { text: prixHT.toFixed(2) + ' €', style: 'tableContent', alignment: 'right' }
          ];
        }),
        [
          { text: 'Total Pièce', colSpan: 5, style: 'totalRow' },
          {}, {}, {}, {},
          { text: roomTotalHT.toFixed(2) + ' €', style: 'totalRow', alignment: 'right' }
        ]
      ];
      
      content.push(
        { text: `PIÈCE: ${room.name}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          },
          layout: {
            hLineWidth: function(i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function() {
              return 0; // Aucune ligne verticale
            },
            hLineColor: function(i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? '#aaa' : '#ddd';
            }
          }
        }
      );
    });
    
    // Ajouter le saut de page pour le récapitulatif global
    content.push(
      { text: '', pageBreak: 'before' }
    );
    
    // Récapitulatif global sur une nouvelle page
    content.push(
      {
        columns: [
          { width: '*', text: '' },
          { 
            width: 'auto', 
            text: `DEVIS N° ${devisNumber || ''} - Page 2/${totalPages}`,
            style: 'header',
            alignment: 'right'
          }
        ]
      },
      { text: 'RÉCAPITULATIF GLOBAL', style: 'header', alignment: 'center' },
      {
        table: {
          headerRows: 0,
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Total HT', style: 'totalRow', alignment: 'left' },
              { text: totalHT.toFixed(2) + ' €', style: 'totalRow', alignment: 'right' }
            ],
            [
              { text: 'TVA', style: 'totalRow', alignment: 'left' },
              { text: totalTVA.toFixed(2) + ' €', style: 'totalRow', alignment: 'right' }
            ],
            [
              { text: 'Total TTC', style: 'totalRow', alignment: 'left' },
              { text: totalTTC.toFixed(2) + ' €', style: 'totalRow', alignment: 'right' }
            ]
          ]
        },
        layout: {
          hLineWidth: function() { return 1; },
          vLineWidth: function() { return 0; }, // Aucune ligne verticale
          hLineColor: function() { return '#aaa'; }
        }
      },
      
      // Mentions légales et conditions
      { text: 'Mentions et Conditions', style: 'subheader' },
      { text: 'Le présent devis est valable 3 mois à compter de sa date d\'émission. Paiement selon conditions générales de vente.', style: 'tableContent' },
      { text: 'TVA non récupérable pour les travaux de rénovation de l\'habitat privé de plus de 2 ans.', style: 'tableContent' },
      { text: 'Date et Signature (précédées de la mention "Bon pour accord")', style: 'subheader' }
    );
    
    // Pied de page avec numérotation
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 40],
      content: content,
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 7,
          color: PDF_CONFIG.DARK_BLUE,
          alignment: 'center',
          margin: [20, 10, 20, 0]
        };
      },
      styles: styles,
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        color: PDF_CONFIG.DARK_BLUE,
        lineHeight: 1.3
      }
    };
    
    return docDefinition;
  };

  const handleExportPDF = () => {
    pdfMake.createPdf(createDocDefinition()).download(`devis-details-${devisNumber || 'preview'}.pdf`);
  };

  const handlePrint = () => {
    pdfMake.createPdf(createDocDefinition()).open();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto font-roboto" 
        aria-describedby="devis-details-preview-description"
      >
        <div id="devis-details-preview-description" className="sr-only">
          Aperçu détaillé du devis
        </div>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu détaillé du devis</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {/* Contenu du document */}
        <div ref={printContentRef} className="p-5 rounded-md my-4 bg-white">
          <div className="text-right mb-4">
            <h1 className="text-xl" style={{ color: PDF_CONFIG.DARK_BLUE }}>
              DEVIS N° {devisNumber || ''} - Page 1/2
            </h1>
          </div>
          
          <p style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
            Date: {formatDate(devisDate)}
          </p>
          <p style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
            Client: {client || ''}
          </p>
          <p style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px', marginBottom: '20px' }}>
            Description: {projectDescription || ''}
          </p>
          
          <h2 className="text-center mb-4" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
            DÉTAIL DES PRESTATIONS
          </h2>
          
          {/* Tableau des travaux par pièce */}
          {rooms.map(room => {
            const roomTravaux = getTravauxForPiece(room.id);
            if (roomTravaux.length === 0) return null;
            
            // Calculer les totaux pour cette pièce
            let roomTotalHT = 0;
            
            roomTravaux.forEach(travail => {
              roomTotalHT += travail.prixHT || 0;
            });
            
            return (
              <div key={room.id} className="mb-6">
                <h3 className="mt-6 mb-2" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
                  PIÈCE: {room.name}
                </h3>
                <table className="w-full border-collapse text-xs" style={{ fontSize: '9px' }}>
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border-b border-t p-1 text-left" style={{ color: PDF_CONFIG.DARK_BLUE }}>Désignation</th>
                      <th className="border-b border-t p-1 text-center" style={{ color: PDF_CONFIG.DARK_BLUE }}>Qté</th>
                      <th className="border-b border-t p-1 text-center" style={{ color: PDF_CONFIG.DARK_BLUE }}>Unité</th>
                      <th className="border-b border-t p-1 text-right" style={{ color: PDF_CONFIG.DARK_BLUE }}>Prix U.HT</th>
                      <th className="border-b border-t p-1 text-center" style={{ color: PDF_CONFIG.DARK_BLUE }}>TVA %</th>
                      <th className="border-b border-t p-1 text-right" style={{ color: PDF_CONFIG.DARK_BLUE }}>Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTravaux.map(travail => (
                      <tr key={travail.id}>
                        <td className="border-b p-1" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                          {travail.description || travail.sousTypeLabel || 'Sans nom'}
                        </td>
                        <td className="border-b p-1 text-center" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                          {travail.quantite || 0}
                        </td>
                        <td className="border-b p-1 text-center" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                          {travail.unite || 'U'}
                        </td>
                        <td className="border-b p-1 text-right" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                          {(travail.prixUnitaireHT || 0).toFixed(2)} €
                        </td>
                        <td className="border-b p-1 text-center" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                          {travail.tauxTVA || 20} %
                        </td>
                        <td className="border-b p-1 text-right" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                          {(travail.prixHT || 0).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td colSpan={5} className="border-b border-t p-1" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                        Total Pièce
                      </td>
                      <td className="border-b border-t p-1 text-right" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                        {roomTotalHT.toFixed(2)} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
          
          {/* Nouvelle page pour le récapitulatif global */}
          <div className="mt-10 page-break-before">
            <div className="text-right mb-4">
              <h1 className="text-xl" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                DEVIS N° {devisNumber || ''} - Page 2/2
              </h1>
            </div>
            
            <h2 className="text-center mb-4" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
              RÉCAPITULATIF GLOBAL
            </h2>
            
            <table className="w-full max-w-md mx-auto border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border-b border-t p-2" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>Total HT</td>
                  <td className="border-b border-t p-2 text-right" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>{totalHT.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td className="border-b p-2" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>TVA</td>
                  <td className="border-b p-2 text-right" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>{totalTVA.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td className="border-b p-2" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>Total TTC</td>
                  <td className="border-b p-2 text-right" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>{totalTTC.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
            
            {/* Mentions légales */}
            <div className="mt-10">
              <h3 className="mb-2" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
                Mentions et Conditions
              </h3>
              <p style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '9px', marginBottom: '5px' }}>
                Le présent devis est valable 3 mois à compter de sa date d'émission. Paiement selon conditions générales de vente.
              </p>
              <p style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '9px', marginBottom: '20px' }}>
                TVA non récupérable pour les travaux de rénovation de l'habitat privé de plus de 2 ans.
              </p>
            </div>
            
            {/* Signature */}
            <div className="mt-10">
              <p style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '10px' }}>
                Date et Signature (précédées de la mention "Bon pour accord")
              </p>
              <div className="h-24 border border-dashed border-gray-300 mt-2"></div>
            </div>
          </div>
          
          {/* Pied de page */}
          <div className="text-center mt-16" style={{ color: PDF_CONFIG.DARK_BLUE, fontSize: '7px' }}>
            {company?.name} - SASU au Capital de {company?.capital_social || "10000"} € - {company?.address} {company?.postal_code} {company?.city} - Siret : {company?.siret} - Code APE : {company?.code_ape} - N° TVA Intracommunautaire : {company?.tva_intracom}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button onClick={handleExportPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
