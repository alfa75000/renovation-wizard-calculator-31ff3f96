
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface StyleControlsProps {
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  onChange: (settings: { fontSize?: number; isBold?: boolean; isItalic?: boolean }) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  fontSize,
  isBold,
  isItalic,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Taille de police</Label>
        <Input
          type="number"
          value={fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={6}
          max={72}
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bold"
            checked={isBold}
            onCheckedChange={(checked) => onChange({ isBold: checked as boolean })}
          />
          <Label htmlFor="bold">Gras</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="italic"
            checked={isItalic}
            onCheckedChange={(checked) => onChange({ isItalic: checked as boolean })}
          />
          <Label htmlFor="italic">Italique</Label>
        </div>
      </div>
    </div>
  );
};
