
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { DevisCoverPreview } from "@/features/devis/components/DevisCoverPreview";
import { DevisDetailsPreview } from "@/features/devis/components/DevisDetailsPreview";
import DevisRecapPreview from "@/features/devis/components/DevisRecapPreview";
import { supabase } from "@/lib/supabase";
import { CompanyData } from "@/types";

// Create a client for this page
const queryClient = new QueryClient();

const EditionDevis: React.FC = () => {
  const { state, dispatch } = useProject();
  const { metadata } = state;
  
  const [activePreview, setActivePreview] = useState<'none' | 'cover' | 'details' | 'recap'>('none');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
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
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const companyId = "c949dd6d-52e8-41c4-99f8-6e84bf4695b9";
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          console.log("EditionDevis: Données de l'entreprise récupérées:", data);
          setCompanyData(data as CompanyData);
          
          // Mettre à jour les métadonnées du projet avec les données de l'entreprise
          dispatch({
            type: 'UPDATE_METADATA',
            payload: { company: data as CompanyData }
          });
          
          console.log("EditionDevis: Métadonnées mises à jour avec les données de l'entreprise");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de la société:", error);
      }
    };

    fetchCompanyInfo();
  }, [dispatch]);
  
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
