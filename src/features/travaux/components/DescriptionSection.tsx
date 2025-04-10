
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  description: string;
  setDescription: (value: string) => void;
  personnalisation: string;
  setPersonnalisation: (value: string) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  setDescription,
  personnalisation,
  setPersonnalisation
}) => {
  return (
    <>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du travail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="personnalisation">Personnalisation</Label>
        <Textarea
          id="personnalisation"
          placeholder="Détails spécifiques (optionnel)"
          value={personnalisation || ""}
          onChange={(e) => setPersonnalisation(e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
    </>
  );
};

export default DescriptionSection;
