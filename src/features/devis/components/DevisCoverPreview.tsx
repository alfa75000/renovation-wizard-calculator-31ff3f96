
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import html2pdf from 'html2pdf.js';

// Couleur bleu foncée unifiée pour toute la page
const DARK_BLUE = "#002855"; // Bleu marine plus foncé que #003366

interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

interface Company {
  id: string;
  name: string;
  logo_url?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  tel1?: string | null;
  tel2?: string | null;
  email?: string | null;
  siret?: string | null;
  tva_intracom?: string | null;
  capital_social?: string | null;
  code_ape?: string | null;
  slogan?: string | null;
}

interface DevisCoverPreviewProps {
  fields: PrintableField[];
  company: Company | null;
  onClose: () => void;
}

export const DevisCoverPreview: React.FC<DevisCoverPreviewProps> = ({ 
  fields, 
  company, 
  onClose 
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [logoError, setLogoError] = useState(false);
  
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day} / ${month} / ${year}`;
    } catch (e) {
      return dateString;
    }
  };

  const handleExportPDF = () => {
    if (!printContentRef.current) return;
    
    const opt = {
      margin: 20, // Marges uniformes de 20mm
      filename: `devis-${devisNumber || 'preview'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    const element = printContentRef.current.cloneNode(true) as HTMLElement;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      body { 
        font-family: 'Roboto', Arial, sans-serif; 
        margin: 0; 
        padding: 20px;
        color: #000;
        line-height: 1.5;
      }
    `;
    element.prepend(styleElement);
    
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    if (!printContentRef.current) return;
    
    const printContent = printContentRef.current.innerHTML;
    
    const printStyles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        
        body { 
          font-family: 'Roboto', Arial, sans-serif; 
          margin: 0; 
          padding: 20px;
          color: #000;
          line-height: 1.5;
          box-sizing: border-box;
          background-color: white;
        }
        
        .cover-page { 
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          box-sizing: border-box;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        
        .company-logo-container {
          max-width: 50%;
        }
        
        .company-logo { 
          max-height: 100px; 
          max-width: 100%;
        }
        
        .company-tagline {
          font-size: 12px;
          color: ${DARK_BLUE};
          margin-top: 5px;
        }
        
        .assurance {
          text-align: right;
          font-size: 10px;
          color: ${DARK_BLUE};
        }
        
        .assurance p {
          margin: 0;
          line-height: 1.4;
        }
        
        .company-info {
          margin: 30px 0;
          line-height: 1.6;
          font-size: 12px;
        }
        
        .devis-section {
          margin: 30px 0;
          display: flex;
          align-items: flex-start;
        }
        
        .devis-number {
          font-weight: bold;
          color: #000;
          font-size: 12px;
        }
        
        .devis-date {
          padding-top: 8px;
          font-size: 12px;
        }
        
        .validity-offer {
          margin-top: 10px;
          font-style: italic;
          font-size: 11px;
        }
        
        .section-title {
          color: ${DARK_BLUE};
          position: relative;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin: 0 0 5px 0;
        }
        
        .section-title:before, .section-title:after {
          content: '';
          flex: 1;
          border-bottom: 1px solid ${DARK_BLUE};
          margin: 0 10px;
        }
        
        .section-content {
          border: 1px solid ${DARK_BLUE};
          padding: 15px;
          min-height: 100px;
          font-size: 12px;
        }
        
        .client-section, .project-section {
          margin-bottom: 30px;
        }
        
        .project-item {
          margin-bottom: 8px;
        }
        
        .footer {
          font-size: 8px;
          text-align: center;
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
        }
        
        button, .dialog-header, .dialog-footer {
          display: none !important;
        }
      </style>
    `;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error("Impossible d'ouvrir une nouvelle fenêtre");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Devis - Page de Garde</title>
          ${printStyles}
        </head>
        <body>
          <div class="cover-page">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    });
    
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto font-roboto" 
        aria-describedby="devis-preview-description"
      >
        <div id="devis-preview-description" className="sr-only">
          Aperçu de la page de garde du devis
        </div>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu de la page de garde</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {/* Contenu principal - Retiré la bordure externe */}
        <div ref={printContentRef} className="p-6 rounded-md my-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="max-w-[50%]">
              {!logoError ? (
                <div>
                  <img 
                    src={company?.logo_url || ""} 
                    alt="Logo" 
                    className="max-h-24 max-w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                  {company?.slogan ? (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>{company.slogan}</p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="h-24 w-48 border border-gray-300 flex items-center justify-center text-gray-400">
                    Logo non disponible
                  </div>
                  {company?.slogan ? (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>{company.slogan}</p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Information d'assurance - Taille réduite et sans gras */}
            <div className="text-right text-xs" style={{ color: DARK_BLUE }}>
              <p>Assurance MAAF PRO</p>
              <p>Responsabilité civile</p>
              <p>Responsabilité civile décennale</p>
            </div>
          </div>
          
          {/* Coordonnées société - Taille réduite */}
          <div className="mt-12 mb-8 text-sm">
            <p className="font-medium">{company?.name}</p>
            <p>Siège: {company?.address} - {company?.postal_code} {company?.city}</p>
            
            <div className="mt-4">
              <p><span className="font-medium">Tél:</span> {company?.tel1}</p>
              {company?.tel2 && <p>{company?.tel2}</p>}
              <p><span className="font-medium">Mail:</span> {company?.email}</p>
            </div>
          </div>
          
          {/* Numéro et date du devis - Supprimé le cadre */}
          <div className="flex items-start mt-10 mb-12 text-sm">
            <div className="font-bold">Devis n°: {devisNumber}</div>
            
            <div className="ml-6">
              <p className="m-0">Du {formatDate(devisDate)}</p>
              {validityOffer && (
                <p className="mt-4 text-xs italic">
                  {validityOffer}
                </p>
              )}
            </div>
          </div>
          
          {/* Section client - Titre avec tirets */}
          <div className="mb-8">
            <h3 className="text-sm font-normal flex items-center mb-1">
              <span className="mr-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
              <span style={{ color: DARK_BLUE }}>Client / Maître d'ouvrage</span>
              <span className="ml-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
            </h3>
            <div className="border text-xs" style={{ borderColor: DARK_BLUE, padding: "15px", minHeight: "100px" }}>
              {client && (
                <div>
                  {client}
                </div>
              )}
            </div>
          </div>
          
          {/* Section chantier - Titre avec tirets */}
          <div>
            <h3 className="text-sm font-normal flex items-center mb-1">
              <span className="mr-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
              <span style={{ color: DARK_BLUE }}>Chantier / Travaux</span>
              <span className="ml-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
            </h3>
            <div className="border text-xs" style={{ borderColor: DARK_BLUE, padding: "15px", minHeight: "150px" }}>
              {projectDescription && (
                <div className="mb-4">
                  {projectDescription}
                </div>
              )}
              
              {projectAddress && (
                <div className="mb-2">
                  <strong>Adresse du chantier:</strong><br />
                  {projectAddress}
                </div>
              )}
              
              {occupant && (
                <div className="mb-2">
                  <strong>Occupant:</strong><br />
                  {occupant}
                </div>
              )}
              
              {additionalInfo && (
                <div className="mt-4">
                  <strong>Informations complémentaires:</strong><br />
                  {additionalInfo}
                </div>
              )}
            </div>
          </div>
          
          {/* Pied de page - Supprimé la bordure supérieure et réduit la taille */}
          <div className="text-center text-[8px] mt-24">
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
