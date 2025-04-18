
import React from 'react';
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
          {defaultColors.map((color, index) => (
            <div key={index} className="space-y-1">
              <Button 
                variant="outline" 
                className="w-full h-10"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => onColorChange(color)}
              >
                <span className="sr-only">Couleur {index + 1}</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
