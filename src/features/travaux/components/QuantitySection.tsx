
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UniteSelect from "./UniteSelect";
import SurfaceImpacteeSelect from "./SurfaceImpacteeSelect";
import { SurfaceImpactee } from "@/types";

interface QuantitySectionProps {
  quantite: number;
  setQuantite: (value: number) => void;
  unite: string;
  setUnite: (value: string) => void;
  surfaceImpactee: SurfaceImpactee;
  setSurfaceImpactee: (value: SurfaceImpactee) => void;
}

const QuantitySection: React.FC<QuantitySectionProps> = ({
  quantite,
  setQuantite,
  unite,
  setUnite,
  surfaceImpactee,
  setSurfaceImpactee
}) => {
  return (
    <>
      <div>
        <Label htmlFor="surfaceImpactee">Surface impactée</Label>
        <SurfaceImpacteeSelect
          value={surfaceImpactee}
          onChange={setSurfaceImpactee}
          className="mt-1"
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
          <Label htmlFor="unite">Unité</Label>
          <UniteSelect
            value={unite}
            onChange={(value) => setUnite(value)}
            className="mt-1"
          />
        </div>
      </div>
    </>
  );
};

export default QuantitySection;
