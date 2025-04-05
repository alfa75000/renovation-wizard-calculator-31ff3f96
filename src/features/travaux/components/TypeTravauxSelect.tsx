
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types de travaux avec leurs icônes
const travauxTypes = [
  { id: "murs", label: "Revêtement murs", icon: "Paintbrush" },
  { id: "plafond", label: "Revêtement plafond", icon: "Paintbrush" },
  { id: "sol", label: "Revêtement sol", icon: "Wrench" },
  { id: "menuiseries", label: "Menuiseries", icon: "Hammer" },
  { id: "electricite", label: "Electricité", icon: "SquarePen" },
  { id: "plomberie", label: "Plomberie", icon: "SquarePen" },
  { id: "platrerie", label: "Plâtrerie", icon: "SquarePen" },
  { id: "maconnerie", label: "Maçonnerie", icon: "SquarePen" },
  { id: "autre", label: "Autre", icon: "Wrench" }
];

// Import dynamique des icônes
import { Paintbrush, Hammer, Wrench, SquarePen } from 'lucide-react';

interface TypeTravauxSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

const TypeTravauxSelect: React.FC<TypeTravauxSelectProps> = ({ value, onChange }) => {
  // Map pour les icônes
  const iconMap: Record<string, React.ReactNode> = {
    "Paintbrush": <Paintbrush className="h-4 w-4" />,
    "Hammer": <Hammer className="h-4 w-4" />,
    "Wrench": <Wrench className="h-4 w-4" />,
    "SquarePen": <SquarePen className="h-4 w-4" />,
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Type de travaux</label>
      <Select 
        value={value || ""} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un type de travaux" />
        </SelectTrigger>
        <SelectContent>
          {travauxTypes.map(type => (
            <SelectItem key={type.id} value={type.id}>
              <div className="flex items-center">
                {iconMap[type.icon]}
                <span className="ml-2">{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeTravauxSelect;
