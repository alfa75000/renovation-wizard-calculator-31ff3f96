// src/features/devis/components/pdf-settings/components/FontSelector.tsx

import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'; // Assure-toi que ce chemin est correct
import { Label } from '@/components/ui/label'; // Assure-toi que ce chemin est correct

// *** MISE À JOUR DE LA LISTE ***
// Liste des polices enregistrées pour @react-pdf/renderer
const AVAILABLE_FONTS = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'ModernSans', label: 'Modern Sans' }, // Ajout de ModernSans
  // Polices PDF standard (tu peux les garder si tu veux les proposer, 
  // mais assure-toi qu'elles sont aussi enregistrées si tu les utilises
  // dans des styles par défaut, ou supprime-les si tu ne veux proposer que tes polices perso)
  // { value: 'Helvetica', label: 'Helvetica' }, // Police par défaut de React-PDF
  // { value: 'Times', label: 'Times' },         // Police standard PDF
  // { value: 'Courier', label: 'Courier' }       // Police standard PDF
];

interface FontSelectorProps {
  value?: string; // Rendre la valeur optionnelle pour gérer le cas initial/défaut
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * Composant qui permet de sélectionner une police parmi les polices enregistrées
 * pour @react-pdf/renderer.
 */
export const FontSelector: React.FC<FontSelectorProps> = ({ 
  value, 
  onChange, 
  label = 'Police',
  className = '' 
}) => {
  // Détermine la valeur actuelle à afficher/sélectionner
  // Utilise 'Roboto' comme défaut si aucune valeur n'est fournie OU si la valeur fournie n'est pas dans la liste
  const currentValue = value && AVAILABLE_FONTS.some(font => font.value === value) ? value : 'Roboto';

  // Optionnel: si tu veux forcer la valeur dans l'état parent à être 'Roboto' si elle est invalide
  /*
  React.useEffect(() => {
    if (value && !AVAILABLE_FONTS.some(font => font.value === value)) {
      onChange('Roboto');
    }
  }, [value, onChange]);
  */

  return (
    <div className={className}>
      <Label>{label}</Label>
      <Select 
        value={currentValue} // Utilise la valeur déterminée
        onValueChange={onChange} // Appelle directement onChange quand la valeur change
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