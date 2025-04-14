
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontSelector } from "@/features/devis/components/FontSelector";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState('Roboto');

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        title="Édition du devis"
        subtitle="Configurez les éléments à imprimer dans le devis"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <FontSelector 
            selectedFont={selectedFont} 
            onFontChange={handleFontChange} 
          />
          <PrintableFieldsForm 
            defaultSelectedFont={selectedFont} 
          />
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
