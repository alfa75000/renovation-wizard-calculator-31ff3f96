
import React from 'react';
import { NumberControl } from './components/NumberControl';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

interface SpacingSettingsProps {
  pdfSettings: PdfSettings;
  updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>;
}

/**
 * Composant qui gère les paramètres d'espacement du PDF
 */
export const SpacingSettings: React.FC<SpacingSettingsProps> = ({ 
  pdfSettings, 
  updatePdfSettings 
}) => {
  const handleLineSpacingChange = (key: keyof PdfSettings['lineSpacing'], value: number) => {
    updatePdfSettings({
      lineSpacing: {
        ...pdfSettings.lineSpacing,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Espacements page de garde</h3>
        <div className="grid grid-cols-2 gap-4">
          <NumberControl
            label="Entre les sections principales"
            value={pdfSettings.lineSpacing.coverSections}
            step={0.1}
            onChange={(value) => handleLineSpacingChange('coverSections', value)}
          />
          <NumberControl
            label="Entre les champs"
            value={pdfSettings.lineSpacing.betweenFields}
            step={0.1}
            onChange={(value) => handleLineSpacingChange('betweenFields', value)}
          />
          <NumberControl
            label="Après la description"
            value={pdfSettings.lineSpacing.afterDescription}
            step={0.1}
            onChange={(value) => handleLineSpacingChange('afterDescription', value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Espacements pages détails</h3>
        <div className="grid grid-cols-2 gap-4">
          <NumberControl
            label="Entre les lignes de description"
            value={pdfSettings.lineSpacing.detailsDescription}
            step={0.1}
            onChange={(value) => handleLineSpacingChange('detailsDescription', value)}
          />
          <NumberControl
            label="Après chaque ligne"
            value={pdfSettings.lineSpacing.afterDetailRow}
            step={0.1}
            onChange={(value) => handleLineSpacingChange('afterDetailRow', value)}
          />
          <NumberControl
            label="Entre les sections"
            value={pdfSettings.lineSpacing.betweenSections}
            step={0.1}
            onChange={(value) => handleLineSpacingChange('betweenSections', value)}
          />
        </div>
      </div>
    </div>
  );
};
