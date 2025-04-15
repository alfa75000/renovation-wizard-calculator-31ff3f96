
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { DevisCoverPreview } from "@/features/devis/components/DevisCoverPreview";
import { DevisDetailsPreview } from "@/features/devis/components/DevisDetailsPreview";
import DevisRecapPreview from "@/features/devis/components/DevisRecapPreview";
import { supabase } from "@/lib/supabase";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const { state } = useProject();
  const { metadata } = state;
  
  const [activePreview, setActivePreview] = useState<'none' | 'cover' | 'details' | 'recap'>('none');
  const [companyData, setCompanyData] = useState<any>(null);
  const [printableFields, setPrintableFields] = useState<any[]>([
    { id: "companyName", name: "Nom société", enabled: true, content: "LRS Rénovation" },
    { id: "client", name: "Client", enabled: true, content: metadata?.clientsData || "Aucun client sélectionné" },
    { id: "devisNumber", name: "Numéro du devis", enabled: true, content: metadata?.devisNumber || "Non défini" },
    { id: "devisDate", name: "Date du devis", enabled: true, content: metadata?.dateDevis || "Non définie" },
    { id: "validityOffer", name: "Validité de l'offre", enabled: true, content: "Validité de l'offre : 3 mois." },
    { id: "projectDescription", name: "Description du projet", enabled: true, content: metadata?.descriptionProjet || "Aucune description" },
    { id: "projectAddress", name: "Adresse du chantier", enabled: true, content: metadata?.adresseChantier || "Aucune adresse" },
    { id: "occupant", name: "Occupant", enabled: true, content: metadata?.occupant || "Non spécifié" },
    { id: "additionalInfo", name: "Informations complémentaires", enabled: true, content: metadata?.infoComplementaire || "Aucune information" },
  ]);
  
  // Fetch company data
  React.useEffect(() => {
    const fetchCompanyInfo = async () => {
      const companyId = "c949dd6d-52e8-41c4-99f8-6e84bf4695b9"; // Default ID used in InfosChantier
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCompanyData(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de la société:", error);
      }
    };

    fetchCompanyInfo();
  }, []);
  
  const pageTitle = metadata?.nomProjet 
    ? `Édition du devis - ${metadata.nomProjet}` 
    : "Édition du devis";
  
  const handleClosePreview = () => {
    setActivePreview('none');
  };
  
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
          
          {activePreview === 'cover' && (
            <DevisCoverPreview 
              fields={printableFields.filter((field: any) => field.enabled)} 
              company={companyData}
              onClose={handleClosePreview}
            />
          )}
          
          {activePreview === 'details' && (
            <DevisDetailsPreview
              open={activePreview === 'details'}
              onClose={handleClosePreview}
            />
          )}
          
          {activePreview === 'recap' && <DevisRecapPreview />}
          
          {activePreview === 'none' && <PrintableFieldsForm />}
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default EditionDevis;
