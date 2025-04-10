
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SurfaceImpactee } from '@/types';

interface SurfaceImpacteeSelectProps {
  value: SurfaceImpactee;
  onChange: (value: SurfaceImpactee) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const surfacesOptions: { value: SurfaceImpactee; label: string }[] = [
  { value: 'Mur', label: 'Murs' },
  { value: 'Plafond', label: 'Plafond' },
  { value: 'Sol', label: 'Sol' },
  { value: 'Aucune', label: 'Aucune (quantité directe)' }
];

const SurfaceImpacteeSelect: React.FC<SurfaceImpacteeSelectProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner une surface",
  disabled = false,
  className = "",
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as SurfaceImpactee)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {surfacesOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SurfaceImpacteeSelect;
