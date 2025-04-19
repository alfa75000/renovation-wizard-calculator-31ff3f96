
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Liste des polices disponibles dans pdfMake par défaut
const AVAILABLE_FONTS = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Courier', label: 'Courier' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times', label: 'Times' }
];

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * Composant qui permet de sélectionner une police parmi une liste prédéfinie
 * compatible avec pdfMake
 */
export const FontSelector: React.FC<FontSelectorProps> = ({ 
  value, 
  onChange, 
  label = 'Police',
  className = '' 
}) => {
  // Si la valeur actuelle n'est pas dans la liste des polices disponibles,
  // utiliser Roboto par défaut
  React.useEffect(() => {
    if (value && !AVAILABLE_FONTS.some(font => font.value === value)) {
      onChange('Roboto');
    }
  }, [value, onChange]);

  return (
    <div className={className}>
      <Label>{label}</Label>
      <Select 
        value={AVAILABLE_FONTS.some(font => font.value === value) ? value : 'Roboto'}
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
