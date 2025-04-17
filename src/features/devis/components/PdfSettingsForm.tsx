
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { UploadCloud, Undo2 } from 'lucide-react';

export const PdfSettingsForm: React.FC = () => {
  const { pdfSettings, updatePdfSettings, resetPdfSettings } = usePdfSettings();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updatePdfSettings({ 
          logoSettings: { 
            ...pdfSettings.logoSettings, 
            useDefaultLogo: false, 
            logoUrl: e.target?.result as string 
          } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres d'édition PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Police principale</Label>
          <Select 
            value={pdfSettings.fontFamily}
            onValueChange={(value) => updatePdfSettings({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Taille police Titre</Label>
            <Input 
              type="number" 
              value={pdfSettings.fontSize.title} 
              onChange={(e) => updatePdfSettings({ 
                fontSize: { 
                  ...pdfSettings.fontSize, 
                  title: Number(e.target.value) 
                } 
              })}
            />
          </div>
          <div>
            <Label>Couleur principale</Label>
            <Input 
              type="color" 
              value={pdfSettings.colors.primary}
              onChange={(e) => updatePdfSettings({ 
                colors: { 
                  ...pdfSettings.colors, 
                  primary: e.target.value 
                } 
              })}
            />
          </div>
        </div>

        <div>
          <Label>Logo</Label>
          <div className="flex items-center space-x-4">
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="w-full" 
            />
            <Button 
              variant="outline" 
              onClick={() => updatePdfSettings({ 
                logoSettings: { 
                  ...pdfSettings.logoSettings, 
                  useDefaultLogo: true, 
                  logoUrl: null 
                } 
              })}
            >
              <Undo2 className="mr-2 h-4 w-4" /> Défaut
            </Button>
          </div>
        </div>

        <div>
          <Label>Marges du document</Label>
          <div className="grid grid-cols-4 gap-2">
            {['Couverture', 'Détails', 'Récapitulatif'].map((type, index) => (
              <div key={type}>
                <Label className="text-xs">{type}</Label>
                <Input 
                  type="number" 
                  value={pdfSettings.margins[
                    index === 0 ? 'cover' : 
                    index === 1 ? 'details' : 'recap'
                  ][0]} 
                  onChange={(e) => {
                    const marginKey = index === 0 ? 'cover' : 
                      index === 1 ? 'details' : 'recap';
                    const currentMargins = pdfSettings.margins[marginKey];
                    updatePdfSettings({ 
                      margins: { 
                        ...pdfSettings.margins, 
                        [marginKey]: [
                          Number(e.target.value), 
                          currentMargins[1], 
                          currentMargins[2], 
                          currentMargins[3]
                        ] 
                      } 
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => resetPdfSettings()}>
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
