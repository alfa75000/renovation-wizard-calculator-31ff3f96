
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { TextAlignment } from '../types/elementSettings';

interface AlignmentControlProps {
  alignment: TextAlignment;
  onChange: (alignment: TextAlignment) => void;
}

export const AlignmentControl: React.FC<AlignmentControlProps> = ({
  alignment,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Alignement</Label>
      <RadioGroup
        value={alignment}
        onValueChange={(value) => onChange(value as TextAlignment)}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="left" id="align-left" />
          <Label htmlFor="align-left" className="flex items-center">
            <AlignLeft className="h-4 w-4" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="center" id="align-center" />
          <Label htmlFor="align-center" className="flex items-center">
            <AlignCenter className="h-4 w-4" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="right" id="align-right" />
          <Label htmlFor="align-right" className="flex items-center">
            <AlignRight className="h-4 w-4" />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="justify" id="align-justify" />
          <Label htmlFor="align-justify" className="flex items-center">
            <AlignJustify className="h-4 w-4" />
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
