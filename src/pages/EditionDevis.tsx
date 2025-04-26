import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { PdfSettingsForm } from "@/features/devis/components/PdfSettingsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useDevisGeneration } from "@/hooks/useDevisGeneration";
import { useReactPdfGeneration } from "@/services/pdf/react-pdf/hooks/useReactPdfGeneration";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const { state } = useProject();
  const { metadata } = state;
  const [activeTab, setActiveTab] = useState("printable");
  const { isGenerating: isGeneratingPdfMake, generateInsuranceInfo } = useDevisGeneration();
  const { isGenerating: isGeneratingReactPdf, generateReactPdf } = useReactPdfGeneration();
  
  const pageTitle = metadata?.nomProjet 
    ? `Édition du devis - ${metadata.nomProjet}` 
    : "Édition du devis";
    
  const handleGenerateDevis = async () => {
    await generateInsuranceInfo();
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        title={pageTitle}
        subtitle="Configurez les éléments à imprimer et les paramètres du devis"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4 space-x-2">
            <Button 
              variant="default" 
              onClick={generateInsuranceInfo}
              disabled={isGeneratingPdfMake}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGeneratingPdfMake ? 'Génération en cours...' : 'Générer Devis'}
            </Button>
            
            <Button 
              variant="default" 
              onClick={generateReactPdf}
              disabled={isGeneratingReactPdf}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGeneratingReactPdf ? 'Génération en cours...' : 'Générer Devis React-PDF'}
            </Button>
          </div>
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
