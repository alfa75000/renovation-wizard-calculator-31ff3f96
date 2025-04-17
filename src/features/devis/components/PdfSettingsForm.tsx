import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form';
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import { Undo2, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';

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
        <CardDescription>
          Personnalisez l'apparence de vos documents PDF
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="typography" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="typography">Typographie</TabsTrigger>
            <TabsTrigger value="colors">Couleurs</TabsTrigger>
            <TabsTrigger value="spacing">Espacements</TabsTrigger>
            <TabsTrigger value="layout">Mise en page</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="typography" className="space-y-4">
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
                  <SelectItem value="Questrial">Questrial</SelectItem>
                  <SelectItem value="Work Sans">Work Sans</SelectItem>
                  <SelectItem value="DM Sans">DM Sans</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Plus Jakarta Sans">Plus Jakarta Sans</SelectItem>
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
                <Label>Taille police Sous-titre</Label>
                <Input 
                  type="number" 
                  value={pdfSettings.fontSize.subtitle} 
                  onChange={(e) => updatePdfSettings({ 
                    fontSize: { 
                      ...pdfSettings.fontSize, 
                      subtitle: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
              <div>
                <Label>Taille police Entête</Label>
                <Input 
                  type="number" 
                  value={pdfSettings.fontSize.heading} 
                  onChange={(e) => updatePdfSettings({ 
                    fontSize: { 
                      ...pdfSettings.fontSize, 
                      heading: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
              <div>
                <Label>Taille police Normale</Label>
                <Input 
                  type="number" 
                  value={pdfSettings.fontSize.normal} 
                  onChange={(e) => updatePdfSettings({ 
                    fontSize: { 
                      ...pdfSettings.fontSize, 
                      normal: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
              <div>
                <Label>Taille police Petite</Label>
                <Input 
                  type="number" 
                  value={pdfSettings.fontSize.small} 
                  onChange={(e) => updatePdfSettings({ 
                    fontSize: { 
                      ...pdfSettings.fontSize, 
                      small: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
              <div>
                <Label>Taille police Détails (MO, TVA...)</Label>
                <Input 
                  type="number" 
                  value={pdfSettings.fontSize.details} 
                  onChange={(e) => updatePdfSettings({ 
                    fontSize: { 
                      ...pdfSettings.fontSize, 
                      details: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="spacing" className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Espacements page de garde</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entre les sections principales</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.lineSpacing.coverSections} 
                    onChange={(e) => updatePdfSettings({ 
                      lineSpacing: { 
                        ...pdfSettings.lineSpacing, 
                        coverSections: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
                <div>
                  <Label>Entre les champs</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.lineSpacing.betweenFields} 
                    onChange={(e) => updatePdfSettings({ 
                      lineSpacing: { 
                        ...pdfSettings.lineSpacing, 
                        betweenFields: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
                <div>
                  <Label>Après la description</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.lineSpacing.afterDescription} 
                    onChange={(e) => updatePdfSettings({ 
                      lineSpacing: { 
                        ...pdfSettings.lineSpacing, 
                        afterDescription: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Espacements pages détails</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entre les lignes de description</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.lineSpacing.detailsDescription} 
                    onChange={(e) => updatePdfSettings({ 
                      lineSpacing: { 
                        ...pdfSettings.lineSpacing, 
                        detailsDescription: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
                <div>
                  <Label>Après chaque ligne</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.lineSpacing.afterDetailRow} 
                    onChange={(e) => updatePdfSettings({ 
                      lineSpacing: { 
                        ...pdfSettings.lineSpacing, 
                        afterDetailRow: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
                <div>
                  <Label>Entre les sections</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={pdfSettings.lineSpacing.betweenSections} 
                    onChange={(e) => updatePdfSettings({ 
                      lineSpacing: { 
                        ...pdfSettings.lineSpacing, 
                        betweenSections: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Couleur des textes généraux</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    value={pdfSettings.colors.mainText}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        mainText: e.target.value 
                      } 
                    })}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={pdfSettings.colors.mainText}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        mainText: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Couleur des textes MO/TVA/Détails</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    value={pdfSettings.colors.detailsText}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        detailsText: e.target.value 
                      } 
                    })}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={pdfSettings.colors.detailsText}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        detailsText: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Couleur des traits page de garde</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    value={pdfSettings.colors.coverLines}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        coverLines: e.target.value 
                      } 
                    })}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={pdfSettings.colors.coverLines}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        coverLines: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Couleur des traits pages détails/récap</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    value={pdfSettings.colors.detailsLines}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        detailsLines: e.target.value 
                      } 
                    })}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={pdfSettings.colors.detailsLines}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        detailsLines: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Couleur des cadres Total TTC</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    value={pdfSettings.colors.totalBoxLines}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        totalBoxLines: e.target.value 
                      } 
                    })}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={pdfSettings.colors.totalBoxLines}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        totalBoxLines: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Couleur de fond claire</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    value={pdfSettings.colors.background}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        background: e.target.value 
                      } 
                    })}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={pdfSettings.colors.background}
                    onChange={(e) => updatePdfSettings({ 
                      colors: { 
                        ...pdfSettings.colors, 
                        background: e.target.value 
                      } 
                    })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Marges du document (mm)</h3>
              
              <div className="space-y-2">
                <Label>Page de couverture (gauche, haut, droite, bas)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <Input
                      key={`cover-${index}`}
                      type="number" 
                      value={String(pdfSettings.margins.cover[index])} 
                      onChange={(e) => {
                        const newMargins = [...pdfSettings.margins.cover];
                        newMargins[index] = Number(e.target.value);
                        updatePdfSettings({ 
                          margins: { 
                            ...pdfSettings.margins, 
                            cover: newMargins as [number, number, number, number]
                          } 
                        });
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pages de détails (gauche, haut, droite, bas)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <Input
                      key={`details-${index}`}
                      type="number" 
                      value={String(pdfSettings.margins.details[index])} 
                      onChange={(e) => {
                        const newMargins = [...pdfSettings.margins.details];
                        newMargins[index] = Number(e.target.value);
                        updatePdfSettings({ 
                          margins: { 
                            ...pdfSettings.margins, 
                            details: newMargins as [number, number, number, number]
                          } 
                        });
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Page récapitulative (gauche, haut, droite, bas)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <Input
                      key={`recap-${index}`}
                      type="number" 
                      value={String(pdfSettings.margins.recap[index])} 
                      onChange={(e) => {
                        const newMargins = [...pdfSettings.margins.recap];
                        newMargins[index] = Number(e.target.value);
                        updatePdfSettings({ 
                          margins: { 
                            ...pdfSettings.margins, 
                            recap: newMargins as [number, number, number, number]
                          } 
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logo" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  id="useDefaultLogo" 
                  type="checkbox" 
                  className="h-4 w-4"
                  checked={pdfSettings.logoSettings.useDefaultLogo}
                  onChange={(e) => updatePdfSettings({ 
                    logoSettings: { 
                      ...pdfSettings.logoSettings, 
                      useDefaultLogo: e.target.checked 
                    } 
                  })}
                />
                <Label htmlFor="useDefaultLogo">Utiliser le logo par défaut</Label>
              </div>

              {!pdfSettings.logoSettings.useDefaultLogo && (
                <div className="space-y-2">
                  <Label>Télécharger un logo</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    className="w-full" 
                  />
                  
                  {pdfSettings.logoSettings.logoUrl && (
                    <div className="mt-2 p-4 border rounded-md">
                      <div className="text-sm mb-2">Aperçu :</div>
                      <img 
                        src={pdfSettings.logoSettings.logoUrl} 
                        alt="Logo preview" 
                        className="max-h-20 mb-2"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Largeur (px)</Label>
                  <Input 
                    type="number" 
                    value={pdfSettings.logoSettings.width} 
                    onChange={(e) => updatePdfSettings({ 
                      logoSettings: { 
                        ...pdfSettings.logoSettings, 
                        width: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
                <div>
                  <Label>Hauteur (px)</Label>
                  <Input 
                    type="number" 
                    value={pdfSettings.logoSettings.height} 
                    onChange={(e) => updatePdfSettings({ 
                      logoSettings: { 
                        ...pdfSettings.logoSettings, 
                        height: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
              </div>

              <div>
                <Label>Alignement</Label>
                <Select 
                  value={pdfSettings.logoSettings.alignment}
                  onValueChange={(value: 'left' | 'center' | 'right') => updatePdfSettings({ 
                    logoSettings: { 
                      ...pdfSettings.logoSettings, 
                      alignment: value 
                    } 
                  })}
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
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => resetPdfSettings()}>
            <Undo2 className="mr-2 h-4 w-4" /> Réinitialiser les paramètres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
