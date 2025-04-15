
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FileEdit } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/lib/supabase';
import { Company, PrintableField } from "@/types";

// Import des composants refactorisés
import PropertyInfoCard from "@/features/recap/components/PropertyInfoCard";
import TravauxRecapContent from "@/features/recap/components/TravauxRecapContent";
import DevisCompletPreview from "@/features/devis/components/DevisCompletPreview";

const Recapitulatif: React.FC = () => {
  const { state } = useProject();
  const { property, rooms } = state;
  const { travaux, getTravauxForPiece } = useTravaux();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Récupérer les informations de l'entreprise depuis Supabase
  const { data: company } = useQuery({
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
  
  // Récupérer les champs du devis depuis Supabase si disponibles
  const { data: printableFields } = useQuery({
    queryKey: ['printableFields'],
    queryFn: async () => {
      const { data: projectData, error: projectError } = await supabase
        .from('projects_save')
        .select('devis_fields')
        .eq('id', state.currentProject?.id || '')
        .single();
      
      if (projectError || !projectData?.devis_fields) {
        // Utiliser des valeurs par défaut
        return [
          { id: "devisNumber", name: "Numéro de devis", enabled: true, content: "AUTO-" + Date.now() },
          { id: "devisDate", name: "Date du devis", enabled: true, content: new Date().toISOString().substring(0, 10) },
          { id: "validityOffer", name: "Validité de l'offre", enabled: true, content: "3 mois" },
          { id: "client", name: "Client", enabled: true, content: state.client?.name || "" },
          { id: "projectDescription", name: "Description du projet", enabled: true, content: state.property?.description || "" },
          { id: "projectAddress", name: "Adresse du projet", enabled: true, content: `${state.property?.address || ""} - ${state.property?.zipCode || ""} ${state.property?.city || ""}` },
          { id: "occupant", name: "Occupant", enabled: false, content: "" },
          { id: "additionalInfo", name: "Informations complémentaires", enabled: false, content: "" },
        ] as PrintableField[];
      }
      
      return projectData.devis_fields as PrintableField[];
    }
  });

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <Layout
      title="Récapitulatif des travaux"
      subtitle="Estimation détaillée par pièce"
    >
      <div className="mb-4 flex justify-between">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/travaux">
            <ArrowLeft className="h-4 w-4" />
            Retour aux travaux
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/edition-devis">
              <FileEdit className="h-4 w-4" />
              Éditer le devis
            </Link>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleOpenPreview}
          >
            <Printer className="h-4 w-4" />
            Imprimer le devis
          </Button>
        </div>
      </div>

      {/* Informations générales du bien */}
      <PropertyInfoCard property={property} rooms={rooms} />

      {/* Récapitulatif des travaux */}
      <TravauxRecapContent 
        rooms={rooms} 
        travaux={travaux} 
        getTravauxForPiece={getTravauxForPiece} 
      />
      
      {/* Aperçu du devis complet pour impression */}
      {isPreviewOpen && printableFields && (
        <DevisCompletPreview
          fields={printableFields}
          rooms={rooms}
          travaux={travaux}
          company={company || null}
          getTravauxForPiece={getTravauxForPiece}
          onClose={handleClosePreview}
        />
      )}
    </Layout>
  );
};

export default Recapitulatif;
