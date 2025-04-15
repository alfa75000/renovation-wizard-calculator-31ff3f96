
import React, { useState, useEffect } from "react";
import { Company } from "@/types";
import { 
  PrintableField, 
  convertImageToDataUrl, 
  createCoverPageDefinition, 
  PDF_CONSTANTS
} from "../services/pdfGenerationService";
import PdfPreviewDialog from "./PdfPreviewDialog";

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
  const [logoExists, setLogoExists] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [docDefinition, setDocDefinition] = useState<any>(null);

  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  
  // Charger le logo et générer la définition du document
  useEffect(() => {
    const loadLogoAndCreateDoc = async () => {
      // Charger le logo
      const { dataUrl, exists } = await convertImageToDataUrl(PDF_CONSTANTS.LOGO_PATH);
      setLogoDataUrl(dataUrl);
      setLogoExists(exists);
      
      // Créer la définition du document
      const docDef = createCoverPageDefinition(fields, company, dataUrl, exists);
      setDocDefinition(docDef);
    };
    
    loadLogoAndCreateDoc();
  }, [fields, company]);

  return (
    <PdfPreviewDialog
      open={true}
      onClose={onClose}
      docDefinition={docDefinition}
      title="Aperçu de la page de garde"
      fileName={`devis-${devisNumber || 'preview'}.pdf`}
    />
  );
};

export default DevisCoverPreview;
