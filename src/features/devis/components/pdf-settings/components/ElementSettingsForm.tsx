
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ElementSettings, defaultElementSettings } from '../types/elementSettings';
import { FontSelector } from './FontSelector';
import { ColorPalette } from './ColorPalette';
import { SpacingControl } from './SpacingControl';
import { PaddingControl } from './PaddingControl';
import { BorderControl } from './BorderControl';
import { AlignmentControl } from './AlignmentControl';
import { StyleControls } from './StyleControls';
import { NumberControl } from './NumberControl';

interface ElementSettingsFormProps {
  selectedElement: string;
  settings: ElementSettings;
  onSave: (settings: ElementSettings) => void;
  defaultColors: string[];
  onDefaultColorClick: (color: string) => void;
}

export const ElementSettingsForm: React.FC<ElementSettingsFormProps> = ({
  selectedElement,
  settings,
  onSave,
  defaultColors,
  onDefaultColorClick
}) => {
  const [currentSettings, setCurrentSettings] = React.useState<ElementSettings>(
    settings || defaultElementSettings
  );

  useEffect(() => {
    console.log('Settings updated in ElementSettingsForm:', settings);
    setCurrentSettings(settings || defaultElementSettings);
  }, [settings, selectedElement]);

  const handleSave = () => {
    console.log('Saving settings in form:', currentSettings);
    onSave(currentSettings);
  };

  const handleColorChange = (color: string) => {
    setCurrentSettings(prev => ({ ...prev, color }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        Paramètres pour : {selectedElement}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <FontSelector
          value={currentSettings.fontFamily}
          onChange={(font) => setCurrentSettings(prev => ({ ...prev, fontFamily: font }))}
        />
        <StyleControls
          fontSize={currentSettings.fontSize}
          isBold={currentSettings.isBold}
          isItalic={currentSettings.isItalic}
          onChange={(styleSettings) => setCurrentSettings(prev => ({ ...prev, ...styleSettings }))}
        />
      </div>

      <ColorPalette
        selectedColor={currentSettings.color}
        defaultColors={defaultColors}
        onColorChange={handleColorChange}
        onDefaultColorClick={onDefaultColorClick}
      />

      <div className="space-y-2">
        <NumberControl
          label="Interligne"
          value={currentSettings.lineHeight || 1.5}
          onChange={(value) => setCurrentSettings(prev => ({ ...prev, lineHeight: value }))}
          step={0.1}
          min={1}
          max={3}
          className="w-full"
        />
      </div>

      <SpacingControl
        spacing={currentSettings.spacing}
        onChange={(spacing) => setCurrentSettings(prev => ({ ...prev, spacing }))}
      />

      <PaddingControl
        padding={currentSettings.padding}
        onChange={(padding) => setCurrentSettings(prev => ({ ...prev, padding }))}
      />

      <AlignmentControl
        alignment={currentSettings.alignment}
        onChange={(alignment) => setCurrentSettings(prev => ({ ...prev, alignment }))}
      />

      <BorderControl
        border={currentSettings.border}
        defaultColors={defaultColors}
        onChange={(border) => setCurrentSettings(prev => ({ ...prev, border }))}
      />

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>
          Appliquer les modifications
        </Button>
      </div>
    </div>
  );
};
