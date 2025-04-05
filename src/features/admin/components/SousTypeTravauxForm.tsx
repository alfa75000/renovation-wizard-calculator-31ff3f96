
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SousTypeTravauxItem } from "@/contexts/TravauxTypesContext";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    unite: string;
    description: string;
  }>({
    id: sousTypeToEdit?.id || "",
    label: sousTypeToEdit?.label || "",
    prixUnitaire: sousTypeToEdit ? sousTypeToEdit.prixUnitaire.toString() : "0",
    unite: sousTypeToEdit?.unite || "M²",
    description: sousTypeToEdit?.description || ""
  });

  // Mise à jour du formulaire lorsque sousTypeToEdit change
  useEffect(() => {
    if (sousTypeToEdit) {
      setFormData({
        id: sousTypeToEdit.id,
        label: sousTypeToEdit.label,
        prixUnitaire: sousTypeToEdit.prixUnitaire.toString(),
        unite: sousTypeToEdit.unite,
        description: sousTypeToEdit.description || ""
      });
    } else {
      setFormData({
        id: "",
        label: "",
        prixUnitaire: "0",
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
              <Label htmlFor="prixUnitaire" className="text-right">
                Prix unitaire
              </Label>
              <Input
                id="prixUnitaire"
                type="number"
                min="0"
                step="0.01"
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: e.target.value })}
                className="col-span-3"
                required
              />
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
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
