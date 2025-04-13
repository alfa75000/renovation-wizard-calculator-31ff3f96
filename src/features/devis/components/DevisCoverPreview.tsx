
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import { formaterPrix } from "@/lib/utils";

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
  // Récupérer les champs individuels
  const logoContent = company?.logo_url || fields.find(f => f.id === "companyLogo")?.content;
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  // Fonction pour gérer l'impression
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = document.getElementById('devis-cover-content');
    if (!content) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Devis - Page de Garde</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #000;
              line-height: 1.5;
            }
            .cover-page { 
              max-width: 210mm; 
              margin: 0 auto; 
              position: relative;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            .company-logo { 
              max-height: 80px; 
              max-width: 180px; 
              border: 1px solid #ccc;
              padding: 5px;
            }
            .company-header {
              margin-bottom: 15px;
            }
            .assurance {
              text-align: right;
              font-size: 12px;
              color: #005;
            }
            .company-info {
              font-size: 12px;
              margin-bottom: 40px;
            }
            .contact-info {
              margin-bottom: 5px;
            }
            .devis-info {
              margin: 30px 0;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .devis-number { 
              display: inline-block;
              border: 1px solid #000;
              padding: 3px 8px;
              font-weight: bold;
            }
            .client-section {
              margin: 30px 0;
            }
            .client-box {
              border: 1px solid #000;
              padding: 15px;
              width: 60%;
              min-height: 100px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #005;
              border-bottom: 1px solid #005;
              display: inline-block;
            }
            .project-box {
              border: 1px solid #000;
              padding: 15px;
              margin-top: 10px;
              min-height: 120px;
            }
            .project-item {
              margin-bottom: 8px;
            }
            .footer {
              font-size: 9px;
              position: absolute;
              bottom: 20px;
              width: 100%;
              text-align: center;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu de la page de garde</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div id="devis-cover-content" className="p-6 border rounded-md my-4 bg-white">
          {/* En-tête avec logo et informations société */}
          <div className="header flex justify-between items-start">
            <div className="company-header">
              {logoContent && (
                <div className="border border-gray-300 p-1 inline-block">
                  <img 
                    src={logoContent} 
                    alt="Logo" 
                    className="company-logo max-h-20"
                    onError={(e) => {
                      console.error("Erreur de chargement du logo:", e);
                      e.currentTarget.src = "public/placeholder.svg";
                    }}
                  />
                </div>
              )}
              {company?.slogan && <p className="text-sm mt-2">{company.slogan}</p>}
            </div>
            
            <div className="assurance text-right text-blue-900 text-sm">
              <p className="font-semibold">Assurance MAAF XXXX</p>
              <p className="text-xs">Responsabilité civile décennale</p>
              <p className="text-xs">Responsabilité civile professionnelle</p>
            </div>
          </div>
          
          {/* Coordonnées société */}
          <div className="company-info text-sm">
            <p className="font-semibold">Société {company?.name}</p>
            <p>Siège: {company?.address}, {company?.postal_code} {company?.city}</p>
            
            <div className="flex mt-2">
              <div className="w-1/2">
                <p className="contact-info"><span className="font-semibold">Tél:</span> {company?.tel1}</p>
                {company?.tel2 && <p className="contact-info">Mob: {company?.tel2}</p>}
                <p className="contact-info"><span className="font-semibold">Mail:</span> {company?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Numéro et date du devis */}
          <div className="devis-info">
            <div className="flex items-center gap-8">
              {devisNumber && (
                <div className="devis-number bg-gray-100">
                  Devis n° {devisNumber}
                </div>
              )}
              {devisDate && (
                <div className="devis-date">
                  Du {devisDate}
                </div>
              )}
            </div>
            
            {validityOffer && (
              <div className="validity mt-3 text-sm italic">
                {validityOffer}
              </div>
            )}
          </div>
          
          {/* Section client */}
          <div className="client-section">
            <div className="section-title">Client / Maître d'ouvrage</div>
            <div className="client-box">
              {client && (
                <div>
                  {client}
                </div>
              )}
            </div>
          </div>
          
          {/* Section chantier */}
          <div className="project-section">
            <div className="section-title">Chantier / Travaux</div>
            <div className="project-box">
              {projectDescription && (
                <div className="project-item">
                  {projectDescription}
                </div>
              )}
              
              {projectAddress && (
                <div className="project-item mt-4">
                  <strong>Adresse du chantier:</strong> {projectAddress}
                </div>
              )}
              
              {occupant && (
                <div className="project-item">
                  <strong>Occupant:</strong> {occupant}
                </div>
              )}
              
              {additionalInfo && (
                <div className="project-item mt-4">
                  <strong>Informations complémentaires:</strong> {additionalInfo}
                </div>
              )}
            </div>
          </div>
          
          {/* Pied de page */}
          <div className="footer mt-16 text-xs text-gray-500 border-t pt-2">
            <p>
              {company?.name} - SARL au Capital de {company?.capital_social || "XXX"} € - {company?.address}, {company?.postal_code} {company?.city} - Siret: {company?.siret} - Code APE: {company?.code_ape} - N° TVA intracommunautaire: {company?.tva_intracom}
            </p>
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
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
