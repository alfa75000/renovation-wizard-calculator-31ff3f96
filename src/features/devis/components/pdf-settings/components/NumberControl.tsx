
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Composant qui permet de saisir une valeur numérique
 */
export const NumberControl: React.FC<NumberControlProps> = ({ 
  label, 
  value, 
  onChange, 
  step = 1, 
  min, 
  max,
  className = '' 
}) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input 
        type="number" 
        value={value} 
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
