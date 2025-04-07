
import React, { useState } from 'react';
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { TravauxType } from '@/types';

interface TypeTravauxSelectProps {
  value: string;
  onChange: (id: string, label: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showAdminButtons?: boolean;
}

const TypeTravauxSelect: React.FC<TypeTravauxSelectProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner un type de travaux",
  disabled = false,
  className = "",
  showAdminButtons = false,
}) => {
  const { state, dispatch } = useTravauxTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TravauxType | null>(null);
  const [newTypeLabel, setNewTypeLabel] = useState('');
  
  // Réinitialiser les types (pour le développement)
  const resetTypes = () => {
    dispatch({ type: 'RESET_TYPES' });
    toast.success("Types de travaux réinitialisés");
  };
  
  // Gestionnaire de changement
  const handleChange = (typeId: string) => {
    const type = state.types.find(t => t.id === typeId);
    if (type) {
      onChange(type.id, type.label);
    }
  };
  
  // Ajouter un nouveau type
  const handleAddType = () => {
    if (!newTypeLabel.trim()) {
      toast.error("Veuillez saisir un nom pour le type de travaux");
      return;
    }
    
    if (editingType) {
      // Mettre à jour un type existant
      dispatch({
        type: 'UPDATE_TYPE',
        payload: {
          id: editingType.id,
          type: { ...editingType, label: newTypeLabel, nom: newTypeLabel }
        }
      });
      toast.success(`Type "${newTypeLabel}" mis à jour`);
    } else {
      // Ajouter un nouveau type
      const newType: TravauxType = {
        id: uuidv4(),
        nom: newTypeLabel,
        label: newTypeLabel,
        description: '',
        sousTypes: []
      };
      
      dispatch({ type: 'ADD_TYPE', payload: newType });
      toast.success(`Type "${newTypeLabel}" ajouté`);
    }
    
    setNewTypeLabel('');
    setEditingType(null);
    setIsDialogOpen(false);
  };
  
  // Éditer un type
  const startEditingType = (type: TravauxType) => {
    setEditingType(type);
    setNewTypeLabel(type.label);
    setIsDialogOpen(true);
  };
  
  // Supprimer un type
  const deleteType = (typeId: string) => {
    const typeName = state.types.find(t => t.id === typeId)?.label || "type";
    dispatch({ type: 'DELETE_TYPE', payload: typeId });
    toast.success(`Type "${typeName}" supprimé`);
    
    if (value === typeId) {
      onChange('', '');
    }
  };

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={handleChange}
        disabled={disabled || state.types.length === 0}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {state.types.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.icon && <type.icon className="mr-2 h-4 w-4" />}
                {type.label}
              </SelectItem>
            ))}
            {state.types.length === 0 && (
              <SelectItem value="none" disabled>
                Aucun type disponible
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {showAdminButtons && (
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter un type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingType ? "Modifier un type de travaux" : "Ajouter un type de travaux"}
                </DialogTitle>
                <DialogDescription>
                  {editingType 
                    ? "Modifiez les détails du type de travaux ci-dessous."
                    : "Créez un nouveau type de travaux pour vos estimations."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="typeName">Nom du type de travaux</Label>
                  <Input
                    id="typeName"
                    value={newTypeLabel}
                    onChange={(e) => setNewTypeLabel(e.target.value)}
                    placeholder="Ex: Peinture, Électricité, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingType(null);
                  setNewTypeLabel('');
                }}>
                  Annuler
                </Button>
                <Button type="button" onClick={handleAddType}>
                  {editingType ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {value && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const type = state.types.find(t => t.id === value);
                  if (type) startEditingType(type);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => deleteType(value)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={resetTypes}
            className="text-xs"
          >
            Réinitialiser
          </Button>
        </div>
      )}
    </div>
  );
};

export default TypeTravauxSelect;
