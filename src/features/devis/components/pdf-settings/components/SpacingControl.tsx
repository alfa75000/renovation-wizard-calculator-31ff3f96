
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SpacingSettings } from '../types/elementSettings';

interface SpacingControlProps {
  spacing: SpacingSettings;
  onChange: (spacing: SpacingSettings) => void;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  spacing,
  onChange
}) => {
  const handleSpacingChange = (key: keyof SpacingSettings, value: number) => {
    onChange({
      ...spacing,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <Label>Espacement</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Haut</Label>
          <Input
            type="number"
            value={spacing.top}
            onChange={(e) => handleSpacingChange('top', Number(e.target.value))}
            min={0}
            step={0.5}
          />
        </div>
        <div>
          <Label>Droite</Label>
          <Input
            type="number"
            value={spacing.right}
            onChange={(e) => handleSpacingChange('right', Number(e.target.value))}
            min={0}
            step={0.5}
          />
        </div>
        <div>
          <Label>Bas</Label>
          <Input
            type="number"
            value={spacing.bottom}
            onChange={(e) => handleSpacingChange('bottom', Number(e.target.value))}
            min={0}
            step={0.5}
          />
        </div>
        <div>
          <Label>Gauche</Label>
          <Input
            type="number"
            value={spacing.left}
            onChange={(e) => handleSpacingChange('left', Number(e.target.value))}
            min={0}
            step={0.5}
          />
        </div>
      </div>
    </div>
  );
};
