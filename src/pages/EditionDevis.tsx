
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { PdfSettingsForm } from "@/features/devis/components/PdfSettingsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const { state } = useProject();
  const { metadata } = state;
  const [activeTab, setActiveTab] = useState("printable");
  
  const pageTitle = metadata?.nomProjet 
    ? `Édition du devis - ${metadata.nomProjet}` 
    : "Édition du devis";
  
  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        title={pageTitle}
        subtitle="Configurez les éléments à imprimer et les paramètres du devis"
      >
        <div className="max-w-4xl mx-auto">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="printable">
                Éléments à imprimer
              </TabsTrigger>
              <TabsTrigger value="settings">
                Paramètres d'édition PDF
              </TabsTrigger>
            </TabsList>
            <TabsContent value="printable">
              <PrintableFieldsForm />
            </TabsContent>
            <TabsContent value="settings">
              <PdfSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
