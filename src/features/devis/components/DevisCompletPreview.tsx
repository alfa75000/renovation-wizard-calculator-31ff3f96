
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

interface DevisCompletPreviewProps {
  fields: PrintableField[];
  company: CompanyInfo | null;
  onClose: () => void;
  logoDataUrl: string | null;
}

export const DevisCompletPreview: React.FC<DevisCompletPreviewProps> = ({
  fields,
  company,
  onClose,
  logoDataUrl
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const { state } = useProject();
  const { travaux, getTravauxForPiece } = useTravaux();
  const { property, rooms } = state;
  
  // Récupérer les valeurs des champs imprimables
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
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
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
        color: PDF_CONFIG.DARK_BLUE
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
        color: PDF_CONFIG.DARK_BLUE
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: PDF_CONFIG.DARK_BLUE
      },
      totalRow: {
        bold: true,
        fontSize: 12
      }
    };
    
    // Contenu du document - Page de garde
    const coverPageContent = [
      // Logo et informations d'assurance
      {
        columns: [
          // Logo à gauche
          {
            width: '60%',
            stack: [
              logoDataUrl ? {
                image: logoDataUrl,
                width: 172,
                height: 72,
                margin: [0, 0, 0, 0]
              } : { text: '', margin: [0, 40, 0, 0] }
            ]
          },
          // Assurance à droite
          {
            width: '40%',
            stack: [
              { text: 'Assurance MAAF PRO', fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE, color: PDF_CONFIG.DARK_BLUE },
              { text: 'Responsabilité civile', fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE, color: PDF_CONFIG.DARK_BLUE },
              { text: 'Responsabilité civile décennale', fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE, color: PDF_CONFIG.DARK_BLUE }
            ],
            alignment: 'right'
          }
        ]
      },
      
      // Slogan - Aligné en colonne 1
      {
        text: company?.slogan || 'Entreprise Générale du Bâtiment',
        fontSize: 12,
        bold: true,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [0, 10, 0, 20]
      },
      
      // Coordonnées société - Nom et adresse combinés
      {
        text: `Société ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
        fontSize: 11,
        bold: true,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [0, 0, 0, 3]
      },
      
      // Tél et Mail
      {
        columns: [
          {
            width: PDF_CONFIG.COLUMN1_WIDTH,
            text: 'Tél:',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE
          },
          {
            width: '*',
            text: company?.tel1 || '',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE
          }
        ],
        columnGap: 1,
        margin: [0, 3, 0, 0]
      },
      
      company?.tel2 ? {
        columns: [
          {
            width: PDF_CONFIG.COLUMN1_WIDTH,
            text: '',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE
          },
          {
            width: '*',
            text: company.tel2,
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE
          }
        ],
        columnGap: 1,
        margin: [0, 0, 0, 0]
      } : null,
      
      {
        columns: [
          {
            width: PDF_CONFIG.COLUMN1_WIDTH,
            text: 'Mail:',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE
          },
          {
            width: '*',
            text: company?.email || '',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE
          }
        ],
        columnGap: 1,
        margin: [0, 5, 0, 0]
      },
      
      // Espace avant devis
      { text: '', margin: [0, 30, 0, 0] },
      
      // Numéro et date du devis
      {
        columns: [
          {
            width: PDF_CONFIG.COLUMN1_WIDTH,
            text: '',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE
          },
          {
            width: '*',
            text: [
              { text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `, fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE, color: PDF_CONFIG.DARK_BLUE },
              { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: PDF_CONFIG.DARK_BLUE }
            ]
          }
        ],
        columnGap: 1,
        margin: [0, 0, 0, 0]
      },
      
      // Espace avant Client
      { text: '', margin: [0, 35, 0, 0] },
      
      // Client - Titre aligné en colonne 2
      {
        columns: [
          { width: PDF_CONFIG.COLUMN1_WIDTH, text: '', fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE },
          { 
            width: '*', 
            text: 'Client / Maître d\'ouvrage',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE
          }
        ],
        columnGap: 1
      },
      
      // Client - Contenu avec sauts de ligne préservés
      {
        columns: [
          { width: PDF_CONFIG.COLUMN1_WIDTH, text: '', fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE },
          { 
            width: '*', 
            text: client || '',
            fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
            color: PDF_CONFIG.DARK_BLUE,
            lineHeight: 1.3
          }
        ],
        columnGap: 15,
        margin: [0, 5, 0, 0]
      },
      
      // Espacement
      { text: '', margin: [0, 25, 0, 0] },
      
      // Chantier - Titre et contenu alignés en colonne 1
      {
        text: 'Chantier / Travaux',
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [0, 0, 0, 5]
      },
      
      // Occupant
      occupant ? {
        text: occupant,
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [0, 5, 0, 0]
      } : null,
      
      // Adresse du chantier
      projectAddress ? {
        text: 'Adresse du chantier / lieu d\'intervention:',
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [0, 5, 0, 0]
      } : null,
      
      projectAddress ? {
        text: projectAddress,
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [10, 3, 0, 0]
      } : null,
      
      // Descriptif
      projectDescription ? {
        text: 'Descriptif:',
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [0, 8, 0, 0]
      } : null,
      
      projectDescription ? {
        text: projectDescription,
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [10, 3, 0, 0]
      } : null,
      
      // Informations complémentaires
      additionalInfo ? {
        text: additionalInfo,
        fontSize: PDF_CONFIG.DEFAULT_FONT_SIZE,
        color: PDF_CONFIG.DARK_BLUE,
        margin: [10, 15, 0, 0]
      } : null,
      
      // Pied de page
      {
        text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
        fontSize: 7,
        color: PDF_CONFIG.DARK_BLUE,
        alignment: 'center',
        absolutePosition: { x: 20, y: 800 }
      }
    ].filter(Boolean);
    
    // Pages détaillées - Contenu du détail du devis
    const detailPageContent = [
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
      
      detailPageContent.push(
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
            vLineWidth: function(i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
            },
            hLineColor: function(i, node) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? '#aaa' : '#ddd';
            },
            vLineColor: function(i, node) {
              return (i === 0 || i === node.table.widths.length) ? '#aaa' : '#ddd';
            }
          }
        }
      );
    });
    
    // Ajouter le récapitulatif
    detailPageContent.push(
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
          hLineWidth: function(i, node) { return 1; },
          vLineWidth: function(i, node) { return 1; },
          hLineColor: function(i) { return '#aaa'; },
          vLineColor: function(i) { return '#aaa'; }
        }
      },
      
      // Mentions légales
      {
        text: 'Mentions et Conditions',
        style: 'subheader',
        margin: [0, 30, 0, 5]
      },
      {
        text: 'Le présent devis est valable 3 mois à compter de sa date d\'émission. Paiement selon conditions générales de vente.',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'TVA non récupérable pour les travaux de rénovation de l\'habitat privé de plus de 2 ans.',
        margin: [0, 0, 0, 15]
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
    );
    
    // Document complet
    return {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      content: [
        // Page de garde
        coverPageContent,
        // Saut de page
        { text: '', pageBreak: 'after' },
        // Pages de détail
        detailPageContent
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
    pdfMake.createPdf(createDocDefinition()).download(`devis-complet-${devisNumber || 'preview'}.pdf`);
  };

  const handlePrint = () => {
    pdfMake.createPdf(createDocDefinition()).open();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto font-roboto" 
        aria-describedby="devis-complet-preview-description"
      >
        <div id="devis-complet-preview-description" className="sr-only">
          Aperçu complet du devis
        </div>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu complet du devis</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-5 space-y-6">
          <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="text-lg font-medium mb-2" style={{ color: PDF_CONFIG.DARK_BLUE }}>
              Aperçu du devis complet
            </h2>
            <p className="text-sm text-gray-600">
              Ce document contient toutes les pages du devis : page de garde, détails des travaux par pièce, et récapitulatif.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Utilisez les boutons ci-dessous pour imprimer ou exporter le devis complet en PDF.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 border rounded-md bg-white">
              <h3 className="font-medium" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                Page de garde
              </h3>
              <p className="text-sm text-gray-600">
                Informations générales, coordonnées du client et du chantier
              </p>
            </div>
            
            <div className="p-3 border rounded-md bg-white">
              <h3 className="font-medium" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                Détails des travaux
              </h3>
              <p className="text-sm text-gray-600">
                Liste détaillée des travaux par pièce ({rooms.filter(r => getTravauxForPiece(r.id).length > 0).length} pièce(s) avec travaux)
              </p>
            </div>
            
            <div className="p-3 border rounded-md bg-white">
              <h3 className="font-medium" style={{ color: PDF_CONFIG.DARK_BLUE }}>
                Récapitulatif
              </h3>
              <p className="text-sm text-gray-600">
                Montant total : {totalTTC.toFixed(2)} € TTC
              </p>
            </div>
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
