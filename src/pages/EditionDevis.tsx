
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontSelector } from "@/features/devis/components/FontSelector";
import { configureFonts } from "@/utils/fontConfig";

// Create a client for this page
const queryClient = new QueryClient();

// Liste des polices disponibles dans le projet
const SYSTEM_FONTS = ['Roboto', 'Times', 'Helvetica', 'Courier'];

const EditionDevis: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [availableFonts, setAvailableFonts] = useState(SYSTEM_FONTS);

  // Configuration des polices au chargement du composant
  useEffect(() => {
    // Configurer les polices pour pdfMake
    configureFonts();
    
    // La configuration des polices est déjà faite dans utils/fontConfig.ts
    // Nous utilisons seulement les polices qui y sont définies
    console.log("Polices disponibles:", SYSTEM_FONTS);
  }, []);

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
