
import React from 'react';
import { ColorPicker } from './components/ColorPicker';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

interface ColorSettingsProps {
  pdfSettings: PdfSettings;
  updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>;
}

/**
 * Composant qui gère les paramètres de couleurs du PDF
 */
export const ColorSettings: React.FC<ColorSettingsProps> = ({ 
  pdfSettings, 
  updatePdfSettings 
}) => {
  const handleColorChange = (key: keyof PdfSettings['colors'], value: string) => {
    updatePdfSettings({
      colors: {
        ...pdfSettings.colors,
        [key]: value
      }
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ColorPicker
        label="Couleur des textes généraux"
        value={pdfSettings.colors.mainText}
        onChange={(value) => handleColorChange('mainText', value)}
      />
      <ColorPicker
        label="Couleur des textes MO/TVA/Détails"
        value={pdfSettings.colors.detailsText}
        onChange={(value) => handleColorChange('detailsText', value)}
      />
      <ColorPicker
        label="Couleur des traits page de garde"
        value={pdfSettings.colors.coverLines}
        onChange={(value) => handleColorChange('coverLines', value)}
      />
      <ColorPicker
        label="Couleur des traits pages détails/récap"
        value={pdfSettings.colors.detailsLines}
        onChange={(value) => handleColorChange('detailsLines', value)}
      />
      <ColorPicker
        label="Couleur des cadres Total TTC"
        value={pdfSettings.colors.totalBoxLines}
        onChange={(value) => handleColorChange('totalBoxLines', value)}
      />
      <ColorPicker
        label="Couleur de fond claire"
        value={pdfSettings.colors.background}
        onChange={(value) => handleColorChange('background', value)}
      />
    </div>
  );
};
