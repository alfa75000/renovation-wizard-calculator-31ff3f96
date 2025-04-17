
import React from 'react';
import { ElementSelector } from './components/ElementSelector';
import { ElementSettingsForm } from './components/ElementSettingsForm';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { ElementSettings } from './types/elementSettings';

export const FontSettings = () => {
  const { pdfSettings, updatePdfSettings } = usePdfSettings();
  const [selectedElement, setSelectedElement] = React.useState('');
  const [defaultColors, setDefaultColors] = React.useState([
    '#1a1f2c', // Dark Purple
    '#9b87f5', // Primary Purple
    '#7E69AB', // Secondary Purple
    '#6E59A5', // Tertiary Purple
    '#D6BCFA'  // Light Purple
  ]);

  const handleElementSettingsChange = async (newSettings: ElementSettings) => {
    if (selectedElement && pdfSettings) {
      await updatePdfSettings({
        elements: {
          ...pdfSettings.elements,
          [selectedElement]: newSettings
        }
      });
    }
  };

  const handleDefaultColorChange = (color: string) => {
    // Ajouter la nouvelle couleur au début et garder seulement les 5 dernières
    const newColors = [color, ...defaultColors.filter(c => c !== color)].slice(0, 5);
    setDefaultColors(newColors);
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
          onDefaultColorClick={handleDefaultColorChange}
        />
      )}
    </div>
  );
};
