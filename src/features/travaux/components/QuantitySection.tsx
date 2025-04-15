
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UniteSelect from "./UniteSelect";
import SurfaceImpacteeSelect from "./SurfaceImpacteeSelect";
import { SurfaceImpactee } from "@/types";
import { UniteType } from "@/types/supabase";

interface QuantitySectionProps {
  quantite: number;
  setQuantite: (value: number) => void;
  unite: UniteType;
  setUnite: (value: UniteType) => void;
  surfaceImpactee: SurfaceImpactee;
  setSurfaceImpactee: (value: SurfaceImpactee) => void;
  isCustomUnite?: boolean; // Indique si l'unité est personnalisée (non définie dans le service)
  isCustomSurface?: boolean; // Indique si la surface impactée est personnalisée
}

const QuantitySection: React.FC<QuantitySectionProps> = ({
  quantite,
  setQuantite,
  unite,
  setUnite,
  surfaceImpactee,
  setSurfaceImpactee,
  isCustomUnite = false,
  isCustomSurface = false
}) => {
  // Ajouter des logs pour vérifier les valeurs entrantes
  console.log("QuantitySection - Props:", { 
    quantite, 
    unite, 
    surfaceImpactee, 
    isCustomUnite, 
    isCustomSurface 
  });

  return (
    <>
      <div>
        <Label htmlFor="surfaceImpactee">
          {isCustomSurface ? "Surface impactée (non définie)" : "Surface impactée"}
        </Label>
        <SurfaceImpacteeSelect
          value={surfaceImpactee}
          onChange={setSurfaceImpactee}
          className="mt-1"
          isUndefined={isCustomSurface}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantite">Quantité</Label>
          <Input
            id="quantite"
            type="number"
            min="0"
            step="0.01"
            value={quantite}
            onChange={(e) => setQuantite(parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="unite">
            {isCustomUnite ? "Unité (par défaut)" : "Unité"}
          </Label>
          <UniteSelect
            value={unite}
            onChange={setUnite}
            className="mt-1"
          />
        </div>
      </div>
    </>
  );
};

export default QuantitySection;
