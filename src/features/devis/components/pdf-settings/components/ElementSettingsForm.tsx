
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ElementSettings, defaultElementSettings } from '../types/elementSettings';
import { FontSelector } from './FontSelector';
import { ColorPalette } from './ColorPalette';
import { SpacingControl } from './SpacingControl';
import { BorderControl } from './BorderControl';
import { AlignmentControl } from './AlignmentControl';
import { StyleControls } from './StyleControls';

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

  // Mettre à jour les paramètres affichés quand l'élément sélectionné change
  useEffect(() => {
    console.log('Settings updated in ElementSettingsForm:', settings);
    setCurrentSettings(settings || defaultElementSettings);
  }, [settings, selectedElement]);

  const handleSave = () => {
    console.log('Saving settings in form:', currentSettings);
    onSave(currentSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        Paramètres pour : {selectedElement}
      </h3>

      {/* Police et style */}
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

      {/* Couleurs */}
      <ColorPalette
        selectedColor={currentSettings.color}
        defaultColors={defaultColors}
        onColorChange={(color) => setCurrentSettings(prev => ({ ...prev, color }))}
        onDefaultColorClick={onDefaultColorClick}
      />

      {/* Espacement */}
      <SpacingControl
        spacing={currentSettings.spacing}
        onChange={(spacing) => setCurrentSettings(prev => ({ ...prev, spacing }))}
      />

      {/* Alignement */}
      <AlignmentControl
        alignment={currentSettings.alignment}
        onChange={(alignment) => setCurrentSettings(prev => ({ ...prev, alignment }))}
      />

      {/* Bordures */}
      <BorderControl
        border={currentSettings.border}
        defaultColors={defaultColors}
        onChange={(border) => setCurrentSettings(prev => ({ ...prev, border }))}
      />

      {/* Bouton d'application */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>
          Appliquer les modifications
        </Button>
      </div>
    </div>
  );
};
