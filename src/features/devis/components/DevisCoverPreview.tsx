
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { PrintableField, CompanyData } from "@/types";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { prepareCoverContent } from "@/services/pdf/generators/coverGenerator";
import { generatePdfDocument } from "@/services/pdf/services/pdfDocumentService";
import { usePdfSettings } from "@/services/pdf/hooks/usePdfSettings";
import { useProject } from "@/contexts/ProjectContext";

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
    console.log("[LOGO DEBUG] === DÉBUT EXPORT PDF DE L'APERÇU DE PAGE DE GARDE ===");
    console.log("[LOGO DEBUG] Company data:", company);
    console.log("[LOGO DEBUG] Logo URL dans company:", company?.logo_url);
    console.log("[LOGO DEBUG] Paramètres PDF:", pdfSettings);
    console.log("[LOGO DEBUG] Paramètres du logo dans pdfSettings:", pdfSettings?.logoSettings);
    console.log("[LOGO DEBUG] Logo par défaut activé:", pdfSettings?.logoSettings?.useDefaultLogo);
    
    // Logique pour générer le PDF de la page de garde
    try {
      console.log("[LOGO DEBUG] Fields pour aperçu PDF:", fields);
      
      // Cette partie est cruciale pour la compréhension du fonctionnement du logo
      let logoContent = fields.find(f => f.id === 'companyLogo')?.content;
      console.log("[LOGO DEBUG] Logo content from fields:", logoContent);
      
      if (pdfSettings?.logoSettings?.useDefaultLogo && !logoContent) {
        console.log("[LOGO DEBUG] Utilisation du logo par défaut car useDefaultLogo=true et logoContent est vide");
        logoContent = '/images/lrs-logo.jpg';
        console.log("[LOGO DEBUG] Logo par défaut défini:", logoContent);
      }
      
      const coverContent = prepareCoverContent(fields, company, metadata, pdfSettings);
      console.log("[LOGO DEBUG] Contenu de couverture généré");
      console.log("[LOGO DEBUG] Premier élément du contenu:", coverContent[0]);
      console.log("[LOGO DEBUG] Recherche d'image dans le contenu...");
      
      // Vérification si une image est présente dans le contenu
      const contentStr = JSON.stringify(coverContent);
      const hasImage = contentStr.includes('"image":');
      console.log("[LOGO DEBUG] Contenu contient une image:", hasImage);
      
      if (hasImage) {
        console.log("[LOGO DEBUG] Détails des éléments d'image trouvés:");
        // Parcourir la structure pour trouver les images
        const findImages = (obj: any, path = '') => {
          if (!obj) return;
          
          if (typeof obj === 'object') {
            if (obj.image) {
              console.log(`[LOGO DEBUG] Image trouvée à ${path}:`, obj.image);
              console.log(`[LOGO DEBUG] Dimensions de l'image:`, { width: obj.width, height: obj.height });
            }
            
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                findImages(obj[key], `${path}.${key}`);
              }
            }
          }
        };
        
        findImages(coverContent, 'coverContent');
      }
      
      console.log("[LOGO DEBUG] Génération du document PDF avec metadata:", !!metadata);
      console.log("[LOGO DEBUG] Company dans metadata:", !!metadata?.company);
      console.log("[LOGO DEBUG] Logo URL dans metadata:", metadata?.company?.logo_url);
      
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
      
      console.log("[LOGO DEBUG] PDF généré avec succès");
    } catch (error) {
      console.error("[LOGO DEBUG] Erreur lors de la génération du PDF de la page de garde:", error);
    }
    console.log("[LOGO DEBUG] === FIN EXPORT PDF DE L'APERÇU DE PAGE DE GARDE ===");
  };

  // Rendu du contenu de la page de garde
  const renderCoverContent = () => {
    return (
      <div>
        {prepareCoverContent(fields, company, metadata, pdfSettings).map((content, index) => (
          <div key={index}>
            {JSON.stringify(content)}
          </div>
        ))}
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
        
        <div className="mt-4">
          {renderCoverContent()}
        </div>
        
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
