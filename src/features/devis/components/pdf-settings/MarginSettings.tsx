
import React from 'react';
import { MarginsControl } from './components/MarginsControl';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

interface MarginSettingsProps {
  pdfSettings: PdfSettings;
  updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>;
}

/**
 * Composant qui gère les paramètres de marges du PDF
 */
export const MarginSettings: React.FC<MarginSettingsProps> = ({ 
  pdfSettings, 
  updatePdfSettings 
}) => {
  const handleMarginChange = (
    key: keyof PdfSettings['margins'], 
    values: number[]
  ) => {
    // Ensure exactly 4 values are used, slice first 4 or pad with 0 if less
    const sanitizedValues: [number, number, number, number] = [
      values[0] || 0, 
      values[1] || 0, 
      values[2] || 0, 
      values[3] || 0
    ];

    updatePdfSettings({
      margins: {
        ...pdfSettings.margins,
        [key]: sanitizedValues
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Marges du document (mm)</h3>
      
      <MarginsControl
        label="Page de couverture"
        values={pdfSettings.margins.cover}
        onChange={(values) => handleMarginChange('cover', values)}
        className="mb-4"
      />

      <MarginsControl
        label="Pages de détails"
        values={pdfSettings.margins.details}
        onChange={(values) => handleMarginChange('details', values)}
        className="mb-4"
      />

      <MarginsControl
        label="Page récapitulative"
        values={pdfSettings.margins.recap}
        onChange={(values) => handleMarginChange('recap', values)}
      />
    </div>
  );
};

