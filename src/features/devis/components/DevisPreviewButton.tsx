
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import DevisCoverPreview from "./DevisCoverPreview";
import DevisDetailsPreview from "./DevisDetailsPreview";
import DevisRecapPreview from "./DevisRecapPreview";
import DevisCompletPreview from "./DevisCompletPreview";
import { Company } from "@/types";

interface DevisPreviewButtonProps {
  fields: any[]; // PrintableField[]
  company: Company | null;
  previewType: "cover" | "details" | "recap" | "complet";
  className?: string;
}

const DevisPreviewButton: React.FC<DevisPreviewButtonProps> = ({
  fields,
  company,
  previewType,
  className = ""
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { state } = useProject();
  const { rooms } = state;
  const { travaux, getTravauxForPiece } = useTravaux();

  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={openPreview} 
        className={`flex items-center gap-2 ${className}`}
      >
        <Eye className="h-4 w-4" />
        Aperçu
      </Button>

      {isPreviewOpen && previewType === "cover" && (
        <DevisCoverPreview 
          fields={fields} 
          company={company} 
          onClose={closePreview} 
        />
      )}

      {isPreviewOpen && previewType === "details" && (
        <DevisDetailsPreview 
          rooms={rooms} 
          travaux={travaux} 
          company={company} 
          getTravauxForPiece={getTravauxForPiece} 
          onClose={closePreview} 
        />
      )}

      {isPreviewOpen && previewType === "recap" && (
        <DevisRecapPreview 
          rooms={rooms} 
          travaux={travaux} 
          company={company} 
          getTravauxForPiece={getTravauxForPiece} 
          onClose={closePreview} 
        />
      )}

      {isPreviewOpen && previewType === "complet" && (
        <DevisCompletPreview 
          fields={fields} 
          rooms={rooms} 
          travaux={travaux} 
          company={company} 
          getTravauxForPiece={getTravauxForPiece} 
          onClose={closePreview} 
        />
      )}
    </>
  );
};

export default DevisPreviewButton;
