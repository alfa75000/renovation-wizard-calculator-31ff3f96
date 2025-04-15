import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMenuiseries } from '@/hooks/useMenuiseries';
import { Menuiserie } from '@/types';
import { useMenuiseriesTypes } from '@/contexts/MenuiseriesTypesContext';

// Define form schema for validation
const menuiserieSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  largeur: z.coerce.number().min(1, "La largeur doit être supérieure à 0"),
  hauteur: z.coerce.number().min(1, "La hauteur doit être supérieure à 0"),
  quantity: z.coerce.number().min(1, "La quantité doit être au moins 1"),
  surfaceImpactee: z.enum(["mur", "plafond", "sol"]),
  impactePlinthe: z.boolean().optional()
});

interface MenuiserieFormProps {
  roomId: string;
  onAddMenuiserie: (menuiserie: Omit<Menuiserie, 'id' | 'surface'>) => void;
  onCancel: () => void;
}

const MenuiserieForm: React.FC<MenuiserieFormProps> = ({ roomId, onAddMenuiserie, onCancel }) => {
  const { state: menuiseriesTypesState } = useMenuiseriesTypes();
  const { calculateMenuiserieSurface } = useMenuiseries();
  const [menuiserieType, setMenuiserieType] = useState<string>("");
  
  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(menuiserieSchema),
    defaultValues: {
      type: "",
      name: "Menuiserie n° 1",
      largeur: 80,
      hauteur: 200,
      quantity: 1,
      surfaceImpactee: "mur" as const,
      impactePlinthe: false
    }
  });
  
  // Function to handle form submission
  const onSubmit = (data: z.infer<typeof menuiserieSchema>) => {
    // Convert form data to menuiserie object
    const newMenuiserie: Omit<Menuiserie, 'id' | 'surface'> = {
      roomId,
      type: data.type,
      nom: data.type,
      name: data.name,
      largeur: data.largeur,
      hauteur: data.hauteur,
      quantity: data.quantity,
      quantite: data.quantity,
      surfaceImpactee: data.surfaceImpactee,
      impactePlinthe: data.impactePlinthe || false,
      description: ""
    };
    
    // Pass the new menuiserie to parent component
    onAddMenuiserie(newMenuiserie);
  };
  
  // Update form values when menuiserie type changes
  useEffect(() => {
    if (menuiserieType) {
      const selectedType = menuiseriesTypesState.types.find(type => type.id === menuiserieType);
      if (selectedType) {
        // Préremplir les dimensions si elles sont définies dans le type
        if (selectedType.largeur) {
          form.setValue('largeur', selectedType.largeur);
        }
        if (selectedType.hauteur) {
          form.setValue('hauteur', selectedType.hauteur);
        }
        
        // Préremplir la surface impactée si définie
        if (selectedType.surfaceReference) {
          form.setValue('surfaceImpactee', selectedType.surfaceReference);
        }
        
        // Préremplir l'impact sur les plinthes si défini
        if (typeof selectedType.impactePlinthe !== 'undefined') {
          form.setValue('impactePlinthe', selectedType.impactePlinthe);
        }
      }
    }
  }, [menuiserieType, menuiseriesTypesState.types, form]);
  
  // Handle menuiserie type change
  const handleTypeChange = (value: string) => {
    setMenuiserieType(value);
    form.setValue('type', value);
    
    // Trouver le type sélectionné
    const selectedType = menuiseriesTypesState.types.find(type => type.id === value);
    if (selectedType) {
      // Mettre à jour le nom avec le type sélectionné
      const currentName = form.getValues('name');
      const nameMatch = currentName.match(/^Menuiserie n° \d+/);
      const prefix = nameMatch ? nameMatch[0] + ' ' : 'Menuiserie n° 1 ';
      form.setValue('name', prefix + selectedType.nom);
    }
  };
  
  // Calculate surface based on dimensions
  const calculateSurface = () => {
    const largeur = form.getValues('largeur');
    const hauteur = form.getValues('hauteur');
    if (largeur && hauteur) {
      return calculateMenuiserieSurface(largeur, hauteur);
    }
    return 0;
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Type de menuiserie */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de menuiserie</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => handleTypeChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {menuiseriesTypesState.types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Nom de la menuiserie */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="largeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largeur (cm)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" step="0.1" />
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
                    <Input {...field} type="number" min="1" step="0.1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Surface calculée */}
          <div>
            <Label>Surface</Label>
            <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
              {calculateSurface().toFixed(2)} m²
            </div>
          </div>
          
          {/* Quantité */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Surface impactée */}
          <FormField
            control={form.control}
            name="surfaceImpactee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface impactée</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une surface" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mur">Mur</SelectItem>
                    <SelectItem value="plafond">Plafond</SelectItem>
                    <SelectItem value="sol">Sol</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Impact sur les plinthes */}
          <FormField
            control={form.control}
            name="impactePlinthe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Impact sur les plinthes
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuiserieForm;
