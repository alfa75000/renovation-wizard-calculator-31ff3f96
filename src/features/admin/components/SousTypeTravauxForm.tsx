
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SousTypeTravauxItem } from "@/contexts/TravauxTypesContext";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SousTypeTravauxFormProps {
  isOpen: boolean;
  onClose: () => void;
  sousTypeToEdit: SousTypeTravauxItem | null;
  typeId: string;
  onSubmit: (data: Partial<SousTypeTravauxItem>) => void;
}

// Génère un ID unique basé sur le label
const generateId = (label: string) => {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Options d'unités disponibles
const uniteOptions = [
  { id: "M²", label: "M² (mètre carré)" },
  { id: "Ml", label: "Ml (mètre linéaire)" },
  { id: "Unité", label: "Unité" },
  { id: "Ens.", label: "Ensemble" },
  { id: "Forfait", label: "Forfait" },
  { id: "M3", label: "M³ (mètre cube)" }
];

const SousTypeTravauxForm: React.FC<SousTypeTravauxFormProps> = ({
  isOpen,
  onClose,
  sousTypeToEdit,
  typeId,
  onSubmit
}) => {
  const [formData, setFormData] = useState<{
    id: string;
    label: string;
    prixUnitaire: string;
    prixFournitures: string;
    prixMainOeuvre: string;
    unite: string;
    description: string;
  }>({
    id: sousTypeToEdit?.id || "",
    label: sousTypeToEdit?.label || "",
    prixUnitaire: sousTypeToEdit ? sousTypeToEdit.prixUnitaire.toString() : "0",
    prixFournitures: sousTypeToEdit?.prixFournitures ? sousTypeToEdit.prixFournitures.toString() : "0",
    prixMainOeuvre: sousTypeToEdit?.prixMainOeuvre ? sousTypeToEdit.prixMainOeuvre.toString() : "0",
    unite: sousTypeToEdit?.unite || "M²",
    description: sousTypeToEdit?.description || ""
  });

  // Calcul automatique du prix unitaire total
  useEffect(() => {
    const fournitures = parseFloat(formData.prixFournitures) || 0;
    const mainOeuvre = parseFloat(formData.prixMainOeuvre) || 0;
    setFormData(prev => ({
      ...prev,
      prixUnitaire: (fournitures + mainOeuvre).toString()
    }));
  }, [formData.prixFournitures, formData.prixMainOeuvre]);

  // Mise à jour du formulaire lorsque sousTypeToEdit change
  useEffect(() => {
    if (sousTypeToEdit) {
      // S'il n'y a pas de prix séparés, calculer approximativement
      const prixTotal = sousTypeToEdit.prixUnitaire;
      const prixFournitures = sousTypeToEdit.prixFournitures !== undefined 
        ? sousTypeToEdit.prixFournitures 
        : prixTotal * 0.4;
      const prixMainOeuvre = sousTypeToEdit.prixMainOeuvre !== undefined 
        ? sousTypeToEdit.prixMainOeuvre 
        : prixTotal * 0.6;

      setFormData({
        id: sousTypeToEdit.id,
        label: sousTypeToEdit.label,
        prixUnitaire: prixTotal.toString(),
        prixFournitures: prixFournitures.toString(),
        prixMainOeuvre: prixMainOeuvre.toString(),
        unite: sousTypeToEdit.unite,
        description: sousTypeToEdit.description || ""
      });
    } else {
      setFormData({
        id: "",
        label: "",
        prixUnitaire: "0",
        prixFournitures: "0",
        prixMainOeuvre: "0",
        unite: "M²",
        description: ""
      });
    }
  }, [sousTypeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID si c'est un nouvel élément
    const id = sousTypeToEdit ? sousTypeToEdit.id : generateId(formData.label);
    
    onSubmit({
      id,
      label: formData.label,
      prixUnitaire: parseFloat(formData.prixUnitaire),
      prixFournitures: parseFloat(formData.prixFournitures),
      prixMainOeuvre: parseFloat(formData.prixMainOeuvre),
      unite: formData.unite,
      description: formData.description
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
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
                Prix fournitures
              </Label>
              <Input
                id="prixFournitures"
                type="number"
                min="0"
                step="0.01"
                value={formData.prixFournitures}
                onChange={(e) => setFormData({ ...formData, prixFournitures: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixMainOeuvre" className="text-right">
                Prix main d'œuvre
              </Label>
              <Input
                id="prixMainOeuvre"
                type="number"
                min="0"
                step="0.01"
                value={formData.prixMainOeuvre}
                onChange={(e) => setFormData({ ...formData, prixMainOeuvre: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixUnitaire" className="text-right">
                Prix unitaire total
              </Label>
              <div className="col-span-3 py-2 px-3 bg-gray-100 rounded border border-gray-200">
                {parseFloat(formData.prixUnitaire).toFixed(2)} €
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unite" className="text-right">
                Unité
              </Label>
              <Select
                value={formData.unite}
                onValueChange={(value) => setFormData({ ...formData, unite: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une unité" />
                </SelectTrigger>
                <SelectContent>
                  {uniteOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3 min-h-[80px]"
                placeholder="Description détaillée de la prestation"
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
