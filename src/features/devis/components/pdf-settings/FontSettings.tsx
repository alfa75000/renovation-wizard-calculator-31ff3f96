
import React from 'react';
import { FontSelector } from './components/FontSelector';
import { NumberControl } from './components/NumberControl';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

interface FontSettingsProps {
  pdfSettings: PdfSettings;
  updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>;
}

/**
 * Composant qui gère les paramètres de police et de taille de texte
 */
export const FontSettings: React.FC<FontSettingsProps> = ({ 
  pdfSettings, 
  updatePdfSettings 
}) => {
  const handleFontFamilyChange = (value: string) => {
    updatePdfSettings({ fontFamily: value });
  };

  const handleFontSizeChange = (key: keyof PdfSettings['fontSize'], value: number) => {
    updatePdfSettings({
      fontSize: {
        ...pdfSettings.fontSize,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <FontSelector
        label="Police principale"
        value={pdfSettings.fontFamily}
        onChange={handleFontFamilyChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberControl
          label="Taille police Titre"
          value={pdfSettings.fontSize.title}
          onChange={(value) => handleFontSizeChange('title', value)}
        />
        <NumberControl
          label="Taille police Sous-titre"
          value={pdfSettings.fontSize.subtitle}
          onChange={(value) => handleFontSizeChange('subtitle', value)}
        />
        <NumberControl
          label="Taille police Entête"
          value={pdfSettings.fontSize.heading}
          onChange={(value) => handleFontSizeChange('heading', value)}
        />
        <NumberControl
          label="Taille police Normale"
          value={pdfSettings.fontSize.normal}
          onChange={(value) => handleFontSizeChange('normal', value)}
        />
        <NumberControl
          label="Taille police Petite"
          value={pdfSettings.fontSize.small}
          onChange={(value) => handleFontSizeChange('small', value)}
        />
        <NumberControl
          label="Taille police Détails (MO, TVA...)"
          value={pdfSettings.fontSize.details}
          onChange={(value) => handleFontSizeChange('details', value)}
        />
      </div>
    </div>
  );
};
