
import React, { useEffect, useState } from 'react';
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
  const [elementSettings, setElementSettings] = React.useState<ElementSettings>(defaultElementSettings);
  const [paletteColors, setPaletteColors] = useState([
    '#1a1f2c',
    '#9b87f5',
    '#7E69AB',
    '#6E59A5',
    '#D6BCFA'
  ]);

  // Mettre à jour les paramètres affichés quand un élément est sélectionné
  useEffect(() => {
    if (selectedElement && pdfSettings?.elements) {
      const settings = getElementSettings(selectedElement);
      console.log('Loaded settings for element:', selectedElement, settings);
      setElementSettings(settings);
    }
  }, [selectedElement, pdfSettings]);

  const handleElementSettingsChange = async (newSettings: ElementSettings) => {
    if (selectedElement && pdfSettings) {
      console.log('Saving new settings for element:', selectedElement, newSettings);
      const updatedElements = {
        ...pdfSettings.elements,
        [selectedElement]: {
          ...defaultElementSettings,
          ...newSettings,
          spacing: {
            top: newSettings.spacing?.top ?? 0,
            right: newSettings.spacing?.right ?? 0,
            bottom: newSettings.spacing?.bottom ?? 0,
            left: newSettings.spacing?.left ?? 0
          },
          border: {
            top: newSettings.border?.top ?? false,
            right: newSettings.border?.right ?? false,
            bottom: newSettings.border?.bottom ?? false,
            left: newSettings.border?.left ?? false,
            color: newSettings.border?.color ?? '#1a1f2c',
            width: newSettings.border?.width ?? 1
          }
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
        ...pdfSettings.elements[elementId],
        spacing: {
          top: pdfSettings.elements[elementId].spacing?.top ?? 0,
          right: pdfSettings.elements[elementId].spacing?.right ?? 0,
          bottom: pdfSettings.elements[elementId].spacing?.bottom ?? 0,
          left: pdfSettings.elements[elementId].spacing?.left ?? 0
        },
        border: {
          top: pdfSettings.elements[elementId].border?.top ?? false,
          right: pdfSettings.elements[elementId].border?.right ?? false,
          bottom: pdfSettings.elements[elementId].border?.bottom ?? false,
          left: pdfSettings.elements[elementId].border?.left ?? false,
          color: pdfSettings.elements[elementId].border?.color ?? '#1a1f2c',
          width: pdfSettings.elements[elementId].border?.width ?? 1
        }
      };
    }
    return defaultElementSettings;
  };

  // Cette fonction est maintenant utilisée pour stocker une couleur dans la palette
  // sans l'appliquer à l'élément sélectionné
  const handleUpdatePaletteColor = (color: string) => {
    // Note: Nous conservons simplement la couleur dans la palette mais ne l'appliquons pas à l'élément
    setPaletteColors(prevColors => {
      // Nous ne faisons rien ici car cette logique est maintenant gérée dans ColorPalette
      return prevColors;
    });
  };

  // Cette fonction est appelée quand l'utilisateur clique sur "Appliquer"
  const handleColorChange = (color: string) => {
    if (selectedElement) {
      setElementSettings(prev => ({
        ...prev,
        color: color
      }));
    }
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
              settings={elementSettings}
              onSave={handleElementSettingsChange}
              defaultColors={paletteColors}
              onDefaultColorClick={handleUpdatePaletteColor}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
