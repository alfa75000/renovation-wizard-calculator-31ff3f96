
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type Company = {
  id: string;
  name: string;
  prenom: string;
  email: string;
  tel1: string;
  tel2: string;
  address: string;
  city: string;
  postal_code: string;
  type: string;
  capital_social: string;
  siret: string;
  tva_intracom: string;
  code_ape: string;
  slogan: string;
  notes: string;
};

interface CompanyFormProps {
  companyToEdit: Company | null;
  onClose: () => void;
  onSubmit: (company: Company) => void;
}

const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  prenom: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  tel1: z.string().optional(),
  tel2: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  type: z.string().optional(),
  capital_social: z.string().optional(),
  siret: z.string().optional(),
  tva_intracom: z.string().optional(),
  code_ape: z.string().optional(),
  slogan: z.string().optional(),
  notes: z.string().optional(),
});

const CompanyForm: React.FC<CompanyFormProps> = ({ companyToEdit, onClose, onSubmit }) => {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: companyToEdit?.id || "",
      name: companyToEdit?.name || "",
      prenom: companyToEdit?.prenom || "",
      email: companyToEdit?.email || "",
      tel1: companyToEdit?.tel1 || "",
      tel2: companyToEdit?.tel2 || "",
      address: companyToEdit?.address || "",
      city: companyToEdit?.city || "",
      postal_code: companyToEdit?.postal_code || "",
      type: companyToEdit?.type || "",
      capital_social: companyToEdit?.capital_social || "",
      siret: companyToEdit?.siret || "",
      tva_intracom: companyToEdit?.tva_intracom || "",
      code_ape: companyToEdit?.code_ape || "",
      slogan: companyToEdit?.slogan || "",
      notes: companyToEdit?.notes || "",
    }
  });

  useEffect(() => {
    if (companyToEdit) {
      form.reset({
        id: companyToEdit.id,
        name: companyToEdit.name,
        prenom: companyToEdit.prenom,
        email: companyToEdit.email,
        tel1: companyToEdit.tel1,
        tel2: companyToEdit.tel2,
        address: companyToEdit.address,
        city: companyToEdit.city,
        postal_code: companyToEdit.postal_code,
        type: companyToEdit.type,
        capital_social: companyToEdit.capital_social,
        siret: companyToEdit.siret,
        tva_intracom: companyToEdit.tva_intracom,
        code_ape: companyToEdit.code_ape,
        slogan: companyToEdit.slogan,
        notes: companyToEdit.notes,
      });
    }
  }, [companyToEdit, form]);

  const handleSubmit = (data: z.infer<typeof companySchema>) => {
    const companyData: Company = {
      id: companyToEdit?.id || crypto.randomUUID(),
      ...data,
    };
    onSubmit(companyData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slogan</FormLabel>
                  <FormControl>
                    <Input placeholder="Slogan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom du contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Type d'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Coordonnées</h3>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="tel1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tel2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone secondaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Données administratives</h3>
            
            <FormField
              control={form.control}
              name="capital_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capital social</FormLabel>
                  <FormControl>
                    <Input placeholder="Capital social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="siret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro Siret</FormLabel>
                  <FormControl>
                    <Input placeholder="Siret" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tva_intracom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° TVA Intracommunautaire</FormLabel>
                  <FormControl>
                    <Input placeholder="N° TVA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code_ape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code APE</FormLabel>
                  <FormControl>
                    <Input placeholder="Code APE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes ou informations supplémentaires"
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit">{companyToEdit ? "Mettre à jour" : "Ajouter"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CompanyForm;
