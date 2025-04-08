
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { PlusCircle, X } from 'lucide-react';
import { arrondir2Decimales } from '@/lib/utils';

// Définissez le schéma de validation Zod pour le formulaire
const autreSurfaceSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  largeur: z.coerce.number().min(0.01, "La largeur doit être supérieure à 0"),
  hauteur: z.coerce.number().min(0.01, "La hauteur doit être supérieure à 0"),
  surface_impactee: z.enum(["mur", "plafond", "sol", "aucune"], {
    required_error: "Veuillez sélectionner une surface impactée",
  }),
  adjustment_type: z.enum(["ajouter", "deduire"], {
    required_error: "Veuillez sélectionner un type d'ajustement",
  }),
  impacte_plinthe: z.boolean().default(false),
  quantity: z.coerce.number().min(1, "La quantité doit être au moins 1"),
  description: z.string().optional(),
  type_id: z.string().optional(),
});

type AutreSurfaceFormValues = z.infer<typeof autreSurfaceSchema>;

interface AutreSurfaceFormProps {
  roomId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  itemToEdit?: any;
}

const AutreSurfaceForm: React.FC<AutreSurfaceFormProps> = ({
  roomId,
  onSubmit,
  onCancel,
  itemToEdit
}) => {
  const [loading, setLoading] = useState(false);
  const [typesAutresSurfaces, setTypesAutresSurfaces] = useState<any[]>([]);
  
  // Initialiser le formulaire avec React Hook Form
  const form = useForm<AutreSurfaceFormValues>({
    resolver: zodResolver(autreSurfaceSchema),
    defaultValues: {
      name: itemToEdit?.name || "",
      largeur: itemToEdit?.largeur || 0.5,
      hauteur: itemToEdit?.hauteur || 0.5,
      surface_impactee: itemToEdit?.surface_impactee || "mur",
      adjustment_type: itemToEdit?.adjustment_type || "deduire",
      impacte_plinthe: itemToEdit?.impacte_plinthe || false,
      quantity: itemToEdit?.quantity || 1,
      description: itemToEdit?.description || "",
      type_id: itemToEdit?.type_id || undefined,
    },
  });

  // Surveiller les changements de largeur et hauteur pour calculer la surface
  const largeur = form.watch("largeur");
  const hauteur = form.watch("hauteur");
  const quantity = form.watch("quantity");
  const [surface, setSurface] = useState<number>(0);

  // À chaque changement de largeur ou hauteur, recalculer la surface
  useEffect(() => {
    if (largeur && hauteur) {
      const surfaceCalculee = arrondir2Decimales(largeur * hauteur * quantity);
      setSurface(surfaceCalculee);
    } else {
      setSurface(0);
    }
  }, [largeur, hauteur, quantity]);

  // Charger les types d'autres surfaces depuis l'API
  useEffect(() => {
    const fetchTypesAutresSurfaces = async () => {
      try {
        // Cette fonction sera implémentée plus tard pour charger depuis Supabase
        // Pour l'instant, utilisons des données simulées
        const types = [
          { id: '1', nom: 'Trémie', description: 'Ouverture dans un plancher', surfaceImpacteeParDefaut: 'sol', estDeduction: true },
          { id: '2', nom: 'Poteau', description: 'Élément vertical porteur', surfaceImpacteeParDefaut: 'mur', estDeduction: false },
          { id: '3', nom: 'Niche', description: 'Renfoncement dans un mur', surfaceImpacteeParDefaut: 'mur', estDeduction: true },
          { id: '4', nom: 'Poutres apparentes', description: 'Élément horizontal porteur visible', surfaceImpacteeParDefaut: 'plafond', estDeduction: false },
        ];
        setTypesAutresSurfaces(types);
      } catch (error) {
        console.error("Erreur lors du chargement des types d'autres surfaces:", error);
        toast.error("Impossible de charger les types d'autres surfaces");
      }
    };

    fetchTypesAutresSurfaces();
  }, []);

  // Fonction pour gérer la sélection d'un type d'autre surface
  const handleTypeSelection = (typeId: string) => {
    const selectedType = typesAutresSurfaces.find(type => type.id === typeId);
    if (selectedType) {
      form.setValue("name", selectedType.nom);
      form.setValue("surface_impactee", selectedType.surfaceImpacteeParDefaut);
      form.setValue("adjustment_type", selectedType.estDeduction ? "deduire" : "ajouter");
      form.setValue("type_id", typeId);
    }
  };

  // Fonction pour soumettre le formulaire
  const handleFormSubmit = (values: AutreSurfaceFormValues) => {
    setLoading(true);
    try {
      // Préparer les données à envoyer
      const autreSurfaceData = {
        ...values,
        room_id: roomId,
        surface: surface,
        // Ces champs seraient générés côté serveur dans une implémentation réelle
        id: itemToEdit?.id || `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      
      onSubmit(autreSurfaceData);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Une erreur est survenue lors de l'ajout de la surface personnalisée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Sélection d'un type pré-défini (optionnel) */}
        <div className="space-y-2">
          <Label>Type de surface (optionnel)</Label>
          <Select onValueChange={handleTypeSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type prédéfini" />
            </SelectTrigger>
            <SelectContent>
              {typesAutresSurfaces.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.nom} - {type.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Sélectionnez un type pour pré-remplir les champs ou personnalisez manuellement
          </p>
        </div>

        {/* Nom */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ex: Trémie, Poteau, Niche..." />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Dimensions (largeur, hauteur) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="largeur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largeur (m)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    step="0.01" 
                    min="0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hauteur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hauteur (m)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    step="0.01" 
                    min="0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="1" 
                    step="1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Surface calculée (lecture seule) */}
        <div className="bg-gray-50 p-3 rounded-md">
          <Label>Surface calculée:</Label>
          <div className="text-lg font-semibold mt-1">
            {surface} m² ({largeur} m × {hauteur} m × {quantity})
          </div>
        </div>

        {/* Type d'ajustement (ajouter/déduire) */}
        <FormField
          control={form.control}
          name="adjustment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'ajustement</FormLabel>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={field.value === "ajouter"} 
                    onChange={() => field.onChange("ajouter")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Ajouter à la surface</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={field.value === "deduire"} 
                    onChange={() => field.onChange("deduire")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Déduire de la surface</span>
                </label>
              </div>
              <FormDescription>
                Définit si cette surface doit être ajoutée ou déduite du calcul total
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Surface impactée */}
        <FormField
          control={form.control}
          name="surface_impactee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surface impactée</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la surface impactée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mur">Mur</SelectItem>
                  <SelectItem value="plafond">Plafond</SelectItem>
                  <SelectItem value="sol">Sol</SelectItem>
                  <SelectItem value="aucune">Aucune</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Impact sur les plinthes */}
        <FormField
          control={form.control}
          name="impacte_plinthe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 border border-gray-200 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Impacte les plinthes</FormLabel>
                <FormDescription>
                  Cochez si cet élément modifie le calcul des plinthes
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Description ou notes supplémentaires..." 
                  rows={3}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {itemToEdit ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AutreSurfaceForm;
