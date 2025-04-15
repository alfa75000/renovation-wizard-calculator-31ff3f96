
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import DevisCoverPreview from "@/features/devis/components/DevisCoverPreview";
import DevisDetailsPreview from "@/features/devis/components/DevisDetailsPreview";
import DevisRecapPreview from "@/features/devis/components/DevisRecapPreview";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const { state } = useProject();
  const { metadata } = state;
  
  const [activePreview, setActivePreview] = useState<'none' | 'cover' | 'details' | 'recap'>('none');
  
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
          <div className="flex gap-2 mb-4">
            <Button 
              variant={activePreview === 'cover' ? 'default' : 'outline'} 
              className="flex items-center gap-2"
              onClick={() => setActivePreview(activePreview === 'cover' ? 'none' : 'cover')}
            >
              {activePreview === 'cover' ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              Aperçu Page de Garde
            </Button>
            
            <Button 
              variant={activePreview === 'details' ? 'default' : 'outline'} 
              className="flex items-center gap-2"
              onClick={() => setActivePreview(activePreview === 'details' ? 'none' : 'details')}
            >
              {activePreview === 'details' ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              Aperçu Détails des Travaux
            </Button>
            
            <Button 
              variant={activePreview === 'recap' ? 'default' : 'outline'} 
              className="flex items-center gap-2"
              onClick={() => setActivePreview(activePreview === 'recap' ? 'none' : 'recap')}
            >
              {activePreview === 'recap' ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              Aperçu du Récapitulatif
            </Button>
          </div>
          
          {activePreview === 'cover' && <DevisCoverPreview />}
          {activePreview === 'details' && <DevisDetailsPreview />}
          {activePreview === 'recap' && <DevisRecapPreview />}
          
          {activePreview === 'none' && <PrintableFieldsForm />}
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
