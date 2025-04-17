
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MarginsControlProps {
  label: string;
  values: [number, number, number, number];
  onChange: (values: [number, number, number, number]) => void;
  className?: string;
}

/**
 * Composant qui permet de configurer les marges (4 valeurs: gauche, haut, droite, bas)
 */
export const MarginsControl: React.FC<MarginsControlProps> = ({ 
  label, 
  values, 
  onChange, 
  className = '' 
}) => {
  const handleChange = (index: number, value: number) => {
    const newValues = [...values] as [number, number, number, number];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="grid grid-cols-4 gap-2">
        {values.map((value, index) => (
          <Input
            key={`margin-${index}`}
            type="number" 
            value={String(value)} 
            onChange={(e) => handleChange(index, Number(e.target.value))}
            aria-label={
              index === 0 ? 'Gauche' : 
              index === 1 ? 'Haut' : 
              index === 2 ? 'Droite' : 
              'Bas'
            }
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
        <div>Gauche</div>
        <div>Haut</div>
        <div>Droite</div>
        <div>Bas</div>
      </div>
    </div>
  );
};
