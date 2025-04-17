
import React from 'react';
import { ElementSelector } from './components/ElementSelector';
import { ElementSettingsForm } from './components/ElementSettingsForm';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { ElementSettings, defaultElementSettings } from './types/elementSettings';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { PDF_ELEMENTS } from './types/typography';
import { Card, CardContent } from '@/components/ui/card';

interface FontSettingsProps {
  pdfSettings: PdfSettings;
  updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>;
}

export const FontSettings: React.FC<FontSettingsProps> = ({ 
  pdfSettings, 
  updatePdfSettings 
}) => {
  const [selectedElement, setSelectedElement] = React.useState('');
  const [defaultColors] = React.useState([
    '#1a1f2c',
    '#9b87f5',
    '#7E69AB',
    '#6E59A5',
    '#D6BCFA'
  ]);

  const handleElementSettingsChange = async (newSettings: ElementSettings) => {
    if (selectedElement && pdfSettings) {
      const updatedElements = {
        ...pdfSettings.elements,
        [selectedElement]: {
          ...defaultElementSettings,
          ...newSettings
        }
      };
      
      await updatePdfSettings({
        elements: updatedElements
      });
    }
  };

  const getElementSettings = (elementId: string): ElementSettings => {
    if (pdfSettings?.elements?.[elementId]) {
      return {
        ...defaultElementSettings,
        ...pdfSettings.elements[elementId]
      };
    }
    return defaultElementSettings;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <ElementSelector
            value={selectedElement}
            onChange={setSelectedElement}
          />
        </CardContent>
      </Card>
      
      {selectedElement && (
        <Card>
          <CardContent className="pt-6">
            <ElementSettingsForm
              selectedElement={PDF_ELEMENTS.find(e => e.id === selectedElement)?.name || selectedElement}
              settings={getElementSettings(selectedElement)}
              onSave={handleElementSettingsChange}
              defaultColors={defaultColors}
              onDefaultColorClick={() => {}}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
