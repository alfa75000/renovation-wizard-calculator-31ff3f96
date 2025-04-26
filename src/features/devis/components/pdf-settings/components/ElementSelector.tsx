
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PDF_ELEMENTS } from '../types/typography';

interface ElementSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ElementSelector: React.FC<ElementSelectorProps> = ({ value, onChange }) => {
  // Grouper les éléments par section en utilisant reduce avec un type explicite
  const groupedElements = PDF_ELEMENTS.reduce((acc: Record<string, typeof PDF_ELEMENTS[number][]>, element) => {
    const section = element.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(element);
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      <Label>Élément à personnaliser</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un élément" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedElements).map(([section, elements]) => (
            <div key={section} className="py-2">
              <div className="text-xs text-muted-foreground px-2 py-1 font-semibold">{section}</div>
              {elements.map(element => (
                <SelectItem key={element.id} value={element.id}>
                  {element.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
