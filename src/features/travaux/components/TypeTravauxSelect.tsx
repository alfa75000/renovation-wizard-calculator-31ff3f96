
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';

// Import des icônes disponibles
import { 
  Paintbrush, 
  Hammer, 
  Wrench, 
  SquarePen, 
  Home, 
  Droplet, 
  Power, 
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
  const { state, dispatch } = useTravauxTypes();
  
  // Vérification du contenu de state.types au chargement
  useEffect(() => {
    console.log("Types de travaux disponibles:", state.types.map(t => ({ id: t.id, label: t.label })));
    
    // Vérifier si "Menuiseries existantes" est présent
    const hasMenuiseriesExistantes = state.types.some(type => type.id === "menuiseries-existantes");
    console.log("'Menuiseries existantes' est présent:", hasMenuiseriesExistantes);
    
    // Si pas présent, forcer une réinitialisation
    if (!hasMenuiseriesExistantes && state.types.length > 0) {
      console.log("Réinitialisation des types de travaux car 'Menuiseries existantes' est manquant");
      dispatch({ type: 'RESET_TYPES' });
    }
  }, [state.types, dispatch]);
  
  // Map pour les icônes
  const iconMap: Record<string, React.ReactNode> = {
    "Paintbrush": <Paintbrush className="h-4 w-4" />,
    "Hammer": <Hammer className="h-4 w-4" />,
    "Wrench": <Wrench className="h-4 w-4" />,
    "SquarePen": <SquarePen className="h-4 w-4" />,
    "Power": <Power className="h-4 w-4" />,
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
