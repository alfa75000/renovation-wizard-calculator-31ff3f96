
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';

interface ColorPaletteProps {
  selectedColor: string;
  defaultColors: string[];
  onColorChange: (color: string) => void;
  onDefaultColorClick: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  defaultColors,
  onColorChange,
  onDefaultColorClick
}) => {
  // Stocker les états locaux des couleurs de la palette
  const [paletteColors, setPaletteColors] = useState<string[]>(defaultColors);
  
  // Fonction pour mettre à jour une couleur de la palette sans l'appliquer
  const handlePaletteColorChange = (index: number, newColor: string) => {
    const updatedColors = [...paletteColors];
    updatedColors[index] = newColor;
    setPaletteColors(updatedColors);
    
    // Mettre à jour la palette dans le composant parent
    onDefaultColorClick(newColor);
  };
  
  // Fonction pour appliquer une couleur de la palette au sélecteur principal
  const handleApplyColor = (color: string) => {
    onColorChange(color);
  };

  return (
    <div className="space-y-2">
      <Label>Couleur principale</Label>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          <ColorPicker
            label="Couleur"
            value={selectedColor}
            onChange={onColorChange}
          />
        </div>
        <div className="col-span-4 grid grid-cols-5 gap-2">
          {paletteColors.map((color, index) => (
            <div key={index} className="space-y-1">
              <ColorPicker
                label={`Couleur ${index + 1}`}
                value={color}
                onChange={(newColor) => handlePaletteColorChange(index, newColor)}
                className="w-full"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleApplyColor(color)}
              >
                Appliquer
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
