
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Property } from "@/types";

interface PropertyFormProps {
  property: Property;
  onPropertyChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onPropertyChange }) => {
  // Vérifier que property est défini et utiliser un objet par défaut si nécessaire
  const propertyWithDefaults = property || {
    type: "Appartement",
    floors: 1,
    totalArea: 0,
    rooms: 0,
    ceilingHeight: 2.5,
  };
  
  const propertyTypes = ["Appartement", "Maison", "Studio", "Loft", "Autre"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          value={propertyWithDefaults.type}
          onChange={onPropertyChange}
          className="w-full p-2 border rounded mt-1"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="floors">Nombre de niveaux</Label>
        <Input
          id="floors"
          name="floors"
          type="number"
          min="1"
          value={propertyWithDefaults.floors}
          onChange={onPropertyChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="totalArea">Surface Totale (m²)</Label>
        <Input
          id="totalArea"
          name="totalArea"
          type="number"
          min="0"
          value={propertyWithDefaults.totalArea}
          onChange={onPropertyChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="rooms">Nombre de Pièces</Label>
        <Input
          id="rooms"
          name="rooms"
          type="number"
          min="0"
          value={propertyWithDefaults.rooms}
          onChange={onPropertyChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="ceilingHeight">Hauteur sous Plafond (m)</Label>
        <Input
          id="ceilingHeight"
          name="ceilingHeight"
          type="number"
          min="0"
          step="0.01"
          value={propertyWithDefaults.ceilingHeight}
          onChange={onPropertyChange}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PropertyForm;
