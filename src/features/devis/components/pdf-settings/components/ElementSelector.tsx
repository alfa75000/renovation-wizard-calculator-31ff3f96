
import React from 'react';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PDF_ELEMENTS } from '../types/typography';

interface ElementSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ElementSelector: React.FC<ElementSelectorProps> = ({ value, onChange }) => {
  // Grouper les éléments par section
  const groupedElements = PDF_ELEMENTS.reduce((acc, element) => {
    const section = element.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(element);
    return acc;
  }, {} as Record<string, typeof PDF_ELEMENTS>);

  return (
    <div className="space-y-2">
      <Label>Élément à personnaliser</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        {Object.entries(groupedElements).map(([section, elements]) => (
          <optgroup key={section} label={section}>
            {elements.map(element => (
              <option key={element.id} value={element.id}>
                {element.name}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    </div>
  );
};
