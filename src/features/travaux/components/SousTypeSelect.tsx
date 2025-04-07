
import React, { useMemo } from 'react';
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SousTypeTravauxItem } from '@/types';

interface SousTypeSelectProps {
  typeTravauxId: string;
  value: string;
  onChange: (id: string, label: string, sousType: SousTypeTravauxItem) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SousTypeSelect: React.FC<SousTypeSelectProps> = ({
  typeTravauxId,
  value,
  onChange,
  placeholder = "Sélectionner un sous-type",
  disabled = false,
  className = "",
}) => {
  const { state } = useTravauxTypes();
  
  // Récupérer les sous-types pour le type de travaux sélectionné
  const sousTypes = useMemo(() => {
    const typeTravaux = state.types.find(type => type.id === typeTravauxId);
    return typeTravaux ? typeTravaux.sousTypes : [];
  }, [state.types, typeTravauxId]);

  // Gestionnaire de changement
  const handleChange = (sousTypeId: string) => {
    const sousType = sousTypes.find(st => st.id === sousTypeId);
    if (sousType) {
      onChange(sousType.id, sousType.label, sousType);
    }
  };

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled || sousTypes.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sousTypes.map((sousType) => (
            <SelectItem key={sousType.id} value={sousType.id}>
              {sousType.label} ({sousType.prixUnitaire}€/{sousType.unite})
            </SelectItem>
          ))}
          {sousTypes.length === 0 && (
            <SelectItem value="none" disabled>
              Aucun sous-type disponible
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SousTypeSelect;
