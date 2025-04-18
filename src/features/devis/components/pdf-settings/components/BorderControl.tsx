
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

  // Visualisation de l'aperçu des bordures
  const getBorderPreviewStyle = () => {
    return {
      width: '100%',
      height: '60px',
      borderTopWidth: border.top ? `${border.width}px` : '0',
      borderRightWidth: border.right ? `${border.width}px` : '0',
      borderBottomWidth: border.bottom ? `${border.width}px` : '0',
      borderLeftWidth: border.left ? `${border.width}px` : '0',
      borderStyle: 'solid',
      borderColor: border.color,
      marginTop: '10px',
      backgroundColor: '#f9fafb'
    };
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
            defaultColors={defaultColors}
          />
        </div>
      </div>
      
      {/* Aperçu des bordures */}
      <div>
        <Label className="mb-2 block">Aperçu</Label>
        <div style={getBorderPreviewStyle()} className="flex items-center justify-center">
          <span className="text-sm text-gray-500">Bordures</span>
        </div>
      </div>
    </div>
  );
};
