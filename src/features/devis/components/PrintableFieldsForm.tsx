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
import { CompanyData } from "@/types";

interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

export const PrintableFieldsForm: React.FC = () => {
  const { state, dispatch } = useProject();
  const { metadata, property } = state;
  
  // État pour stocker les informations du client et de la société
  const [clientName, setClientName] = useState<string>("Chargement...");
  const [companyName, setCompanyName] = useState<string>("LRS Rénovation");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  
  // État pour l'aperçu des pages
  const [showCoverPreview, setShowCoverPreview] = useState(false);
  const [showDetailsPreview, setShowDetailsPreview] = useState(false);
  
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

  // Utiliser directement les données de clientsData au lieu de chercher les infos du client
  useEffect(() => {
    if (metadata?.clientsData && metadata.clientsData.trim() !== '') {
      console.log("Utilisation des données clients de clientsData:", metadata.clientsData);
      
      // Mettre à jour le champ client dans printableFields
      setPrintableFields(prev => 
        prev.map(field => field.id === "client" 
          ? { ...field, content: metadata.clientsData } 
          : field
        )
      );
    } else {
      console.log("Aucune donnée client disponible dans clientsData");
      
      // Si aucune donnée cliente n'est disponible, afficher un message par défaut
      setPrintableFields(prev => 
        prev.map(field => field.id === "client" 
          ? { ...field, content: "Aucun client sélectionné" } 
          : field
        )
      );
    }
  }, [metadata?.clientsData]);

  // Récupérer les informations de la société sélectionnée
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      // Récupérer l'ID de la société depuis la page Infos Chantier
      // Pour l'instant, utilisons un ID fixe puisque c'est comme ça dans InfosChantier.tsx
      const companyId = "c949dd6d-52e8-41c4-99f8-6e84bf4695b9"; // ID par défaut utilisé dans InfosChantier
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCompanyName(data.name);
          setCompanyLogoUrl(data.logo_url);
          setCompanyData(data);
          
          // Mettre à jour les champs de société dans printableFields
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

          // Mettre à jour les métadonnées du projet avec les données de la société
          dispatch({
            type: 'UPDATE_METADATA',
            payload: { company: data }
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de la société:", error);
      }
    };

    fetchCompanyInfo();
  }, [dispatch]);

  useEffect(() => {
    // Update fields content when metadata changes
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
    // In a real implementation, this would save to localStorage or a database
    toast.success("Paramètres d'impression enregistrés");
  };

  const handlePreviewPrint = () => {
    toast.info("Aperçu avant impression (fonctionnalité à implémenter)");
  };
  
  const handleCoverPreview = () => {
    setShowCoverPreview(true);
  };
  
  const handleDetailsPreview = () => {
    setShowDetailsPreview(true);
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
            Aperçu
          </Button>
          <Button variant="outline" onClick={handleCoverPreview} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Aperçu Page de Garde
          </Button>
          <Button variant="outline" onClick={handleDetailsPreview} className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Aperçu Détails des Travaux
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
    </div>
  );
};
