
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import RecapitulatifTravaux from "@/features/recap/components/RecapitulatifTravaux";
import { generateRecapPDF } from "@/services/pdfGenerationService";
import { usePdfSettings } from "@/services/pdf/hooks/usePdfSettings";

// Composant affichant l'aperçu du récapitulatif pour l'impression
const DevisRecapPreview: React.FC = () => {
  const { state } = useProject();
  const { rooms, metadata } = state;
  const { travaux, getTravauxForPiece } = useTravaux();
  const { pdfSettings } = usePdfSettings(); // Récupérer les paramètres PDF

  // Afficher les paramètres PDF au montage du composant pour le débogage
  useEffect(() => {
    console.log("DevisRecapPreview - Paramètres PDF disponibles:", pdfSettings);
    console.log("DevisRecapPreview - Éléments personnalisés:", pdfSettings?.elements);
    
    // Vérifier spécifiquement les bordures du récapitulatif
    if (pdfSettings?.elements?.recap_title) {
      console.log("DevisRecapPreview - Bordures du récapitulatif:", pdfSettings.elements.recap_title.border);
    }
  }, [pdfSettings]);

  // Fonction pour générer le PDF
  const handlePrint = async () => {
    try {
      console.log("Impression du récapitulatif avec les paramètres:", pdfSettings);
      if (pdfSettings?.elements?.recap_title) {
        console.log("Impression - Bordures du récapitulatif:", pdfSettings.elements.recap_title.border);
      }
      await generateRecapPDF(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Aperçu du Récapitulatif</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
      </div>
      
      <div className="p-4 border rounded shadow-sm bg-white">
        <RecapitulatifTravaux 
          rooms={rooms}
          travaux={travaux}
          getTravauxForPiece={getTravauxForPiece}
        />
      </div>
    </div>
  );
};

export default DevisRecapPreview;
