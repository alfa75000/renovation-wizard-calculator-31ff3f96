
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { CompanyData, PrintableField } from "@/types";
import { generateCoverPagePDF } from "@/services/pdf/services/coverPdfService";
import { usePdfSettings } from "@/services/pdf/hooks/usePdfSettings";

interface DevisCoverPreviewProps {
  fields: PrintableField[];
  company: CompanyData | null;
  onClose: () => void;
}

export const DevisCoverPreview: React.FC<DevisCoverPreviewProps> = ({ 
  fields, 
  company, 
  onClose 
}) => {
  const [open, setOpen] = useState(true);
  const { pdfSettings } = usePdfSettings();
  
  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  
  const handleExportPDF = async () => {
    console.log("### APERÇU PAGE DE GARDE - DÉBUT EXPORT PDF ###");
    console.log("Logo fields:", fields.find(field => field.id === "companyLogo"));
    console.log("Logo enabled:", fields.find(field => field.id === "companyLogo")?.enabled);
    console.log("Logo content:", fields.find(field => field.id === "companyLogo")?.content);
    console.log("Company:", company);
    console.log("Company logo_url:", company?.logo_url);
    console.log("PDF Settings:", pdfSettings);
    console.log("PDF Settings logo:", pdfSettings?.logoSettings);
    
    try {
      // Exporter uniquement la page de garde
      await generateCoverPagePDF(
        fields,
        company,
        undefined, // pas de metadata pour l'instant
        pdfSettings
      );
      console.log("### APERÇU PAGE DE GARDE - EXPORT PDF RÉUSSI ###");
    } catch (error) {
      console.error("### APERÇU PAGE DE GARDE - ERREUR EXPORT PDF ###", error);
    }
  };
  
  // Filtrer les champs pour l'aperçu
  const previewFields = fields.filter(field => field.id !== "summary");
  
  // Vérifier si le logo est activé
  const logoEnabled = fields.find(field => field.id === "companyLogo")?.enabled;
  const logoContent = fields.find(field => field.id === "companyLogo")?.content;
  
  console.log("DevisCoverPreview - Logo enabled:", logoEnabled);
  console.log("DevisCoverPreview - Logo content:", logoContent);
  console.log("DevisCoverPreview - Company logo_url:", company?.logo_url);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu de la page de garde</DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-md p-6 bg-white">
          {/* Affichage du logo si activé */}
          {logoEnabled && company?.logo_url && (
            <div className="mb-4">
              <img 
                src={company.logo_url} 
                alt="Logo" 
                className="h-16 object-contain" 
              />
            </div>
          )}
          
          {/* Affichage des autres champs */}
          {previewFields.map(field => field.id !== "companyLogo" && field.enabled && (
            <div key={field.id} className="mb-3">
              <h3 className="font-medium text-sm">{field.name}</h3>
              <p className="text-sm">{field.content}</p>
            </div>
          ))}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Fermer
          </Button>
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Exporter PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
