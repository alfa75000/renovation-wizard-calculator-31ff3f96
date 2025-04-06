
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypeTravauxItem } from "@/contexts/TravauxTypesContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { 
  Paintbrush, 
  Hammer, 
  Wrench, 
  SquarePen, 
  Home, 
  Droplet, 
  Power, 
  LucideRoof, 
  Pipette, 
  Cpu, 
  CircuitBoard,
  Flame,
  Cable,
  Wall
} from "lucide-react";

interface TypeTravauxFormProps {
  isOpen: boolean;
  onClose: () => void;
  typeToEdit: TypeTravauxItem | null;
  onSubmit: (data: TypeTravauxItem) => void;
}

// Génère un ID unique basé sur le label (pour les nouveaux types)
const generateId = (label: string) => {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const iconeOptions = [
  { id: "Paintbrush", label: "Peinture", icon: <Paintbrush className="h-4 w-4" /> },
  { id: "Hammer", label: "Marteau", icon: <Hammer className="h-4 w-4" /> },
  { id: "Wrench", label: "Clé", icon: <Wrench className="h-4 w-4" /> },
  { id: "SquarePen", label: "Crayon", icon: <SquarePen className="h-4 w-4" /> },
  { id: "Power", label: "Prise électrique", icon: <Power className="h-4 w-4" /> },
  { id: "LucideRoof", label: "Toiture", icon: <LucideRoof className="h-4 w-4" /> },
  { id: "Droplet", label: "Robinet", icon: <Droplet className="h-4 w-4" /> },
  { id: "Home", label: "Maison", icon: <Home className="h-4 w-4" /> },
  { id: "Pipette", label: "Pipette", icon: <Pipette className="h-4 w-4" /> },
  { id: "Cpu", label: "CPU", icon: <Cpu className="h-4 w-4" /> },
  { id: "CircuitBoard", label: "Circuit", icon: <CircuitBoard className="h-4 w-4" /> },
  { id: "Flame", label: "Chauffage", icon: <Flame className="h-4 w-4" /> },
  { id: "Cable", label: "Câblage", icon: <Cable className="h-4 w-4" /> },
  { id: "Wall", label: "Mur", icon: <Wall className="h-4 w-4" /> }
];

const TypeTravauxForm: React.FC<TypeTravauxFormProps> = ({
  isOpen,
  onClose,
  typeToEdit,
  onSubmit
}) => {
  const [formData, setFormData] = useState<{
    id: string;
    label: string;
    icon: string;
  }>({
    id: typeToEdit?.id || "",
    label: typeToEdit?.label || "",
    icon: typeToEdit?.icon || "Wrench"
  });

  // Mise à jour du formulaire lorsque typeToEdit change
  useEffect(() => {
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        label: typeToEdit.label,
        icon: typeToEdit.icon
      });
    } else {
      setFormData({
        id: "",
        label: "",
        icon: "Wrench"
      });
    }
  }, [typeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID si c'est un nouvel élément
    const id = typeToEdit ? typeToEdit.id : generateId(formData.label);
    
    onSubmit({
      id,
      label: formData.label,
      icon: formData.icon,
      sousTypes: typeToEdit?.sousTypes || []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {typeToEdit ? "Modifier le type de travaux" : "Ajouter un type de travaux"}
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
              <Label htmlFor="icon" className="text-right">
                Icône
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une icône" />
                </SelectTrigger>
                <SelectContent>
                  {iconeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {typeToEdit ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TypeTravauxForm;
