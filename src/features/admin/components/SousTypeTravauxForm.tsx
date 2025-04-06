
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SousTypeTravauxItem, surfacesReference } from "@/contexts/TravauxTypesContext";
import { v4 as uuidv4 } from 'uuid';

interface SousTypeTravauxFormProps {
  isOpen: boolean;
  onClose: () => void;
  sousTypeToEdit: SousTypeTravauxItem | null;
  onSubmit: (data: SousTypeTravauxItem) => void;
}

const unites = [
  { id: "M²", label: "M²" },
  { id: "Ml", label: "Mètre linéaire" },
  { id: "Unité", label: "Unité" },
  { id: "Ens.", label: "Ensemble" },
  { id: "Forfait", label: "Forfait" },
  { id: "M3", label: "M³" }
];

const SousTypeTravauxForm: React.FC<SousTypeTravauxFormProps> = ({
  isOpen,
  onClose,
  sousTypeToEdit,
  onSubmit
}) => {
  const [formData, setFormData] = useState<SousTypeTravauxItem>({
    id: "",
    label: "",
    prixUnitaire: 0,
    prixFournitures: 0,
    prixMainOeuvre: 0,
    unite: "M²",
    description: "",
    surfaceReference: "SurfaceNetteMurs"
  });

  useEffect(() => {
    if (sousTypeToEdit) {
      setFormData({
        ...sousTypeToEdit
      });
    } else {
      // Valeurs par défaut pour un nouveau sous-type
      setFormData({
        id: "",
        label: "",
        prixUnitaire: 0,
        prixFournitures: 0,
        prixMainOeuvre: 0,
        unite: "M²",
        description: "",
        surfaceReference: "SurfaceNetteMurs"
      });
    }
  }, [sousTypeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedPrixUnitaire = 
      (formData.prixFournitures || 0) + (formData.prixMainOeuvre || 0);
    
    const finalData: SousTypeTravauxItem = {
      ...formData,
      id: formData.id || uuidv4(),
      prixUnitaire: calculatedPrixUnitaire
    };
    
    onSubmit(finalData);
  };

  const handlePrixChange = (key: 'prixFournitures' | 'prixMainOeuvre', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newFormData = {
      ...formData,
      [key]: numValue
    };
    
    // Recalculer le prix unitaire
    const prixFournitures = key === 'prixFournitures' ? numValue : (formData.prixFournitures || 0);
    const prixMainOeuvre = key === 'prixMainOeuvre' ? numValue : (formData.prixMainOeuvre || 0);
    
    setFormData({
      ...newFormData,
      prixUnitaire: prixFournitures + prixMainOeuvre
    });
  };

  const handleUniteChange = (unite: string) => {
    // Déterminer la surface de référence en fonction de l'unité
    let surfaceReference = formData.surfaceReference;
    
    if (unite === "M²") {
      surfaceReference = "SurfaceNetteMurs"; // Valeur par défaut pour M²
    } else if (unite === "Ml") {
      surfaceReference = "LineaireNet";
    } else if (unite === "Unité" || unite === "Ens.") {
      surfaceReference = "Unite";
    } else if (unite === "Forfait") {
      surfaceReference = "Forfait";
    } else if (unite === "M3") {
      surfaceReference = "Volume";
    }
    
    setFormData({
      ...formData,
      unite,
      surfaceReference
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {sousTypeToEdit ? "Modifier la prestation" : "Ajouter une prestation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Nom
              </Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixFournitures" className="text-right">
                Prix fournitures (€)
              </Label>
              <Input
                id="prixFournitures"
                type="number"
                min="0"
                step="0.01"
                value={formData.prixFournitures}
                onChange={(e) => handlePrixChange('prixFournitures', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixMainOeuvre" className="text-right">
                Prix main d'œuvre (€)
              </Label>
              <Input
                id="prixMainOeuvre"
                type="number"
                min="0"
                step="0.01"
                value={formData.prixMainOeuvre}
                onChange={(e) => handlePrixChange('prixMainOeuvre', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Prix unitaire (€)
              </Label>
              <div className="col-span-3 bg-gray-100 p-2 rounded">
                {formData.prixUnitaire.toFixed(2)} €
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unite" className="text-right">
                Unité
              </Label>
              <Select
                value={formData.unite}
                onValueChange={handleUniteChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une unité" />
                </SelectTrigger>
                <SelectContent>
                  {unites.map((unite) => (
                    <SelectItem key={unite.id} value={unite.id}>
                      {unite.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="surfaceReference" className="text-right">
                Surface de référence
              </Label>
              <Select
                value={formData.surfaceReference}
                onValueChange={(value) => setFormData({ ...formData, surfaceReference: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une surface" />
                </SelectTrigger>
                <SelectContent>
                  {surfacesReference.map((surface) => (
                    <SelectItem key={surface.id} value={surface.id}>
                      {surface.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {sousTypeToEdit ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SousTypeTravauxForm;
