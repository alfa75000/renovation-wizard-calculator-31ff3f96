
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { PrintableField, CompanyData } from "@/types";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { prepareCoverContent } from "@/services/pdf/generators/coverGenerator";
import { generatePdfDocument } from "@/services/pdf/services/pdfDocumentService";
import { usePdfSettings } from "@/services/pdf/hooks/usePdfSettings";
import { useProject } from "@/contexts/ProjectContext";
import { Card } from "@/components/ui/card";

interface DevisCoverPreviewProps {
  fields: PrintableField[];
  company: CompanyData | null;
  onClose: () => void;
}

export const DevisCoverPreview: React.FC<DevisCoverPreviewProps> = ({
  fields,
  company,
  onClose,
}) => {
  const [open, setOpen] = useState(true);
  const { pdfSettings } = usePdfSettings();
  const { state } = useProject();
  const { metadata } = state;
  
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleExportPDF = () => {
    console.log("[COVER DEBUG] === DÉBUT EXPORT PDF DE L'APERÇU DE PAGE DE GARDE ===");
    
    try {
      console.log("[COVER DEBUG] Fields pour aperçu PDF:", fields);
      
      const coverContent = prepareCoverContent(fields, company, metadata, pdfSettings);
      console.log("[COVER DEBUG] Contenu de couverture généré");
      
      generatePdfDocument({
        metadata: {
          ...metadata,
          company: company
        },
        content: [
          { stack: coverContent }
        ],
        fontFamily: pdfSettings?.fontFamily,
        showHeader: false,
        showFooter: true
      });
      
      console.log("[COVER DEBUG] PDF généré avec succès");
    } catch (error) {
      console.error("[COVER DEBUG] Erreur lors de la génération du PDF de la page de garde:", error);
    }
  };

  // Render the field preview
  const renderFieldPreview = (field: PrintableField) => {
    if (!field.enabled) return null;

    let displayContent = field.content;
    if (field.id === "companyLogo" && field.content) {
      return (
        <div key={field.id} className="mb-4">
          <div className="font-medium text-sm text-gray-500 mb-1">{field.name}:</div>
          <img src={field.content} alt="Logo" className="max-h-16 object-contain" />
        </div>
      );
    }

    return (
      <div key={field.id} className="mb-4">
        <div className="font-medium text-sm text-gray-500 mb-1">{field.name}:</div>
        <div className="text-sm">{displayContent || 'Non défini'}</div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu de la page de garde</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 absolute right-4 top-4"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Contenu de la page de garde</h3>
          <div className="space-y-4">
            {/* En-tête */}
            <div className="flex justify-between mb-4">
              <div className="flex-1">
                {renderFieldPreview(fields.find(f => f.id === "companyLogo") || { id: "companyLogo", name: "Logo société", enabled: false, content: null })}
              </div>
              <div className="flex-1 text-right text-sm">
                <p>Assurance MAAF PRO</p>
                <p>Responsabilité civile</p>
                <p>Responsabilité civile décennale</p>
              </div>
            </div>

            {/* Slogan et coordonnées */}
            <div>
              <p className="font-bold">Entreprise Générale du Bâtiment</p>
              {renderFieldPreview(fields.find(f => f.id === "companyName") || { id: "companyName", name: "Nom société", enabled: false, content: null })}
            </div>

            {/* Informations de devis */}
            <div className="mt-6">
              {renderFieldPreview(fields.find(f => f.id === "devisNumber") || { id: "devisNumber", name: "Numéro du devis", enabled: false, content: null })}
              {renderFieldPreview(fields.find(f => f.id === "devisDate") || { id: "devisDate", name: "Date du devis", enabled: false, content: null })}
              {renderFieldPreview(fields.find(f => f.id === "validityOffer") || { id: "validityOffer", name: "Validité de l'offre", enabled: false, content: null })}
            </div>

            {/* Client */}
            <div className="mt-6">
              <h4 className="font-medium">Client / Maître d'ouvrage</h4>
              {renderFieldPreview(fields.find(f => f.id === "client") || { id: "client", name: "Client", enabled: false, content: null })}
            </div>

            {/* Chantier */}
            <div className="mt-6">
              <h4 className="font-medium">Chantier / Travaux</h4>
              {renderFieldPreview(fields.find(f => f.id === "occupant") || { id: "occupant", name: "Occupant", enabled: false, content: null })}
              {renderFieldPreview(fields.find(f => f.id === "projectAddress") || { id: "projectAddress", name: "Adresse du chantier", enabled: false, content: null })}
              {renderFieldPreview(fields.find(f => f.id === "projectDescription") || { id: "projectDescription", name: "Description du projet", enabled: false, content: null })}
            </div>

            {/* Informations complémentaires */}
            <div className="mt-6">
              {renderFieldPreview(fields.find(f => f.id === "additionalInfo") || { id: "additionalInfo", name: "Informations complémentaires", enabled: false, content: null })}
            </div>

            {/* Pied de page */}
            <div className="mt-12 text-center text-xs text-gray-500 border-t pt-2">
              {company?.name} - SASU au Capital de {company?.capital_social || '10000'} € - {company?.address} {company?.postal_code} {company?.city}
            </div>
          </div>
        </Card>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
