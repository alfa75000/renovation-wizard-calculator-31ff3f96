
import React from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, FileText, Save, Settings } from "lucide-react";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        title="Édition du devis"
        subtitle="Configurez les éléments à imprimer dans le devis"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration du devis
              </CardTitle>
              <CardDescription>
                Personnalisez les informations et les sections à inclure dans votre devis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="elements" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="elements" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Éléments du devis
                  </TabsTrigger>
                  <TabsTrigger value="apercu" className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Aperçus
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="elements">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
                      <p className="font-medium">Configuration des éléments du devis</p>
                      <p className="mt-1">Cochez ou décochez les éléments que vous souhaitez inclure dans votre devis.</p>
                    </div>
                    <PrintableFieldsForm />
                  </div>
                </TabsContent>
                
                <TabsContent value="apercu">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
                      <p className="font-medium">Aperçus disponibles</p>
                      <p className="mt-1">
                        Vous pouvez visualiser différentes parties du devis avant de l'imprimer ou de l'exporter.
                        Utilisez les boutons dans l'onglet "Éléments du devis" pour visualiser :
                      </p>
                      <ul className="list-disc list-inside mt-2 ml-2">
                        <li>La page de garde (informations client et société)</li>
                        <li>Le détail des travaux (liste détaillée par pièce)</li>
                        <li>Le devis complet (toutes les pages assemblées)</li>
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Page de garde</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">
                            Informations générales du client et de l'entreprise, description du projet.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Détails des travaux</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">
                            Détail des prestations par pièce avec prix unitaires et totaux.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Devis complet</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">
                            Document complet incluant tous les éléments du devis pour impression.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
