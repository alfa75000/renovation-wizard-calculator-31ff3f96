
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { PrintableField, CompanyData, ProjectMetadata } from "@/types";
import { generateCoverPDF } from "@/services/pdf/services/detailedPdfService";
import { useProject } from "@/contexts/ProjectContext";
import { usePdfSettings } from "@/services/pdf/hooks/usePdfSettings";

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
  const [loading, setLoading] = useState(false);
  const { state } = useProject();
  const { metadata } = state;
  const { pdfSettings } = usePdfSettings();

  const handleExportPDF = async () => {
    console.log("[DevisCoverPreview] ===== DÉBUT EXPORT PDF DE LA PAGE DE GARDE =====");
    console.log("[DevisCoverPreview] Champs reçus:", fields);
    console.log("[DevisCoverPreview] Données de l'entreprise:", company);
    console.log("[DevisCoverPreview] Logo URL dans company:", company?.logo_url);
    console.log("[DevisCoverPreview] Metadata:", metadata);
    console.log("[DevisCoverPreview] PDF Settings:", pdfSettings);
    console.log("[DevisCoverPreview] Logo Settings:", pdfSettings?.logoSettings);
    console.log("[DevisCoverPreview] useDefaultLogo:", pdfSettings?.logoSettings?.useDefaultLogo);
    
    // Vérifier si l'URL du logo est utilisé depuis les pdfSettings
    const logoUrlFromSettings = pdfSettings?.logoSettings?.logoUrl;
    const useDefaultLogo = pdfSettings?.logoSettings?.useDefaultLogo;
    
    console.log("[DevisCoverPreview] Logo URL depuis pdfSettings:", logoUrlFromSettings);
    console.log("[DevisCoverPreview] Utiliser logo par défaut selon settings:", useDefaultLogo);
    console.log("[DevisCoverPreview] Chemin vers logo par défaut attendu:", '/images/lrs-logo.jpg');
    
    setLoading(true);
    try {
      console.log("[DevisCoverPreview] Préparation à l'appel de generateCoverPDF");
      console.log("[DevisCoverPreview] Fields transmis:", JSON.stringify(fields.map(f => ({id: f.id, enabled: f.enabled}))));
      
      // Préparation des données pour le diagnostic
      const fieldsContainsLogo = fields.some(f => f.id === 'companyLogo' && f.enabled);
      const logoContent = fields.find(f => f.id === 'companyLogo')?.content;
      
      console.log("[DevisCoverPreview] Le champ Logo est-il activé?", fieldsContainsLogo);
      console.log("[DevisCoverPreview] Contenu du champ Logo:", logoContent);
      console.log("[DevisCoverPreview] État du pdfSettings avant appel:", {
        fontFamily: pdfSettings?.fontFamily,
        hasLogoSettings: !!pdfSettings?.logoSettings,
        logoUrl: pdfSettings?.logoSettings?.logoUrl,
        useDefaultLogo: pdfSettings?.logoSettings?.useDefaultLogo
      });
      
      // Appel à la fonction de génération PDF
      console.log("[DevisCoverPreview] Appel de generateCoverPDF");
      await generateCoverPDF(fields, company, metadata, pdfSettings);
      
      console.log("[DevisCoverPreview] PDF généré avec succès");
      console.log("[DevisCoverPreview] ===== FIN EXPORT PDF DE LA PAGE DE GARDE =====");
    } catch (error) {
      console.error("[DevisCoverPreview] Erreur lors de la génération du PDF:", error);
      console.log("[DevisCoverPreview] ===== ÉCHEC EXPORT PDF DE LA PAGE DE GARDE =====");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Aperçu de la page de garde</DialogTitle>
          <DialogClose asChild>
            <Button variant="secondary" className="absolute top-2 right-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex justify-center items-center h-full">
          {loading ? (
            <Loader />
          ) : (
            <Button onClick={handleExportPDF} disabled={loading}>
              Exporter PDF
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
