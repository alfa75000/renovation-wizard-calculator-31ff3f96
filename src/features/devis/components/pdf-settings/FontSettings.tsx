
import React from 'react';
import { ElementSelector } from './components/ElementSelector';
import { ElementSettingsForm } from './components/ElementSettingsForm';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { ElementSettings } from './types/elementSettings';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

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
        [selectedElement]: newSettings
      };
      
      await updatePdfSettings({
        elements: updatedElements
      });
    }
  };

  return (
    <div className="space-y-8">
      <ElementSelector
        value={selectedElement}
        onChange={setSelectedElement}
      />
      
      {selectedElement && pdfSettings?.elements?.[selectedElement] && (
        <ElementSettingsForm
          selectedElement={selectedElement}
          settings={pdfSettings.elements[selectedElement]}
          onSave={handleElementSettingsChange}
          defaultColors={defaultColors}
          onDefaultColorClick={(color) => {}}
        />
      )}
    </div>
  );
};
