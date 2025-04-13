
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UniteType } from "@/types/supabase";

// Unités de mesure disponibles, matching our unit_enum in the database
export const unites: UniteType[] = ["M²", "Ml", "M³", "Unité", "Ens.", "Forfait"];

interface UniteSelectProps {
  value: UniteType;
  onChange: (value: UniteType) => void;
  defaultValue?: UniteType;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const UniteSelect: React.FC<UniteSelectProps> = ({ 
  value, 
  onChange, 
  defaultValue = "M²",
  label,
  required = false,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={className}>
      {label && (
        <Label className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select 
        value={value || defaultValue} 
        onValueChange={onChange}
        disabled={disabled}
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
    </div>
  );
};

export default UniteSelect;
