
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PrintableField } from "../services/pdfGenerationService";
import { Company } from "@/types";
import DevisPreviewButton from "./DevisPreviewButton";
import { FileText, LayoutList, Calculator, FileSpreadsheet } from "lucide-react";

interface DevisPreviewSectionProps {
  fields: PrintableField[];
  company: Company | null;
}

const DevisPreviewSection: React.FC<DevisPreviewSectionProps> = ({ fields, company }) => {
  return (
    <Card className="shadow-md mt-6">
      <CardHeader>
        <CardTitle>Aperçu du devis</CardTitle>
        <CardDescription>
          Visualisez les différentes parties du devis avant impression ou exportation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="complet" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="complet" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Devis Complet
            </TabsTrigger>
            <TabsTrigger value="cover" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Page de garde
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <LayoutList className="h-4 w-4" />
              Détails
            </TabsTrigger>
            <TabsTrigger value="recap" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Récapitulatif
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="complet" className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Aperçu du devis complet incluant la page de garde, les détails des travaux et le récapitulatif.
              </p>
              <DevisPreviewButton 
                fields={fields}
                company={company}
                previewType="complet"
                className="mx-auto"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="cover" className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Aperçu de la page de garde du devis contenant les informations de base.
              </p>
              <DevisPreviewButton 
                fields={fields}
                company={company}
                previewType="cover"
                className="mx-auto"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Aperçu de la section détaillant les travaux par pièce.
              </p>
              <DevisPreviewButton 
                fields={fields}
                company={company}
                previewType="details"
                className="mx-auto"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="recap" className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Aperçu de la section récapitulative des travaux par pièce et des totaux.
              </p>
              <DevisPreviewButton 
                fields={fields}
                company={company}
                previewType="recap"
                className="mx-auto"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DevisPreviewSection;
