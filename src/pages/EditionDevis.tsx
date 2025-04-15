
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DevisPreviewSection from "@/features/devis/components/DevisPreviewSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/lib/supabase';
import { Company } from "@/types";
import { PrintableField } from "@/features/devis/services/pdfGenerationService";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevisContent: React.FC = () => {
  const [printableFields, setPrintableFields] = useState<PrintableField[]>([]);
  
  // Récupérer les informations de l'entreprise depuis Supabase
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération des informations de l\'entreprise:', error);
        return null;
      }
      
      return data as Company;
    }
  });

  const handleFieldsUpdate = (fields: PrintableField[]) => {
    setPrintableFields(fields);
  };

  return (
    <Layout
      title="Édition du devis"
      subtitle="Configurez les éléments à imprimer dans le devis"
    >
      <div className="max-w-4xl mx-auto">
        <PrintableFieldsForm onFieldsUpdate={handleFieldsUpdate} />
        
        {printableFields.length > 0 && (
          <DevisPreviewSection 
            fields={printableFields} 
            company={company} 
          />
        )}
      </div>
    </Layout>
  );
};

const EditionDevis: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EditionDevisContent />
    </QueryClientProvider>
  );
};

export default EditionDevis;
