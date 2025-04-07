
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SousTypeTravauxItem, surfacesReference } from "@/contexts/TravauxTypesContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

interface SousTypeTravauxFormProps {
  isOpen: boolean;
  onClose: () => void;
  sousTypeToEdit: SousTypeTravauxItem | null;
  onSubmit: (data: SousTypeTravauxItem) => void;
}

const SousTypeTravauxForm: React.FC<SousTypeTravauxFormProps> = ({
  isOpen,
  onClose,
  sousTypeToEdit,
  onSubmit
}) => {
  const [formData, setFormData] = useState<SousTypeTravauxItem>({
    id: sousTypeToEdit?.id || "",
    typeTravauxId: sousTypeToEdit?.typeTravauxId || "",
    nom: sousTypeToEdit?.nom || "",
    label: sousTypeToEdit?.label || "",
    description: sousTypeToEdit?.description || "",
    unite: sousTypeToEdit?.unite || "m²",
    uniteParDefaut: sousTypeToEdit?.uniteParDefaut || "m²",
    prixUnitaire: sousTypeToEdit?.prixUnitaire || 0,
    prixFournitures: sousTypeToEdit?.prixFournitures || 0,
    prixFournituresUnitaire: sousTypeToEdit?.prixFournituresUnitaire || 0,
    prixMainOeuvre: sousTypeToEdit?.prixMainOeuvre || 0,
    prixMainOeuvreUnitaire: sousTypeToEdit?.prixMainOeuvreUnitaire || 0,
    tempsMoyenMinutes: sousTypeToEdit?.tempsMoyenMinutes || 0,
    tauxTVA: sousTypeToEdit?.tauxTVA || 10,
    surfaceReference: sousTypeToEdit?.surfaceReference || "murs"
  });

  // Mise à jour du formulaire lorsque sousTypeToEdit change
  useEffect(() => {
    if (sousTypeToEdit) {
      setFormData(sousTypeToEdit);
    } else {
      setFormData({
        id: "",
        typeTravauxId: "",
        nom: "",
        label: "",
        description: "",
        unite: "m²",
        uniteParDefaut: "m²",
        prixUnitaire: 0,
        prixFournitures: 0,
        prixFournituresUnitaire: 0,
        prixMainOeuvre: 0,
        prixMainOeuvreUnitaire: 0,
        tempsMoyenMinutes: 0,
        tauxTVA: 10,
        surfaceReference: "murs"
      });
    }
  }, [sousTypeToEdit]);

  // Calcul automatique du prix unitaire lorsque les prix de fournitures ou de main d'œuvre changent
  useEffect(() => {
    const prixUnitaire = formData.prixFournitures + formData.prixMainOeuvre;
    setFormData(prev => ({
      ...prev,
      prixUnitaire
    }));
  }, [formData.prixFournitures, formData.prixMainOeuvre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID si c'est un nouvel élément
    const updatedFormData = {
      ...formData,
      id: sousTypeToEdit ? sousTypeToEdit.id : uuidv4(),
      nom: formData.label // Utiliser le label comme nom si le nom n'est pas défini
    };
    
    onSubmit(updatedFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="surfaceReference" className="text-right">
                Référence de surface
              </Label>
              <Select
                value={formData.surfaceReference}
                onValueChange={(value) => setFormData({ ...formData, surfaceReference: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une référence" />
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
              <Label htmlFor="unite" className="text-right">
                Unité
              </Label>
              <Select
                value={formData.unite}
                onValueChange={(value) => setFormData({ ...formData, unite: value, uniteParDefaut: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m²">m² (mètre carré)</SelectItem>
                  <SelectItem value="ml">ml (mètre linéaire)</SelectItem>
                  <SelectItem value="u">u (unité)</SelectItem>
                  <SelectItem value="h">h (heure)</SelectItem>
                  <SelectItem value="forfait">forfait</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixFournitures" className="text-right">
                Prix fournitures
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="prixFournitures"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prixFournitures}
                  onChange={(e) => setFormData({ ...formData, prixFournitures: parseFloat(e.target.value) || 0 })}
                  className="flex-1"
                />
                <span className="ml-2">€</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixMainOeuvre" className="text-right">
                Prix main d'œuvre
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="prixMainOeuvre"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prixMainOeuvre}
                  onChange={(e) => setFormData({ ...formData, prixMainOeuvre: parseFloat(e.target.value) || 0 })}
                  className="flex-1"
                />
                <span className="ml-2">€</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prixUnitaire" className="text-right">
                Prix unitaire total
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="prixUnitaire"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prixUnitaire}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <span className="ml-2">€ / {formData.unite}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tauxTVA" className="text-right">
                Taux de TVA
              </Label>
              <Select
                value={formData.tauxTVA.toString()}
                onValueChange={(value) => setFormData({ ...formData, tauxTVA: parseFloat(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un taux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5.5">5.5% - Travaux de rénovation énergétique</SelectItem>
                  <SelectItem value="10">10% - Travaux de rénovation</SelectItem>
                  <SelectItem value="20">20% - Taux normal</SelectItem>
                </SelectContent>
              </Select>
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
