
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ColorPicker } from './ColorPicker';
import { BorderSettings } from '../types/elementSettings';

interface BorderControlProps {
  border?: BorderSettings;
  defaultColors: string[];
  onChange: (border: BorderSettings) => void;
}

export const BorderControl: React.FC<BorderControlProps> = ({
  border,
  defaultColors,
  onChange
}) => {
  // Default/initial values
  const currentBorder = border || {
    top: false,
    right: false,
    bottom: false,
    left: false,
    color: '#002855',
    width: 1
  };

  const handleBorderChange = (position: 'top' | 'right' | 'bottom' | 'left', checked: boolean) => {
    onChange({
      ...currentBorder,
      [position]: checked
    });
  };

  const handleColorChange = (color: string) => {
    onChange({
      ...currentBorder,
      color
    });
  };

  const handleWidthChange = (width: number) => {
    onChange({
      ...currentBorder,
      width
    });
  };

  // Preview component to show how the border will look
  const BorderPreview = () => {
    const borderStyle = {
      borderTopWidth: currentBorder.top ? `${currentBorder.width}px` : 0,
      borderRightWidth: currentBorder.right ? `${currentBorder.width}px` : 0,
      borderBottomWidth: currentBorder.bottom ? `${currentBorder.width}px` : 0,
      borderLeftWidth: currentBorder.left ? `${currentBorder.width}px` : 0,
      borderStyle: 'solid',
      borderColor: currentBorder.color,
      width: '100%',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <div className="mt-3 mb-4">
        <Label className="mb-2 block">Aperçu</Label>
        <div style={borderStyle} className="bg-gray-50 text-sm">
          Aperçu des bordures
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Bordures</h3>
      
      <BorderPreview />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="border-top"
              checked={currentBorder.top}
              onCheckedChange={(checked) => handleBorderChange('top', checked === true)}
            />
            <Label htmlFor="border-top" className="text-sm">Haut</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="border-right"
              checked={currentBorder.right}
              onCheckedChange={(checked) => handleBorderChange('right', checked === true)}
            />
            <Label htmlFor="border-right" className="text-sm">Droite</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="border-bottom"
              checked={currentBorder.bottom}
              onCheckedChange={(checked) => handleBorderChange('bottom', checked === true)}
            />
            <Label htmlFor="border-bottom" className="text-sm">Bas</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="border-left"
              checked={currentBorder.left}
              onCheckedChange={(checked) => handleBorderChange('left', checked === true)}
            />
            <Label htmlFor="border-left" className="text-sm">Gauche</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="border-width" className="text-sm">Épaisseur (px)</Label>
            <Input
              id="border-width"
              type="number"
              min="1"
              max="10"
              value={currentBorder.width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <ColorPicker
            label="Couleur"
            value={currentBorder.color}
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};
