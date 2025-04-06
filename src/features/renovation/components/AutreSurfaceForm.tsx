
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AutreSurface, TypeAutreSurface } from "@/types";
import { arrondir2Decimales } from "@/lib/utils";

interface AutreSurfaceFormProps {
  onAddAutreSurface: (autreSurface: Omit<AutreSurface, "id" | "surface">) => void;
  editingSurface: string | null;
  currentSurface: Omit<AutreSurface, "id" | "surface"> | null;
  onCancelEdit: () => void;
  typesAutresSurfaces: TypeAutreSurface[];
}

const AutreSurfaceForm: React.FC<AutreSurfaceFormProps> = ({ 
  onAddAutreSurface, 
  editingSurface, 
  currentSurface,
  onCancelEdit,
  typesAutresSurfaces
}) => {
  const [newAutreSurface, setNewAutreSurface] = useState<Omit<AutreSurface, "id" | "surface">>({
    type: "",
    name: "",
    largeur: 0.5,
    hauteur: 0.5,
    quantity: 1,
    surfaceImpactee: "mur",
    estDeduction: false
  });

  useEffect(() => {
    if (currentSurface && editingSurface) {
      setNewAutreSurface(currentSurface);
    }
  }, [currentSurface, editingSurface]);

  const handleSurfaceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    const selectedType = typesAutresSurfaces.find(type => type.id === typeId);
    
    if (selectedType) {
      setNewAutreSurface(prev => ({
        ...prev,
        type: selectedType.nom,
        surfaceImpactee: selectedType.surfaceImpacteeParDefaut || 'mur',
        estDeduction: selectedType.estDeduction || false
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "largeur" || name === "hauteur" || name === "quantity") {
      const numValue = parseFloat(value) || 0;
      setNewAutreSurface(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setNewAutreSurface(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSurfaceImpacteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAutreSurface(prev => ({
      ...prev,
      surfaceImpactee: e.target.value
    }));
  };

  const handleEstDeductionChange = (value: string) => {
    setNewAutreSurface(prev => ({
      ...prev,
      estDeduction: value === "deduire"
    }));
  };

  const handleSubmit = () => {
    if (!newAutreSurface.type) {
      alert("Veuillez sélectionner un type de surface");
      return;
    }
    
    onAddAutreSurface(newAutreSurface);
    
    // Réinitialiser le formulaire
    setNewAutreSurface({
      type: "",
      name: "",
      largeur: 0.5,
      hauteur: 0.5,
      quantity: 1,
      surfaceImpactee: "mur",
      estDeduction: false
    });
  };

  const calculerSurface = () => {
    return arrondir2Decimales(newAutreSurface.largeur * newAutreSurface.hauteur);
  };

  return (
    <div className="border p-3 rounded bg-white">
      <h4 className="text-md font-medium mb-3">Ajouter une autre surface</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div>
          <Label htmlFor="autreType">Type</Label>
          <select
            id="autreType"
            name="type"
            value={typesAutresSurfaces.find(t => t.nom === newAutreSurface.type)?.id || ""}
            onChange={handleSurfaceTypeChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Sélectionner un type</option>
            {typesAutresSurfaces.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nom}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="autreName">Nom</Label>
          <Input
            id="autreName"
            name="name"
            value={newAutreSurface.name}
            onChange={handleChange}
            placeholder="Optionnel"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="autreLargeur">Largeur (m)</Label>
          <Input
            id="autreLargeur"
            name="largeur"
            type="number"
            min="0"
            step="0.01"
            value={newAutreSurface.largeur}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="autreHauteur">Hauteur (m)</Label>
          <Input
            id="autreHauteur"
            name="hauteur"
            type="number"
            min="0"
            step="0.01"
            value={newAutreSurface.hauteur}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="autreSurfaceImpactee">Surface impactée</Label>
          <select
            id="autreSurfaceImpactee"
            name="surfaceImpactee"
            value={newAutreSurface.surfaceImpactee}
            onChange={handleSurfaceImpacteeChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="mur">Mur</option>
            <option value="plafond">Plafond</option>
            <option value="sol">Sol</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="autreQuantity">Quantité</Label>
          <Input
            id="autreQuantity"
            name="quantity"
            type="number"
            min="1"
            value={newAutreSurface.quantity}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <Label>Type d'impact</Label>
        <RadioGroup
          value={newAutreSurface.estDeduction ? "deduire" : "ajouter"}
          onValueChange={handleEstDeductionChange}
          className="flex space-x-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ajouter" id="ajouter" />
            <Label htmlFor="ajouter" className="cursor-pointer">Ajouter cette surface</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="deduire" id="deduire" />
            <Label htmlFor="deduire" className="cursor-pointer">Déduire cette surface</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-sm font-medium">Surface calculée: {calculerSurface()} m²</span>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-sm font-medium">
            Surface totale: {arrondir2Decimales(calculerSurface() * newAutreSurface.quantity)} m²
          </span>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {editingSurface && (
          <Button 
            onClick={onCancelEdit}
            variant="outline"
          >
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          variant="default"
        >
          {editingSurface ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </div>
  );
};

export default AutreSurfaceForm;
