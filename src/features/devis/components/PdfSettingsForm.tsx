import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { Loader } from '@/components/ui/loader';
import { Undo2 } from 'lucide-react';

// Importing our refactored components
import { FontSettings } from './pdf-settings/FontSettings';
import { ColorSettings } from './pdf-settings/ColorSettings';
import { SpacingSettings } from './pdf-settings/SpacingSettings';
import { MarginSettings } from './pdf-settings/MarginSettings';
import { LogoSettings } from './pdf-settings/LogoSettings';

export const PdfSettingsForm: React.FC = () => {
  const { pdfSettings, updatePdfSettings, resetPdfSettings } = usePdfSettings();

  if (!pdfSettings) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size="lg" />
        <p className="ml-2">Chargement des paramètres PDF...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres d'édition PDF</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de vos documents PDF
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-6">
          <Tabs defaultValue="typography" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="typography">Typographie</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="spacing">Espacements</TabsTrigger>
              <TabsTrigger value="layout">Mise en page</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="typography">
              <FontSettings 
                pdfSettings={pdfSettings} 
                updatePdfSettings={updatePdfSettings} 
              />
            </TabsContent>
            
            <TabsContent value="spacing">
              <SpacingSettings 
                pdfSettings={pdfSettings} 
                updatePdfSettings={updatePdfSettings} 
              />
            </TabsContent>
            
            <TabsContent value="colors">
              <ColorSettings 
                pdfSettings={pdfSettings} 
                updatePdfSettings={updatePdfSettings} 
              />
            </TabsContent>
            
            <TabsContent value="layout">
              <MarginSettings 
                pdfSettings={pdfSettings} 
                updatePdfSettings={updatePdfSettings} 
              />
            </TabsContent>
            
            <TabsContent value="logo">
              <LogoSettings 
                pdfSettings={pdfSettings} 
                updatePdfSettings={updatePdfSettings} 
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => resetPdfSettings()}>
              <Undo2 className="mr-2 h-4 w-4" /> Réinitialiser les paramètres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
