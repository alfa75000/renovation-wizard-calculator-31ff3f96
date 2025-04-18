
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "@/services/companiesService";
import { Printer, Save, FileText, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useProject } from "@/contexts/ProjectContext";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { DevisCoverPreview } from "./DevisCoverPreview";
import { DevisDetailsPreview } from "./DevisDetailsPreview";
import DevisRecapPreview from "./DevisRecapPreview";
import { CompanyData } from "@/types";
import { generateCompletePDF } from "@/services/pdfGenerationService";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";

interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

export const PrintableFieldsForm: React.FC = () => {
  const { state, dispatch } = useProject();
  const { metadata, property, rooms } = state;
  const { travaux, getTravauxForPiece } = useTravaux();
  
  const [clientName, setClientName] = useState<string>("Chargement...");
  const [companyName, setCompanyName] = useState<string>("LRS Rénovation");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  
  const [showCoverPreview, setShowCoverPreview] = useState(false);
  const [showDetailsPreview, setShowDetailsPreview] = useState(false);
  const [showRecapPreview, setShowRecapPreview] = useState(false);
  
  const [printableFields, setPrintableFields] = useState<PrintableField[]>([
    { id: "companyLogo", name: "Logo société", enabled: true, content: null },
    { id: "companyName", name: "Nom société", enabled: true, content: companyName },
    { id: "client", name: "Client", enabled: true, content: clientName },
    { id: "devisNumber", name: "Numéro du devis", enabled: true, content: metadata?.devisNumber || "Non défini" },
    { id: "devisDate", name: "Date du devis", enabled: true, content: metadata?.dateDevis || "Non définie" },
    { id: "validityOffer", name: "Validité de l'offre", enabled: true, content: "Validité de l'offre : 3 mois." },
    { id: "projectDescription", name: "Description du projet", enabled: true, content: metadata?.descriptionProjet || "Aucune description" },
    { id: "projectAddress", name: "Adresse du chantier", enabled: true, content: metadata?.adresseChantier || "Aucune adresse" },
    { id: "occupant", name: "Occupant", enabled: true, content: metadata?.occupant || "Non spécifié" },
    { id: "additionalInfo", name: "Informations complémentaires", enabled: true, content: metadata?.infoComplementaire || "Aucune information" },
    { id: "summary", name: "Récapitulatif", enabled: true },
  ]);

  useEffect(() => {
    if (metadata?.clientsData && metadata.clientsData.trim() !== '') {
      console.log("Utilisation des données clients de clientsData:", metadata.clientsData);
      
      setPrintableFields(prev => 
        prev.map(field => field.id === "client" 
          ? { ...field, content: metadata.clientsData } 
          : field
        )
      );
    } else {
      console.log("Aucune donnée client disponible dans clientsData");
      
      setPrintableFields(prev => 
        prev.map(field => field.id === "client" 
          ? { ...field, content: "Aucun client sélectionné" } 
          : field
        )
      );
    }
  }, [metadata?.clientsData]);

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
          console.log("Données de l'entreprise récupérées:", data);
          setCompanyName(data.name);
          setCompanyLogoUrl(data.logo_url);
          setCompanyData(data as CompanyData);
          
          setPrintableFields(prev => 
            prev.map(field => {
              if (field.id === "companyName") {
                return { ...field, content: data.name };
              } 
              if (field.id === "companyLogo") {
                return { ...field, content: data.logo_url };
              }
              return field;
            })
          );

          dispatch({
            type: 'UPDATE_METADATA',
            payload: { company: data as CompanyData }
          });
          
          console.log("Métadonnées mises à jour avec les données de l'entreprise");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de la société:", error);
      }
    };

    fetchCompanyInfo();
  }, [dispatch]);

  useEffect(() => {
    setPrintableFields(prev => 
      prev.map(field => {
        switch(field.id) {
          case "devisNumber":
            return { ...field, content: metadata?.devisNumber || "Non défini" };
          case "devisDate":
            return { ...field, content: metadata?.dateDevis || "Non définie" };
          case "projectDescription":
            return { ...field, content: metadata?.descriptionProjet || "Aucune description" };
          case "projectAddress":
            return { ...field, content: metadata?.adresseChantier || "Aucune adresse" };
          case "occupant":
            return { ...field, content: metadata?.occupant || "Non spécifié" };
          case "additionalInfo":
            return { ...field, content: metadata?.infoComplementaire || "Aucune information" };
          default:
            return field;
        }
      })
    );
  }, [metadata]);

  const handleFieldToggle = (fieldId: string) => {
    setPrintableFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, enabled: !field.enabled } : field
      )
    );
  };

  const handleSaveSettings = () => {
    toast.success("Paramètres d'impression enregistrés");
  };

  const handlePreviewPrint = async () => {
    try {
      // Filtrer uniquement les champs activés
      const enabledFields = printableFields.filter(field => field.enabled);
      
      // Générer le PDF complet avec toutes les sections
      await generateCompletePDF(
        enabledFields,
        companyData,
        rooms,
        travaux,
        getTravauxForPiece,
        metadata
      );
      
      toast.success("PDF du devis complet généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF complet:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };
  
  const handleCoverPreview = () => {
    setShowCoverPreview(true);
  };
  
  const handleDetailsPreview = () => {
    setShowDetailsPreview(true);
  };
  
  const handleRecapPreview = () => {
    setShowRecapPreview(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Éléments à imprimer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {printableFields.map((field) => (
              <div key={field.id} className="w-full">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={field.enabled}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <Label htmlFor={field.id} className="cursor-pointer font-medium">
                    {field.name}
                  </Label>
                </div>
                
                {field.id === "companyLogo" && companyLogoUrl && (
                  <div className="ml-6 mt-1">
                    <img 
                      src={companyLogoUrl} 
                      alt="Logo de l'entreprise" 
                      className="h-12 object-contain"
                    />
                  </div>
                )}
                
                {field.id !== "companyLogo" && field.id !== "summary" && field.content && (
                  <div className="ml-6 mt-1 text-sm text-gray-500 italic">
                    {field.content}
                  </div>
                )}
                
                {field.id !== printableFields[printableFields.length - 1].id && (
                  <Separator className="my-3" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewPrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Générer PDF du Devis
          </Button>
          <Button variant="outline" onClick={handleCoverPreview} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Aperçu Page de Garde
          </Button>
          <Button variant="outline" onClick={handleDetailsPreview} className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Aperçu Détails des Travaux
          </Button>
          <Button variant="outline" onClick={handleRecapPreview} className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Aperçu du Récapitulatif
          </Button>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>
      
      {showCoverPreview && (
        <DevisCoverPreview 
          fields={printableFields.filter(field => field.enabled)} 
          company={companyData}
          onClose={() => setShowCoverPreview(false)}
        />
      )}
      
      {showDetailsPreview && (
        <DevisDetailsPreview
          open={showDetailsPreview}
          onClose={() => setShowDetailsPreview(false)}
        />
      )}
      
      {showRecapPreview && (
        <DevisRecapPreview />
      )}
    </div>
  );
};
