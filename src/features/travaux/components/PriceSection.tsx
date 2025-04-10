
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TvaSelect from "./TvaSelect";

interface PriceSectionProps {
  prixFournitures: number;
  setPrixFournitures: (value: number) => void;
  prixMainOeuvre: number;
  setPrixMainOeuvre: (value: number) => void;
  tauxTVA: number;
  setTauxTVA: (value: number) => void;
  unite: string;
}

const PriceSection: React.FC<PriceSectionProps> = ({
  prixFournitures,
  setPrixFournitures,
  prixMainOeuvre,
  setPrixMainOeuvre,
  tauxTVA,
  setTauxTVA,
  unite
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prixFournitures">Prix fournitures (€/{unite})</Label>
          <Input
            id="prixFournitures"
            type="number"
            min="0"
            step="0.01"
            value={prixFournitures}
            onChange={(e) => setPrixFournitures(parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="prixMainOeuvre">Prix main d'œuvre (€/{unite})</Label>
          <Input
            id="prixMainOeuvre"
            type="number"
            min="0"
            step="0.01"
            value={prixMainOeuvre}
            onChange={(e) => setPrixMainOeuvre(parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tauxTVA">Taux de TVA (%)</Label>
        <TvaSelect
          value={tauxTVA}
          onChange={(value) => setTauxTVA(value)}
          className="mt-1"
        />
      </div>
    </>
  );
};

export default PriceSection;
