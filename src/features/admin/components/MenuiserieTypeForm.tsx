
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuiserieType } from '@/types/supabase';
import { createMenuiserieType, updateMenuiserieType } from '@/services/menuiseriesService';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Schéma de validation pour le formulaire
const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  largeur: z.coerce.number().min(0.01, "La largeur doit être supérieure à 0"),
  hauteur: z.coerce.number().min(0.01, "La hauteur doit être supérieure à 0"),
  surface_impactee: z.string(),
  impacts_plinthe: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface MenuiserieTypeFormProps {
  menuiserie: MenuiserieType | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const MenuiserieTypeForm: React.FC<MenuiserieTypeFormProps> = ({
  menuiserie,
  onSubmit,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialiser le formulaire avec les valeurs existantes ou des valeurs par défaut
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: menuiserie?.name || '',
      description: menuiserie?.description || '',
      largeur: menuiserie?.largeur || 80,
      hauteur: menuiserie?.hauteur || 200,
      surface_impactee: menuiserie?.surface_impactee || 'Mur',
      impacts_plinthe: menuiserie?.impacts_plinthe || false
    }
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (menuiserie) {
        // Mise à jour
        await updateMenuiserieType(menuiserie.id, data);
        toast.success(`Type de menuiserie "${data.name}" mis à jour avec succès`);
      } else {
        // Création
        await createMenuiserieType(data as MenuiserieType);
        toast.success(`Type de menuiserie "${data.name}" créé avec succès`);
      }
      onSubmit();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du type de menuiserie:', error);
      toast.error(menuiserie 
        ? "Erreur lors de la mise à jour du type de menuiserie" 
        : "Erreur lors de la création du type de menuiserie"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>
          {menuiserie ? `Modifier "${menuiserie.name}"` : "Ajouter un type de menuiserie"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Porte d'entrée" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description du type de menuiserie"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="largeur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largeur (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hauteur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hauteur (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="surface_impactee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface impactée</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la surface impactée" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mur">Mur</SelectItem>
                      <SelectItem value="Sol">Sol</SelectItem>
                      <SelectItem value="Plafond">Plafond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impacts_plinthe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Impacte les plinthes</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : menuiserie ? "Mettre à jour" : "Ajouter"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MenuiserieTypeForm;
