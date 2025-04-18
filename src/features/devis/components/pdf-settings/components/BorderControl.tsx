
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BorderSettings } from '../types/elementSettings';
import { ColorPicker } from './ColorPicker';

interface BorderControlProps {
  border: BorderSettings;
  defaultColors: string[];
  onChange: (border: BorderSettings) => void;
}

export const BorderControl: React.FC<BorderControlProps> = ({
  border,
  defaultColors,
  onChange
}) => {
  const handleBorderChange = (key: keyof BorderSettings, value: any) => {
    onChange({
      ...border,
      [key]: value
    });
  };

  // Prévisualisation des bordures
  const previewStyle = {
    borderTop: border.top ? `${border.width}px solid ${border.color}` : 'none',
    borderRight: border.right ? `${border.width}px solid ${border.color}` : 'none',
    borderBottom: border.bottom ? `${border.width}px solid ${border.color}` : 'none',
    borderLeft: border.left ? `${border.width}px solid ${border.color}` : 'none',
    padding: '10px',
    marginTop: '5px',
    textAlign: 'center' as const,
    fontSize: '12px'
  };

  return (
    <div className="space-y-4">
      <Label>Bordures</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="border-top"
              checked={border.top}
              onCheckedChange={(checked) => handleBorderChange('top', checked)}
            />
            <Label htmlFor="border-top">Haut</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="border-right"
              checked={border.right}
              onCheckedChange={(checked) => handleBorderChange('right', checked)}
            />
            <Label htmlFor="border-right">Droite</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="border-bottom"
              checked={border.bottom}
              onCheckedChange={(checked) => handleBorderChange('bottom', checked)}
            />
            <Label htmlFor="border-bottom">Bas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="border-left"
              checked={border.left}
              onCheckedChange={(checked) => handleBorderChange('left', checked)}
            />
            <Label htmlFor="border-left">Gauche</Label>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <Label>Épaisseur</Label>
            <Input
              type="number"
              value={border.width}
              onChange={(e) => handleBorderChange('width', Number(e.target.value))}
              min={0.5}
              step={0.5}
            />
          </div>
          <ColorPicker
            label="Couleur"
            value={border.color}
            onChange={(color) => handleBorderChange('color', color)}
          />
        </div>
      </div>

      {/* Prévisualisation */}
      <div>
        <Label>Aperçu</Label>
        <div style={previewStyle}>
          Prévisualisation
        </div>
      </div>
    </div>
  );
};
