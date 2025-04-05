
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Unités de mesure disponibles
const unites = ["M²", "Ml", "M3", "Unité", "Ens.", "Forfait"];

interface UniteSelectProps {
  value: string | null;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const UniteSelect: React.FC<UniteSelectProps> = ({ value, onChange, defaultValue = "M²" }) => {
  return (
    <Select 
      value={value || defaultValue} 
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Unité" />
      </SelectTrigger>
      <SelectContent>
        {unites.map(unite => (
          <SelectItem key={unite} value={unite}>
            {unite}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UniteSelect;
