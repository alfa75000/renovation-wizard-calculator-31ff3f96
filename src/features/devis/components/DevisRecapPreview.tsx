
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import RecapitulatifTravaux from "@/features/recap/components/RecapitulatifTravaux";
import { generateDetailsPDF } from "@/services/pdfGenerationService";
import { useAppState } from "@/hooks/useAppState";

// Composant affichant l'aperçu du récapitulatif pour l'impression
const DevisRecapPreview: React.FC = () => {
  const { state } = useProject();
  const { rooms, metadata } = state;
  const { travaux, getTravauxForPiece } = useTravaux();
  const { currentUser } = useAppState();

  // Fonction pour générer le PDF
  const handlePrint = async () => {
    try {
      if (!currentUser?.id) {
        console.warn("Aucun utilisateur connecté, utilisation des paramètres par défaut");
      } else {
        console.log("Génération du PDF avec l'ID utilisateur:", currentUser.id);
      }
      
      await generateDetailsPDF(rooms, travaux, getTravauxForPiece, metadata, currentUser?.id);
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
