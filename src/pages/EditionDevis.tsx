
import React from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          <PrintableFieldsForm />
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
