
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DevisCoverPreview } from "./DevisCoverPreview";
import { Button } from "@/components/ui/button";

interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

interface PrintableFieldsFormProps {
  defaultSelectedFont?: string;
}

export const PrintableFieldsForm: React.FC<PrintableFieldsFormProps> = ({ 
  defaultSelectedFont = 'Roboto' 
}) => {
  const [printableFields, setPrintableFields] = useState<PrintableField[]>([
    { id: "devisNumber", name: "Numéro de devis", enabled: true, content: "2024-001" },
    { id: "devisDate", name: "Date du devis", enabled: true, content: new Date().toLocaleDateString() },
    { id: "validityOffer", name: "Validité de l'offre", enabled: true, content: "3 mois" },
    { id: "client", name: "Client", enabled: true, content: "Nom du client\nAdresse du client\nCode postal et ville" },
    { id: "projectDescription", name: "Description du projet", enabled: true, content: "Rénovation intérieure" },
    { id: "projectAddress", name: "Adresse du projet", enabled: true, content: "Adresse du chantier" },
    { id: "occupant", name: "Occupant", enabled: true, content: "M. ou Mme. Nom de l'occupant" },
    { id: "additionalInfo", name: "Informations complémentaires", enabled: false, content: "Informations spécifiques" },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [company, setCompany] = useState({
    name: "Votre Entreprise",
    address: "Adresse de l'entreprise",
    phone: "Téléphone de l'entreprise",
    email: "Email de l'entreprise",
    logo: "/images/lrs-logo.jpg"
  });

  useEffect(() => {
    // Mise à jour des contenus des champs (simulé)
    setPrintableFields(prevFields =>
      prevFields.map(field => {
        let content = field.content;
        switch (field.id) {
          case "devisNumber":
            content = "2024-001";
            break;
          case "devisDate":
            content = new Date().toLocaleDateString();
            break;
          case "validityOffer":
            content = "3 mois";
            break;
          case "client":
            content = "Nom du client\nAdresse du client\nCode postal et ville";
            break;
          case "projectDescription":
            content = "Rénovation intérieure";
            break;
          case "projectAddress":
            content = "Adresse du chantier";
            break;
          case "occupant":
            content = "M. ou Mme. Nom de l'occupant";
            break;
          case "additionalInfo":
            content = "Informations spécifiques";
            break;
          default:
            break;
        }
        return { ...field, content };
      })
    );
  }, []);

  const toggleField = (id: string) => {
    setPrintableFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, enabled: !field.enabled } : field
      )
    );
  };

  // Dans la section où DevisCoverPreview est utilisé, nous passons la police
  return (
    <>
      <div className="bg-white rounded-md p-4 space-y-4">
        {printableFields.map(field => (
          <div key={field.id} className="flex items-center justify-between">
            <Label htmlFor={field.id}>{field.name}</Label>
            <Switch
              id={field.id}
              checked={field.enabled}
              onCheckedChange={() => toggleField(field.id)}
            />
          </div>
        ))}
        <Separator />
        <Button onClick={() => setShowPreview(true)}>
          Aperçu de la page de garde
        </Button>
      </div>

      {showPreview && (
        <DevisCoverPreview
          fields={printableFields}
          company={company}
          onClose={() => setShowPreview(false)}
          selectedFont={defaultSelectedFont}
        />
      )}
    </>
  );
};
