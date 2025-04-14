
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AVAILABLE_FONTS } from './DevisCoverPreview';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ 
  selectedFont, 
  onFontChange 
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="font-selector">Police d'impression</Label>
      <Select
        value={selectedFont}
        onValueChange={onFontChange}
      >
        <SelectTrigger id="font-selector" className="w-[200px]">
          <SelectValue placeholder="Choisir une police" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_FONTS.map((font) => (
            <SelectItem key={font.name} value={font.name}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
