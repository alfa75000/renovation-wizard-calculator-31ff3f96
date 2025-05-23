//src/features/travaux/components/TypeTravauxSelect.tsx
import React, { useState, useEffect } from "react"; // <-- AJOUTE 'React' ICI
//import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { WorkType } from "@/types/supabase";
import { fetchWorkTypes } from "@/services/travauxService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createWorkType } from "@/services/travauxService";

interface TypeTravauxSelectProps {
  value: string;
  onChange: (id: string, label: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const TypeTravauxSelect = ({ 
  value, 
  onChange, 
  label = "Type de travaux", 
  placeholder = "Sélectionner un type", 
  disabled = false,
  error
}: TypeTravauxSelectProps) => {
  const [types, setTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  
  // Charger les types de travaux depuis Supabase
  useEffect(() => {
    const loadWorkTypes = async () => {
      setLoading(true);
      try {
        console.log("TypeTravauxSelect - Début du chargement des types de travaux");
        const data = await fetchWorkTypes();
        console.log("TypeTravauxSelect - Types de travaux récupérés:", data);
        setTypes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des types de travaux:", error);
        toast.error("Impossible de charger les types de travaux");
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkTypes();
  }, []);
  
  // Vérifier que la valeur sélectionnée existe toujours dans les options
  useEffect(() => {
    if (value && types.length > 0 && !types.some(type => type.id === value)) {
      onChange("", "");
    }
  }, [value, types, onChange]);
  
  const handleChange = (newValue: string) => {
    const selectedType = types.find(type => type.id === newValue);
    if (selectedType) {
      onChange(selectedType.id, selectedType.name);
    }
  };
  
  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Le nom du type est requis");
      return;
    }
    
    setLoading(true);
    try {
      const newType = await createWorkType(newTypeName);
      if (newType) {
        setTypes(prev => [...prev, newType]);
        setOpenDialog(false);
        setNewTypeName("");
        setNewTypeDesc("");
        toast.success("Type de travaux ajouté avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du type:", error);
      toast.error("Impossible d'ajouter le type de travaux");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      
      <div className="flex gap-2">
        <Select 
          value={value} 
          onValueChange={handleChange}
          disabled={disabled || loading}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={loading ? "Chargement..." : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {types.length > 0 ? (
              types.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-gray-500">
                {loading ? "Chargement..." : "Aucun type disponible"}
              </div>
            )}
          </SelectContent>
        </Select>
        
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          disabled={disabled || loading}
          onClick={() => setOpenDialog(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau type de travaux</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="typeName">Nom du type</Label>
              <Input
                id="typeName"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Ex: Plomberie, Électricité, ..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="typeDesc">Description (optionnelle)</Label>
              <Textarea
                id="typeDesc"
                value={newTypeDesc}
                onChange={(e) => setNewTypeDesc(e.target.value)}
                placeholder="Description du type de travaux"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddNewType} disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TypeTravauxSelect;
