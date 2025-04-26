
import React from 'react';
import { NumberControl } from './NumberControl';
import { Spacing } from '../types/elementSettings';

interface PaddingControlProps {
  padding?: Spacing;
  onChange: (padding: Spacing) => void;
}

export const PaddingControl: React.FC<PaddingControlProps> = ({ 
  padding = { top: 0, right: 0, bottom: 0, left: 0 }, 
  onChange 
}) => {
  const handlePaddingChange = (key: keyof Spacing, value: number) => {
    onChange({ ...padding, [key]: value });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Marge Interne (Padding)</h3>
      <div className="grid grid-cols-2 gap-4">
        <NumberControl
          label="Haut"
          value={padding.top || 0}
          onChange={(value) => handlePaddingChange('top', value)}
          min={0}
          max={50}
        />
        <NumberControl
          label="Droit"
          value={padding.right || 0}
          onChange={(value) => handlePaddingChange('right', value)}
          min={0}
          max={50}
        />
        <NumberControl
          label="Bas"
          value={padding.bottom || 0}
          onChange={(value) => handlePaddingChange('bottom', value)}
          min={0}
          max={50}
        />
        <NumberControl
          label="Gauche"
          value={padding.left || 0}
          onChange={(value) => handlePaddingChange('left', value)}
          min={0}
          max={50}
        />
      </div>
    </div>
  );
};
