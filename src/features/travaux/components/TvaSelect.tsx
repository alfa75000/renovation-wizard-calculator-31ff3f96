
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Taux de TVA disponibles
const tauxTVA = [
  { id: "0", taux: 0, label: "0 %" },
  { id: "5.5", taux: 5.5, label: "5,5 %" },
  { id: "10", taux: 10, label: "10 %" },
  { id: "20", taux: 20, label: "20 %" },
  { id: "autre", taux: 0, label: "Autre" }
];

interface TvaSelectProps {
  value: number;
  autreValue: number;
  onValueChange: (value: number) => void;
  onAutreValueChange: (value: number) => void;
}

const TvaSelect: React.FC<TvaSelectProps> = ({ 
  value, 
  autreValue, 
  onValueChange, 
  onAutreValueChange 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Taux de TVA Principal</label>
      <div className="flex gap-2">
        <Select 
          value={value === 0 && autreValue > 0 ? "autre" : value.toString()} 
          onValueChange={(val) => {
            if (val === "autre") {
              onValueChange(0);
            } else {
              onValueChange(parseFloat(val));
            }
          }}
        >
          <SelectTrigger className="flex-grow">
            <SelectValue placeholder="Sélectionnez un taux de TVA" />
          </SelectTrigger>
          <SelectContent>
            {tauxTVA.map(taux => (
              <SelectItem key={taux.id} value={taux.id}>
                {taux.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {(value === 0 || tauxTVA.find(t => t.id === "autre")?.id === value.toString()) && (
          <div className="flex items-center">
            <Input 
              type="number"
              value={autreValue}
              onChange={(e) => onAutreValueChange(parseFloat(e.target.value) || 0)}
              className="w-24"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="ml-1">%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvaSelect;
