
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download, FilePdf } from "lucide-react";
import html2pdf from 'html2pdf.js';

// Logo en base64 directement intégré pour éviter les problèmes de chargement
const logoBase64 = "data:image/jpeg;base64,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";

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

  // Fonction pour l'export PDF avec html2pdf.js
  const handleExportPDF = () => {
    if (!printContentRef.current) return;
    
    // Options de configuration pour html2pdf
    const opt = {
      margin: 10,
      filename: `devis-${devisNumber || 'preview'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Clone l'élément pour éviter de modifier l'original
    const element = printContentRef.current.cloneNode(true) as HTMLElement;
    
    // Ajoute des styles spécifiques pour le PDF
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
    
    // Génère et télécharge le PDF
    html2pdf().set(opt).from(element).save();
  };

  // Fonction pour l'impression classique
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
          border: 1px solid #003366;
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
          font-size: 14px;
          color: #003366;
          margin-top: 5px;
        }
        
        .assurance {
          text-align: right;
          font-size: 12px;
          color: #003366;
        }
        
        .assurance p {
          margin: 0;
          line-height: 1.4;
        }
        
        .company-info {
          margin: 30px 0;
          line-height: 1.6;
        }
        
        .devis-section {
          margin: 30px 0;
          display: flex;
          align-items: flex-start;
        }
        
        .devis-number-container {
          display: inline-block;
          border: 1px solid #003366;
          padding: 8px 15px;
          margin-right: 20px;
        }
        
        .devis-number {
          font-weight: bold;
          color: #000;
        }
        
        .devis-date {
          padding-top: 8px;
        }
        
        .validity-offer {
          margin-top: 10px;
          font-style: italic;
          font-size: 13px;
        }
        
        .section-header {
          background-color: #003366;
          color: white;
          padding: 5px 10px;
          font-weight: normal;
          margin: 0;
        }
        
        .section-content {
          border: 1px solid #003366;
          padding: 15px;
          min-height: 100px;
        }
        
        .client-section, .project-section {
          margin-bottom: 30px;
        }
        
        .project-item {
          margin-bottom: 8px;
        }
        
        .footer {
          font-size: 9px;
          text-align: center;
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          padding-top: 5px;
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
        className="max-w-4xl max-h-[90vh] overflow-y-auto" 
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
        
        <div ref={printContentRef} className="p-6 border border-blue-900 rounded-md my-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="max-w-[50%]">
              {!logoError ? (
                <div>
                  <img 
                    src={logoBase64} 
                    alt="Logo" 
                    className="max-h-24 max-w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                  {company?.slogan ? (
                    <p className="text-sm mt-2 text-blue-900">{company.slogan}</p>
                  ) : (
                    <p className="text-sm mt-2 text-blue-900">Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="h-24 w-48 border border-gray-300 flex items-center justify-center text-gray-400">
                    Logo non disponible
                  </div>
                  {company?.slogan ? (
                    <p className="text-sm mt-2 text-blue-900">{company.slogan}</p>
                  ) : (
                    <p className="text-sm mt-2 text-blue-900">Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-right text-blue-900">
              <p className="font-bold">Assurance MAAF PRO</p>
              <p>Responsabilité civile</p>
              <p>Responsabilité civile décennale</p>
            </div>
          </div>
          
          <div className="mt-12 mb-8">
            <p className="font-medium">{company?.name}</p>
            <p>Siège: {company?.address} - {company?.postal_code} {company?.city}</p>
            
            <div className="mt-4">
              <p><span className="font-medium">Tél:</span> {company?.tel1}</p>
              {company?.tel2 && <p>{company?.tel2}</p>}
              <p><span className="font-medium">Mail:</span> {company?.email}</p>
            </div>
          </div>
          
          <div className="flex items-start mt-10 mb-12">
            <div className="border border-blue-900 p-2">
              <p className="font-bold m-0">Devis n°: {devisNumber}</p>
            </div>
            
            <div className="ml-6 pt-2">
              <p className="m-0">Du {formatDate(devisDate)}</p>
              {validityOffer && (
                <p className="mt-4 text-sm italic">
                  {validityOffer}
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="bg-blue-900 text-white p-2 m-0 font-normal">Client / Maître d'ouvrage</h3>
            <div className="border border-blue-900 p-4 min-h-[100px]">
              {client && (
                <div>
                  {client}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="bg-blue-900 text-white p-2 m-0 font-normal">Chantier / Travaux</h3>
            <div className="border border-blue-900 p-4 min-h-[150px]">
              {projectDescription && (
                <div className="mb-4">
                  {projectDescription}
                </div>
              )}
              
              {projectAddress && (
                <div className="mb-2">
                  <strong>Adresse du chantier:</strong> {projectAddress}
                </div>
              )}
              
              {occupant && (
                <div className="mb-2">
                  <strong>Occupant:</strong> {occupant}
                </div>
              )}
              
              {additionalInfo && (
                <div className="mt-4">
                  <strong>Informations complémentaires:</strong> {additionalInfo}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-xs mt-24 pt-2 border-t border-gray-300">
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
              <FilePdf className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
