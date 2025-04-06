
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';

// Import dynamique des icônes
import { 
  Paintbrush, 
  Hammer, 
  Wrench, 
  SquarePen, 
  Home, 
  Droplet, 
  Power, 
  Roofing, 
  Pipette, 
  Cpu, 
  CircuitBoard,
  Flame,
  Cable,
  Building
} from 'lucide-react';

interface TypeTravauxSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

const TypeTravauxSelect: React.FC<TypeTravauxSelectProps> = ({ value, onChange }) => {
  const { state } = useTravauxTypes();
  
  // Map pour les icônes
  const iconMap: Record<string, React.ReactNode> = {
    "Paintbrush": <Paintbrush className="h-4 w-4" />,
    "Hammer": <Hammer className="h-4 w-4" />,
    "Wrench": <Wrench className="h-4 w-4" />,
    "SquarePen": <SquarePen className="h-4 w-4" />,
    "Power": <Power className="h-4 w-4" />,
    "Roofing": <Roofing className="h-4 w-4" />,
    "Droplet": <Droplet className="h-4 w-4" />,
    "Home": <Home className="h-4 w-4" />,
    "Pipette": <Pipette className="h-4 w-4" />,
    "Cpu": <Cpu className="h-4 w-4" />,
    "CircuitBoard": <CircuitBoard className="h-4 w-4" />,
    "Flame": <Flame className="h-4 w-4" />,
    "Cable": <Cable className="h-4 w-4" />,
    "Building": <Building className="h-4 w-4" />
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
          {state.types.map(type => (
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
