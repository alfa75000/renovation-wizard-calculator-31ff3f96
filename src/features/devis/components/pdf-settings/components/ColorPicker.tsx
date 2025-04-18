
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Composant ColorPicker qui combine un sélecteur de couleur et un champ texte
 * pour visualiser et modifier une couleur
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange, 
  className = '' 
}) => {
  // Prévisualisation de la couleur
  const previewStyle = {
    backgroundColor: value,
    width: '100%',
    height: '10px',
    borderRadius: '2px',
    marginTop: '2px'
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
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
      <div style={previewStyle}></div>
    </div>
  );
};
