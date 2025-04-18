
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Couleurs prédéfinies pour des sélections rapides
const PRESET_COLORS = [
  '#1A1F2C', // Dark Purple
  '#5F6673', // Neutral Gray
  '#9b87f5', // Primary Purple
  '#7E69AB', // Secondary Purple
  '#0EA5E9', // Ocean Blue
  '#F97316', // Bright Orange
  '#D946EF', // Magenta Pink
  '#22C55E', // Green
];

/**
 * Composant ColorPicker qui combine un sélecteur de couleur et un champ texte
 * pour visualiser et modifier une couleur, avec des présélections de couleurs
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Input 
            type="color" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-8 gap-1 mt-1">
          {PRESET_COLORS.map((color, index) => (
            <button
              key={index}
              type="button"
              className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
