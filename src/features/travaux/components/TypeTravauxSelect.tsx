
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTravauxTypes, TravauxType } from "@/contexts/TravauxTypesContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

interface TypeTravauxSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

interface SimpleTravauxType {
  id: string;
  nom: string;
  label: string;
  description: string;
  icon: string;
  sousTypes: any[];
}

const TypeTravauxSelect = ({ 
  value, 
  onChange, 
  label = "Type de travaux", 
  placeholder = "Sélectionner un type", 
  disabled = false,
  error
}: TypeTravauxSelectProps) => {
  const { state, dispatch } = useTravauxTypes();
  const { types } = state;
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  
  // Assurons-nous que la valeur existe toujours dans les options
  useEffect(() => {
    if (value && types.length > 0 && !types.some(type => type.id === value)) {
      onChange("");
    }
  }, [value, types, onChange]);
  
  const handleAddNewType = () => {
    if (newTypeName.trim()) {
      const newType: SimpleTravauxType = {
        id: uuidv4(),
        nom: newTypeName.trim(),
        label: newTypeName.trim(),
        description: newTypeDesc.trim(),
        icon: "Wrench", // Icône par défaut
        sousTypes: []
      };
      
      dispatch({ type: 'ADD_TYPE', payload: newType as TravauxType });
      onChange(newType.id);
      setNewTypeName("");
      setNewTypeDesc("");
      setOpenDialog(false);
    }
  };
  
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      
      <div className="flex gap-2">
        <Select 
          value={value} 
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          disabled={disabled}
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
            <Button onClick={handleAddNewType}>
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TypeTravauxSelect;
