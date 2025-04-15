
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { generateDevisNumber } from "@/services/devisService";
import { useToast } from "@/components/ui/use-toast";
import { PrintableField } from "../services/pdfGenerationService";

// Typage pour les champs du devis
const devisSchema = z.object({
  devisNumber: z.string().min(1, "Un numéro de devis est requis"),
  devisDate: z.string().min(1, "Une date est requise"),
  validityOffer: z.string(),
  client: z.string().min(1, "Les informations du client sont requises"),
  projectDescription: z.string().optional(),
  projectAddress: z.string().optional(),
  occupant: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Définition des champs disponibles pour le devis
const availableFields: PrintableField[] = [
  { id: "devisNumber", name: "Numéro de devis", enabled: true },
  { id: "devisDate", name: "Date du devis", enabled: true },
  { id: "validityOffer", name: "Validité de l'offre", enabled: true },
  { id: "client", name: "Client", enabled: true },
  { id: "projectDescription", name: "Description du projet", enabled: true },
  { id: "projectAddress", name: "Adresse du projet", enabled: true },
  { id: "occupant", name: "Occupant", enabled: false },
  { id: "additionalInfo", name: "Informations complémentaires", enabled: false },
];

interface PrintableFieldsFormProps {
  onFieldsUpdate?: (fields: PrintableField[]) => void;
}

export const PrintableFieldsForm: React.FC<PrintableFieldsFormProps> = ({ onFieldsUpdate }) => {
  const [fields, setFields] = useState<PrintableField[]>(availableFields);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof devisSchema>>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      devisNumber: "",
      devisDate: new Date().toISOString().substring(0, 10),
      validityOffer: "3 mois",
      client: "",
      projectDescription: "",
      projectAddress: "",
      occupant: "",
      additionalInfo: "",
    },
  });

  // Générer un numéro de devis automatiquement au chargement
  useEffect(() => {
    const generateNumber = async () => {
      try {
        const number = await generateDevisNumber();
        form.setValue("devisNumber", number);
        updateFields("devisNumber", number);
      } catch (error) {
        console.error("Erreur lors de la génération du numéro de devis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de générer un numéro de devis automatiquement",
          variant: "destructive",
        });
      }
    };

    generateNumber();
  }, []);

  // Mettre à jour les champs lorsque le formulaire change
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Mettre à jour le contenu des champs
      const updatedFields = fields.map((field) => {
        const fieldValue = value[field.id as keyof typeof value];
        return {
          ...field,
          content: fieldValue?.toString() || null,
        };
      });
      
      setFields(updatedFields);
      
      // Notifier le parent des changements
      if (onFieldsUpdate) {
        onFieldsUpdate(updatedFields);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch, fields, onFieldsUpdate]);

  // Fonction pour mettre à jour l'état enabled d'un champ
  const toggleField = (id: string, enabled: boolean) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, enabled } : field
    );
    setFields(updatedFields);
    
    // Notifier le parent des changements
    if (onFieldsUpdate) {
      onFieldsUpdate(updatedFields);
    }
  };

  // Fonction pour mettre à jour le contenu d'un champ
  const updateFields = (id: string, content: string) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, content } : field
    );
    setFields(updatedFields);
    
    // Notifier le parent des changements
    if (onFieldsUpdate) {
      onFieldsUpdate(updatedFields);
    }
  };

  // Gérer la soumission du formulaire
  const onSubmit = (data: z.infer<typeof devisSchema>) => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les champs du devis ont été mis à jour avec succès",
    });
    
    // Mettre à jour le contenu des champs
    const updatedFields = fields.map((field) => {
      const fieldValue = data[field.id as keyof typeof data];
      return {
        ...field,
        content: fieldValue?.toString() || null,
      };
    });
    
    setFields(updatedFields);
    
    // Notifier le parent des changements
    if (onFieldsUpdate) {
      onFieldsUpdate(updatedFields);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Paramètres du devis</CardTitle>
        <CardDescription>
          Configurez les informations à inclure dans le devis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Numéro de devis */}
              <FormField
                control={form.control}
                name="devisNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor="devisNumber">Numéro de devis</FormLabel>
                      <Checkbox
                        id="devisNumberEnabled"
                        checked={fields.find((f) => f.id === "devisNumber")?.enabled || false}
                        onCheckedChange={(checked) =>
                          toggleField("devisNumber", checked === true)
                        }
                      />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!fields.find((f) => f.id === "devisNumber")?.enabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date du devis */}
              <FormField
                control={form.control}
                name="devisDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor="devisDate">Date du devis</FormLabel>
                      <Checkbox
                        id="devisDateEnabled"
                        checked={fields.find((f) => f.id === "devisDate")?.enabled || false}
                        onCheckedChange={(checked) =>
                          toggleField("devisDate", checked === true)
                        }
                      />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={!fields.find((f) => f.id === "devisDate")?.enabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Validité de l'offre */}
              <FormField
                control={form.control}
                name="validityOffer"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor="validityOffer">Validité de l'offre</FormLabel>
                      <Checkbox
                        id="validityOfferEnabled"
                        checked={fields.find((f) => f.id === "validityOffer")?.enabled || false}
                        onCheckedChange={(checked) =>
                          toggleField("validityOffer", checked === true)
                        }
                      />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!fields.find((f) => f.id === "validityOffer")?.enabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Client */}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="client">Client / Maître d'ouvrage</FormLabel>
                    <Checkbox
                      id="clientEnabled"
                      checked={fields.find((f) => f.id === "client")?.enabled || false}
                      onCheckedChange={(checked) =>
                        toggleField("client", checked === true)
                      }
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="resize-none"
                      disabled={!fields.find((f) => f.id === "client")?.enabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Nom, prénom, adresse et autres informations du client
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Description du projet */}
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="projectDescription">Description du projet</FormLabel>
                    <Checkbox
                      id="projectDescriptionEnabled"
                      checked={fields.find((f) => f.id === "projectDescription")?.enabled || false}
                      onCheckedChange={(checked) =>
                        toggleField("projectDescription", checked === true)
                      }
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      className="resize-none"
                      disabled={!fields.find((f) => f.id === "projectDescription")?.enabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Adresse du projet */}
            <FormField
              control={form.control}
              name="projectAddress"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="projectAddress">Adresse du projet</FormLabel>
                    <Checkbox
                      id="projectAddressEnabled"
                      checked={fields.find((f) => f.id === "projectAddress")?.enabled || false}
                      onCheckedChange={(checked) =>
                        toggleField("projectAddress", checked === true)
                      }
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      className="resize-none"
                      disabled={!fields.find((f) => f.id === "projectAddress")?.enabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Occupant */}
            <FormField
              control={form.control}
              name="occupant"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="occupant">Occupant</FormLabel>
                    <Checkbox
                      id="occupantEnabled"
                      checked={fields.find((f) => f.id === "occupant")?.enabled || false}
                      onCheckedChange={(checked) =>
                        toggleField("occupant", checked === true)
                      }
                    />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!fields.find((f) => f.id === "occupant")?.enabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Informations complémentaires */}
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="additionalInfo">Informations complémentaires</FormLabel>
                    <Checkbox
                      id="additionalInfoEnabled"
                      checked={fields.find((f) => f.id === "additionalInfo")?.enabled || false}
                      onCheckedChange={(checked) =>
                        toggleField("additionalInfo", checked === true)
                      }
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      className="resize-none"
                      disabled={!fields.find((f) => f.id === "additionalInfo")?.enabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Enregistrer les paramètres</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
