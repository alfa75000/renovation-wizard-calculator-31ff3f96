
import React from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const { state } = useProject();
  const { metadata } = state;
  
  const pageTitle = metadata?.nomProjet 
    ? `Édition du devis - ${metadata.nomProjet}` 
    : "Édition du devis";
  
  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        title={pageTitle}
        subtitle="Configurez les éléments à imprimer dans le devis"
      >
        <div className="max-w-4xl mx-auto">
          <PrintableFieldsForm />
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
