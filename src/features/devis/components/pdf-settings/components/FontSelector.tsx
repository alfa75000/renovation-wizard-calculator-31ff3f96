
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Liste des polices disponibles
const AVAILABLE_FONTS = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Questrial', label: 'Questrial' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' }
];

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * Composant qui permet de sélectionner une police parmi une liste prédéfinie
 */
export const FontSelector: React.FC<FontSelectorProps> = ({ 
  value, 
  onChange, 
  label = 'Police',
  className = '' 
}) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une police" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_FONTS.map(font => (
            <SelectItem key={font.value} value={font.value}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
