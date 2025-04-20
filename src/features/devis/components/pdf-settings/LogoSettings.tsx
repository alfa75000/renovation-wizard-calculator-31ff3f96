
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberControl } from './components/NumberControl';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

interface LogoSettingsProps {
  pdfSettings: PdfSettings;
  updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>;
}

export const LogoSettings: React.FC<LogoSettingsProps> = ({ 
  pdfSettings, 
  updatePdfSettings 
}) => {
  const handleLogoSettingChange = <K extends keyof PdfSettings['logoSettings']>(
    key: K, 
    value: PdfSettings['logoSettings'][K]
  ) => {
    updatePdfSettings({
      logoSettings: {
        ...pdfSettings.logoSettings,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input 
          id="useDefaultLogo" 
          type="checkbox" 
          className="h-4 w-4"
          checked={pdfSettings.logoSettings.useDefaultLogo}
          onChange={(e) => handleLogoSettingChange('useDefaultLogo', e.target.checked)}
        />
        <Label htmlFor="useDefaultLogo">Afficher le logo</Label>
      </div>

      {pdfSettings.logoSettings.useDefaultLogo && (
        <>
          <div className="mt-2 p-4 border rounded-md">
            <div className="text-sm mb-2">Aperçu du logo :</div>
            <img 
              src="/images/lrs-logo.jpg" 
              alt="Logo preview" 
              className="max-h-20 mb-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <NumberControl
              label="Largeur (px)"
              value={pdfSettings.logoSettings.width}
              onChange={(value) => handleLogoSettingChange('width', value)}
            />
            <NumberControl
              label="Hauteur (px)"
              value={pdfSettings.logoSettings.height}
              onChange={(value) => handleLogoSettingChange('height', value)}
            />
          </div>

          <div>
            <Label>Alignement</Label>
            <Select 
              value={pdfSettings.logoSettings.alignment}
              onValueChange={(value: 'left' | 'center' | 'right') => 
                handleLogoSettingChange('alignment', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un alignement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Gauche</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="right">Droite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};
