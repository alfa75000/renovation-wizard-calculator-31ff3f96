
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
  const logoContent = fields.find(f => f.id === "companyLogo")?.content;
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
          <title>Aperçu Devis - Page de Garde</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .cover-page { max-width: 210mm; margin: 0 auto; }
            .company-header { text-align: center; margin-bottom: 30px; }
            .company-logo { max-height: 100px; max-width: 250px; margin-bottom: 10px; }
            .company-info { margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .devis-number { font-size: 18px; font-weight: bold; margin: 20px 0; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 5px; }
            .section-content { margin-left: 20px; }
            .validity { font-style: italic; margin: 15px 0; }
            .contact-info { display: flex; justify-content: space-between; }
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu de la page de garde</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div id="devis-cover-content" className="p-6 border rounded-md my-4 bg-white">
          {/* En-tête avec logo et informations de la société */}
          <div className="company-header text-center mb-6">
            {logoContent && (
              <img src={logoContent} alt="Logo" className="max-h-24 mx-auto mb-2" />
            )}
            <h2 className="text-xl font-bold">{company?.name}</h2>
            {company?.slogan && <p className="text-sm italic">{company.slogan}</p>}
          </div>
          
          {/* Informations de la société */}
          <div className="company-info mb-8 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>{company?.address}</p>
                <p>{company?.postal_code} {company?.city}</p>
                {company?.tel1 && <p>Tél: {company.tel1}</p>}
                {company?.tel2 && <p>Mobile: {company.tel2}</p>}
                {company?.email && <p>Email: {company.email}</p>}
              </div>
              <div className="text-right">
                {company?.siret && <p>SIRET: {company.siret}</p>}
                {company?.tva_intracom && <p>TVA: {company.tva_intracom}</p>}
                {company?.code_ape && <p>Code APE: {company.code_ape}</p>}
                {company?.capital_social && <p>Capital: {company.capital_social}</p>}
              </div>
            </div>
          </div>
          
          {/* Numéro et date du devis */}
          {(devisNumber || devisDate) && (
            <div className="devis-number text-center my-8">
              <h3 className="text-lg font-bold">
                {devisNumber && `Devis n°: ${devisNumber}`} 
                {devisDate && ` du ${devisDate}`}
              </h3>
            </div>
          )}
          
          {/* Validité de l'offre */}
          {validityOffer && (
            <div className="validity text-center my-6 italic">
              {validityOffer}
            </div>
          )}
          
          {/* Informations client et projet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Client */}
            {client && (
              <div className="section">
                <h4 className="section-title font-semibold mb-2">Client:</h4>
                <div className="section-content ml-4">{client}</div>
              </div>
            )}
            
            {/* Description du projet */}
            {projectDescription && (
              <div className="section">
                <h4 className="section-title font-semibold mb-2">Description du projet:</h4>
                <div className="section-content ml-4">{projectDescription}</div>
              </div>
            )}
            
            {/* Adresse du chantier */}
            {projectAddress && (
              <div className="section">
                <h4 className="section-title font-semibold mb-2">Adresse du chantier:</h4>
                <div className="section-content ml-4">{projectAddress}</div>
              </div>
            )}
            
            {/* Occupant */}
            {occupant && (
              <div className="section">
                <h4 className="section-title font-semibold mb-2">Occupant:</h4>
                <div className="section-content ml-4">{occupant}</div>
              </div>
            )}
          </div>
          
          {/* Informations complémentaires */}
          {additionalInfo && (
            <div className="section mt-8 border-t pt-4">
              <h4 className="section-title font-semibold mb-2">Informations complémentaires:</h4>
              <div className="section-content ml-4">{additionalInfo}</div>
            </div>
          )}
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
