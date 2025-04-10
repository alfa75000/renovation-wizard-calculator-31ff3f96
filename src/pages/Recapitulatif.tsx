
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";

// Import des composants refactorisés
import PropertyInfoCard from "@/features/recap/components/PropertyInfoCard";
import TravauxRecapContent from "@/features/recap/components/TravauxRecapContent";

const Recapitulatif: React.FC = () => {
  const { state } = useProject();
  const { property, rooms } = state;
  const { travaux, getTravauxForPiece } = useTravaux();

  return (
    <Layout
      title="Récapitulatif des travaux"
      subtitle="Estimation détaillée par pièce"
    >
      <div className="mb-4 flex justify-between">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/travaux">
            <ArrowLeft className="h-4 w-4" />
            Retour aux travaux
          </Link>
        </Button>

        <Button className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimer le devis
        </Button>
      </div>

      {/* Informations générales du bien */}
      <PropertyInfoCard property={property} rooms={rooms} />

      {/* Récapitulatif des travaux */}
      <TravauxRecapContent 
        rooms={rooms} 
        travaux={travaux} 
        getTravauxForPiece={getTravauxForPiece} 
      />
    </Layout>
  );
};

export default Recapitulatif;
