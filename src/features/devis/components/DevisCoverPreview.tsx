import React, { useEffect, useRef, useState } from "react";
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
  const printContentRef = useRef<HTMLDivElement>(null);
  const [logoError, setLogoError] = useState(false);
  
  // Récupérer les champs individuels
  const logoContent = "/images/lrs-logo.jpg";
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  // Debug logs
  useEffect(() => {
    console.log("Logo URL:", logoContent);
    console.log("Company data:", company);
  }, [logoContent, company]);

  // Formatter la date pour l'affichage "JJ / MM / YYYY"
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day} / ${month} / ${year}`;
    } catch (e) {
      return dateString; // Si le format n'est pas valide, retourner la chaîne d'origine
    }
  };

  // Fonction pour gérer l'impression
  const handlePrint = () => {
    if (!printContentRef.current) return;
    
    const printContent = printContentRef.current.innerHTML;
    
    // Ajouter des styles CSS pour l'impression
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
    
    // Utiliser une approche différente pour imprimer
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
    
    // Attendre que les ressources soient chargées
    printWindow.document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    });
    
    // Si l'événement DOMContentLoaded ne se déclenche pas, imprimer après un délai
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Erreur de chargement du logo:", e);
    setLogoError(true);
    e.currentTarget.src = "/placeholder.svg"; // Image de remplacement
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
        
        <div ref={printContentRef} id="devis-cover-content" className="p-6 border border-blue-900 rounded-md my-4 bg-white">
          {/* En-tête avec logo et informations d'assurance */}
          <div className="flex justify-between items-start">
            <div className="max-w-[50%]">
              {logoContent && !logoError ? (
                <div>
                  <img 
                    src={logoContent} 
                    alt="Logo" 
                    className="max-h-24 max-w-full"
                    onError={handleImageError}
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
          
          {/* Coordonnées société */}
          <div className="mt-12 mb-8">
            <p className="font-medium">{company?.name}</p>
            <p>Siège: {company?.address} - {company?.postal_code} {company?.city}</p>
            
            <div className="mt-4">
              <p><span className="font-medium">Tél:</span> {company?.tel1}</p>
              {company?.tel2 && <p>{company?.tel2}</p>}
              <p><span className="font-medium">Mail:</span> {company?.email}</p>
            </div>
          </div>
          
          {/* Numéro et date du devis */}
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
          
          {/* Section client */}
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
          
          {/* Section chantier */}
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
          
          {/* Pied de page */}
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
