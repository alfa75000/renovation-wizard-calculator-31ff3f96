import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { PrintableField, CompanyInfo, PDF_CONFIG, formatDate } from "../services/pdfGenerationService";

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
    // Définitions des styles
    const styles = {
      header: {
        fontSize: 10,
        margin: [0, 0, 0, 10],
        color: PDF_CONFIG.DARK_BLUE
      },
      subheader: {
        fontSize: 10,
        margin: [0, 10, 0, 5],
        color: PDF_CONFIG.DARK_BLUE
      },
      tableHeader: {
        fontSize: 9,
        color: PDF_CONFIG.DARK_BLUE
      },
      totalRow: {
        fontSize: 10
      }
    };
    
    // Contenu du document
    return {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      
      content: [
        // En-tête
        {
          text: `DEVIS N° ${devisNumber || ''}`,
          style: 'header',
          alignment: 'center'
        },
        { text: `Date: ${formatDate(devisDate)}`, style: 'subheader' },
        { text: `Client: ${client || ''}`, style: 'subheader' },
        { text: `Description: ${projectDescription || ''}`, style: 'subheader' },
        { text: 'DÉTAIL DES PRESTATIONS', style: 'header', alignment: 'center' },
        
        // Tableau récapitulatif par pièce
        ...rooms.map(room => {
          const roomTravaux = getTravauxForPiece(room.id);
          
          // Si pas de travaux pour cette pièce, ne pas l'inclure
          if (roomTravaux.length === 0) return null;
          
          // Calculer les totaux pour cette pièce
          let roomTotalHT = 0;
          let roomTotalTVA = 0;
          let roomTotalTTC = 0;
          
          roomTravaux.forEach(travail => {
            const prixHT = travail.prixHT || 0;
            const tauxTVA = travail.tauxTVA || 20;
            const montantTVA = (prixHT * tauxTVA) / 100;
            
            roomTotalHT += prixHT;
            roomTotalTVA += montantTVA;
            roomTotalTTC += prixHT + montantTVA;
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
                { text: travail.designation || travail.nom || 'Sans nom', alignment: 'left' },
                { text: quantite.toString(), alignment: 'center' },
                { text: travail.unite || 'U', alignment: 'center' },
                { text: prixUnitaireHT.toFixed(2) + ' €', alignment: 'right' },
                { text: (travail.tauxTVA || 20).toString() + ' %', alignment: 'center' },
                { text: prixHT.toFixed(2) + ' €', alignment: 'right' }
              ];
            }),
            [
              { text: 'Total Pièce', style: 'totalRow', colSpan: 5 },
              {}, {}, {}, {},
              { text: roomTotalHT.toFixed(2) + ' €', style: 'totalRow', alignment: 'right' }
            ]
          ];
          
          return [
            { text: `PIÈCE: ${room.name}`, style: 'subheader', margin: [0, 15, 0, 5] },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: tableBody
              },
              layout: {
                hLineWidth: function(i, node) {
                  return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
                },
                vLineWidth: function() {
                  return 0; // Aucune ligne verticale
                },
                hLineColor: function(i, node) {
                  return (i === 0 || i === 1 || i === node.table.body.length) ? '#aaa' : '#ddd';
                }
              }
            }
          ];
        }).filter(Boolean),
        
        // Récapitulatif global
        { text: 'RÉCAPITULATIF GLOBAL', style: 'header', alignment: 'center', margin: [0, 30, 0, 10] },
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
            hLineWidth: function(i) {
              return 1;
            },
            vLineWidth: function() {
              return 0; // Aucune ligne verticale
            },
            hLineColor: function() {
              return '#aaa';
            }
          }
        },
        
        // Mentions légales et conditions
        {
          text: 'Mentions et Conditions',
          style: 'subheader',
          margin: [0, 30, 0, 5]
        },
        {
          text: 'Le présent devis est valable 3 mois à compter de sa date d\'émission. Paiement selon conditions générales de vente.',
          margin: [0, 0, 0, 5],
          fontSize: 9
        },
        {
          text: 'TVA non récupérable pour les travaux de rénovation de l\'habitat privé de plus de 2 ans.',
          margin: [0, 0, 0, 15],
          fontSize: 9
        },
        {
          text: 'Date et Signature (précédées de la mention "Bon pour accord")',
          style: 'subheader',
          margin: [0, 30, 0, 50]
        },
        
        // Pied de page
        {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 7,
          color: PDF_CONFIG.DARK_BLUE,
          alignment: 'center',
          margin: [0, 50, 0, 0],
          absolutePosition: { x: 20, y: 800 }
        }
      ],
      
      styles: styles,
      
      defaultStyle: {
        font: 'Roboto',
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        lineHeight: 1.3
      }
    };
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
          <h1 className="text-center text-xl font-bold mb-6" style={{ color: PDF_CONFIG.DARK_BLUE }}>
            DEVIS N° {devisNumber || ''}
          </h1>
          
          <p className="font-semibold" style={{ color: PDF_CONFIG.DARK_BLUE }}>
            Date: {formatDate(devisDate)}
          </p>
          <p className="font-semibold" style={{ color: PDF_CONFIG.DARK_BLUE }}>
            Client: {client || ''}
          </p>
          <p className="font-semibold mb-6" style={{ color: PDF_CONFIG.DARK_BLUE }}>
            Description: {projectDescription || ''}
          </p>
          
          <h2 className="text-center text-lg font-bold mt-6 mb-4" style={{ color: PDF_CONFIG.DARK_BLUE }}>
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
                <h3 className="font-semibold mt-6 mb-2" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                  PIÈCE: {room.name}
                </h3>
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-1 text-left">Désignation</th>
                      <th className="border border-gray-300 p-1 text-center">Qté</th>
                      <th className="border border-gray-300 p-1 text-center">Unité</th>
                      <th className="border border-gray-300 p-1 text-right">Prix U.HT</th>
                      <th className="border border-gray-300 p-1 text-center">TVA %</th>
                      <th className="border border-gray-300 p-1 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTravaux.map(travail => (
                      <tr key={travail.id}>
                        <td className="border border-gray-300 p-1">
                          {travail.designation || travail.nom || 'Sans nom'}
                        </td>
                        <td className="border border-gray-300 p-1 text-center">
                          {travail.quantite || 0}
                        </td>
                        <td className="border border-gray-300 p-1 text-center">
                          {travail.unite || 'U'}
                        </td>
                        <td className="border border-gray-300 p-1 text-right">
                          {(travail.prixUnitaireHT || 0).toFixed(2)} €
                        </td>
                        <td className="border border-gray-300 p-1 text-center">
                          {travail.tauxTVA || 20} %
                        </td>
                        <td className="border border-gray-300 p-1 text-right">
                          {(travail.prixHT || 0).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-gray-100">
                      <td colSpan={5} className="border border-gray-300 p-1">
                        Total Pièce
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        {roomTotalHT.toFixed(2)} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
          
          {/* Récapitulatif global */}
          <h2 className="text-center text-lg font-bold mt-10 mb-4" style={{ color: PDF_CONFIG.DARK_BLUE }}>
            RÉCAPITULATIF GLOBAL
          </h2>
          
          <table className="w-full max-w-md mx-auto border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr className="font-semibold">
                <td className="border border-gray-300 p-2">Total HT</td>
                <td className="border border-gray-300 p-2 text-right">{totalHT.toFixed(2)} €</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 p-2">TVA</td>
                <td className="border border-gray-300 p-2 text-right">{totalTVA.toFixed(2)} €</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 p-2">Total TTC</td>
                <td className="border border-gray-300 p-2 text-right">{totalTTC.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
          
          {/* Mentions légales */}
          <div className="mt-10">
            <h3 className="font-semibold mb-2" style={{ color: PDF_CONFIG.DARK_BLUE }}>
              Mentions et Conditions
            </h3>
            <p className="text-xs mb-1">
              Le présent devis est valable 3 mois à compter de sa date d'émission. Paiement selon conditions générales de vente.
            </p>
            <p className="text-xs mb-6">
              TVA non récupérable pour les travaux de rénovation de l'habitat privé de plus de 2 ans.
            </p>
          </div>
          
          {/* Signature */}
          <div className="mt-10">
            <p className="font-semibold" style={{ color: PDF_CONFIG.DARK_BLUE }}>
              Date et Signature (précédées de la mention "Bon pour accord")
            </p>
            <div className="h-24 border border-dashed border-gray-300 mt-2"></div>
          </div>
          
          {/* Pied de page */}
          <div className="text-center text-[7px] mt-16" style={{ color: PDF_CONFIG.DARK_BLUE }}>
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
