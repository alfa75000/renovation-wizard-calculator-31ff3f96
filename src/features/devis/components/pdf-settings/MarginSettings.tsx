
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
    values: [number, number, number, number]
  ) => {
    updatePdfSettings({
      margins: {
        ...pdfSettings.margins,
        [key]: values
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Marges du document (mm)</h3>
      
      <MarginsControl
        label="Page de couverture"
        values={pdfSettings.margins.cover as [number, number, number, number]}
        onChange={(values) => handleMarginChange('cover', values)}
        className="mb-4"
      />

      <MarginsControl
        label="Pages de détails"
        values={pdfSettings.margins.details as [number, number, number, number]}
        onChange={(values) => handleMarginChange('details', values)}
        className="mb-4"
      />

      <MarginsControl
        label="Page récapitulative"
        values={pdfSettings.margins.recap as [number, number, number, number]}
        onChange={(values) => handleMarginChange('recap', values)}
      />
    </div>
  );
};

