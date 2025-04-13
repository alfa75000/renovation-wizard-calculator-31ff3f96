
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "@/services/companiesService";
import { Printer, Save } from "lucide-react";
import { toast } from "sonner";

interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
}

export const PrintableFieldsForm: React.FC = () => {
  const [printableFields, setPrintableFields] = useState<PrintableField[]>([
    { id: "companyLogo", name: "Logo société", enabled: true },
    { id: "companyName", name: "Nom société", enabled: true },
  ]);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Éléments à imprimer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {printableFields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={field.enabled}
                  onCheckedChange={() => handleFieldToggle(field.id)}
                />
                <Label htmlFor={field.id} className="cursor-pointer">
                  {field.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePreviewPrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Aperçu
        </Button>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};
