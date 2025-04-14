
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Utilisation des polices configurées dans fontConfig.ts
interface FontOption {
  name: string;
  label: string;
}

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ 
  selectedFont, 
  onFontChange 
}) => {
  // Définition des polices disponibles, correspondant à celles configurées dans fontConfig.ts
  const AVAILABLE_FONTS: FontOption[] = [
    { name: 'Roboto', label: 'Roboto (par défaut)' },
    { name: 'Times', label: 'Times New Roman' },
    { name: 'Helvetica', label: 'Helvetica' },
    { name: 'Courier', label: 'Courier' }
  ];

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
