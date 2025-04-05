
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formaterPrix } from "@/lib/utils";
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';

interface SousTypeSelectProps {
  typeTravauxId: string | null;
  value: string | null;
  onChange: (value: string) => void;
}

const SousTypeSelect: React.FC<SousTypeSelectProps> = ({ typeTravauxId, value, onChange }) => {
  const { state } = useTravauxTypes();
  
  if (!typeTravauxId) return null;

  // Trouver le type de travaux sélectionné
  const selectedType = state.types.find(type => type.id === typeTravauxId);
  
  // Si le type n'existe pas ou n'a pas de sous-types, ne rien afficher
  if (!selectedType || !selectedType.sousTypes.length) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Prestations</label>
      <Select 
        value={value || ""} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez une prestation" />
        </SelectTrigger>
        <SelectContent>
          {selectedType.sousTypes.map(sousType => (
            <SelectItem key={sousType.id} value={sousType.id}>
              {sousType.label} ({formaterPrix(sousType.prixUnitaire)}/{sousType.unite})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SousTypeSelect;
