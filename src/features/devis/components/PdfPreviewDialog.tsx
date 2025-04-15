
import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import { exportPDF, printPDF } from "../services/pdfGenerationService";

interface PdfPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  docDefinition: any;
  title: string;
  fileName: string;
}

const PdfPreviewDialog: React.FC<PdfPreviewDialogProps> = ({
  open,
  onClose,
  docDefinition,
  title,
  fileName
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && docDefinition) {
      setIsLoading(true);
      
      // Utiliser pdfMake pour générer le PDF et l'afficher dans l'iframe
      import('pdfmake/build/pdfmake').then((pdfMake) => {
        const pdfDocGenerator = pdfMake.default.createPdf(docDefinition);
        pdfDocGenerator.getBlob((blob) => {
          if (iframeRef.current) {
            const url = URL.createObjectURL(blob);
            iframeRef.current.src = url;
            iframeRef.current.onload = () => setIsLoading(false);
          }
        });
      });
    }
  }, [open, docDefinition]);

  const handleExportPDF = () => {
    exportPDF(docDefinition, fileName);
  };

  const handlePrint = () => {
    printPDF(docDefinition);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        aria-describedby="pdf-preview-description"
      >
        <div id="pdf-preview-description" className="sr-only">
          Aperçu du document PDF
        </div>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {/* Contenu principal - iframe pour afficher le PDF */}
        <div className="flex-1 relative bg-gray-100 rounded-md my-4">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe 
            ref={iframeRef}
            className="w-full h-full rounded-md border"
            title="Aperçu PDF"
          />
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

export default PdfPreviewDialog;
