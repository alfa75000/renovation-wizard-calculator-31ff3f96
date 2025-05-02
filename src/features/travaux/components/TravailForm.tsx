import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Room, Travail, SousTypeTravauxItemReference, Service } from '@/types';
import { TypeTravauxSelect } from './TypeTravauxSelect';
import { ServiceGroupSelect } from './ServiceGroupSelect';
import { SousTypeSelect } from './SousTypeSelect';
import { QuantitySection } from './QuantitySection';
import { PriceSection } from './PriceSection';
import { DescriptionSection } from './DescriptionSection';
import { TvaSelect } from './TvaSelect';
import { SurfaceImpacteeSelect } from './SurfaceImpacteeSelect';
import { useTravauxTypes } from '../hooks/useTravauxTypes';
import { toast } from 'sonner';

// --- Schéma de validation Zod ---
// (Identique à la version précédente, avec preprocess pour les nombres)
const travailFormSchema = z.object({
  typeTravauxId: z.string().min(1, "Type de travaux requis"),
  groupId: z.string().min(1, "Groupe requis"),
  sousTypeId: z.string().min(1, "Prestation requise"),
  description: z.string().min(1, "Description requise"),
  quantite: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || isNaN(Number(val))) ? undefined : Number(val),
    z.number({invalid_type_error: "Quantité invalide"}).min(0.01, "Quantité > 0 requise")
  ),
  unite: z.string().min(1, "Unité requise"),
  laborPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || isNaN(Number(val))) ? 0 : Number(val),
    z.number({invalid_type_error: "Prix invalide"}).min(0, "Prix MO >= 0")
  ),
  supplyPrice: z.preprocess(
     (val) => (val === "" || val === null || val === undefined || isNaN(Number(val))) ? 0 : Number(val),
    z.number({invalid_type_error: "Prix invalide"}).min(0, "Prix F. >= 0")
  ),
  tauxTVA: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || isNaN(Number(val))) ? undefined : Number(val),
    z.number({invalid_type_error: "TVA invalide"}).min(0, "TVA >= 0 requise")
  ),
  surfaceImpactee: z.string().optional().default("Aucune"),
  typeTravauxLabel: z.string().optional(),
  sousTypeLabel: z.string().optional(),
  prixUnitaireHT: z.number().optional(),
});

type TravailFormValues = z.infer<typeof travailFormSchema>;

interface TravailFormProps {
  piece: Room | undefined;
  onAddTravail: (travailData: Omit<Travail, 'id'> | Travail) => void;
  travailAModifier?: Travail | null;
  selectedElementContext?: string;
  calculatedLinear?: number;
}

const TravailForm: React.FC<TravailFormProps> = ({
  piece,
  onAddTravail,
  travailAModifier,
  selectedElementContext,
  calculatedLinear
}) => {
  const { state: travauxTypesState } = useTravauxTypes();

  // Initialisation react-hook-form
  const form = useForm<TravailFormValues>({
    resolver: zodResolver(travailFormSchema),
    // Mettre à jour les valeurs par défaut pour utiliser ?? et undefined pour les nombres
    defaultValues: {
      typeTravauxId: travailAModifier?.typeTravauxId || '',
      // Assurez-vous que votre type Travail a bien groupId, sinon adaptez
      groupId: travailAModifier?.groupId || '',
      sousTypeId: travailAModifier?.sousTypeId || '',
      description: travailAModifier?.description || '',
      quantite: travailAModifier?.quantite ?? undefined,
      unite: travailAModifier?.unite || '',
      laborPrice: travailAModifier?.laborPrice ?? 0,
      supplyPrice: travailAModifier?.supplyPrice ?? 0,
      tauxTVA: travailAModifier?.tauxTVA ?? undefined, // Ou une valeur par défaut comme 20 ?
      surfaceImpactee: travailAModifier?.surfaceImpactee || 'Aucune',
      typeTravauxLabel: travailAModifier?.typeTravauxLabel || '',
      sousTypeLabel: travailAModifier?.sousTypeLabel || '',
      prixUnitaireHT: travailAModifier?.prixUnitaireHT || 0,
    },
  });

  const { control, watch, setValue, reset, handleSubmit, formState } = form; // Extraire plus de méthodes

  const selectedTypeTravauxId = watch('typeTravauxId');
  const selectedGroupId = watch('groupId');
  const selectedSousTypeId = watch('sousTypeId');

  // --- EFFET POUR PRÉ-REMPLIR POUR LES PLINTHES ---
  useEffect(() => {
    if (!travailAModifier && selectedElementContext === 'plinthes' && typeof calculatedLinear === 'number' && calculatedLinear > 0) {
       console.log("Pré-remplissage pour Plinthes (Effet). Linéaire reçu:", calculatedLinear);
       toast.info(`Pré-remplissage pour Plinthes activé (${calculatedLinear} ml)`);
       setValue('surfaceImpactee', 'Aucune', { shouldValidate: true, shouldDirty: true });
       setValue('quantite', calculatedLinear, { shouldValidate: true, shouldDirty: true });
       setValue('unite', 'ml', { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedElementContext, travailAModifier, calculatedLinear, setValue]);
  // --- FIN EFFET PLINTHES ---

  // --- EFFET POUR METTRE À JOUR CHAMPS SELON SOUS-TYPE SÉLECTIONNÉ ---
  useEffect(() => {
    if (!selectedSousTypeId) return;
    if (selectedElementContext === 'plinthes' && !travailAModifier) return;

    let foundService: SousTypeTravauxItemReference | Service | null = null;

    for (const type of travauxTypesState.types) {
        if (type.sousTypes?.find(st => st.id === selectedSousTypeId)) {
            foundService = type.sousTypes.find(st => st.id === selectedSousTypeId) ?? null;
        } else if (type.serviceGroups) {
            for (const group of type.serviceGroups) {
                const service = group.services?.find(s => s.id === selectedSousTypeId);
                if (service) {
                    foundService = service;
                    break;
                }
            }
        }
      if (foundService) break;
    }

    if (foundService) {
      console.log("Service/Sous-type trouvé:", foundService.label);
      // Pré-remplir seulement en mode ajout, OU si le sous-type change explicitement
      const shouldPrefill = !travailAModifier || (travailAModifier && travailAModifier.sousTypeId !== selectedSousTypeId);

      if (shouldPrefill) {
          setValue('description', foundService.description || foundService.label, { shouldDirty: true });
          setValue('unite', foundService.unite, { shouldDirty: true });
          // Gérer les prix - Assurez-vous que ces propriétés existent sur votre type trouvé
          setValue('laborPrice', foundService.labor_price ?? foundService.prixUnitaire ?? 0, { shouldDirty: true });
          setValue('supplyPrice', foundService.supply_price ?? 0, { shouldDirty: true });
          setValue('tauxTVA', foundService.taux_tva ?? 0, { shouldDirty: true });
      }
      // Mettre à jour les labels dans tous les cas de sélection
      setValue('sousTypeLabel', foundService.label);
      const parentType = travauxTypesState.types.find(t =>
          t.id === foundService?.typeTravauxId ||
          t.serviceGroups?.some(g => g.id === foundService?.group_id)
      );
      setValue('typeTravauxLabel', parentType?.label || '');
    } else {
       console.log("Aucun service trouvé pour l'ID:", selectedSousTypeId);
    }

  // La dépendance à travailAModifier est retirée pour permettre la mise à jour si on change le sous-type en mode édition
  }, [selectedSousTypeId, travauxTypesState.types, setValue, selectedElementContext]);
  // --- FIN EFFET SOUS-TYPE ---

  // --- EFFETS RESET ---
  useEffect(() => {
    // Reset seulement si on n'est pas en train d'éditer le même travail
    if (!travailAModifier || (travailAModifier && travailAModifier.groupId !== selectedGroupId)) {
        setValue('sousTypeId', '');
    }
  }, [selectedGroupId, setValue, travailAModifier]);

  useEffect(() => {
     if (!travailAModifier || (travailAModifier && travailAModifier.typeTravauxId !== selectedTypeTravauxId)) {
       setValue('groupId', '');
       setValue('sousTypeId', '');
     }
  }, [selectedTypeTravauxId, setValue, travailAModifier]);
  // --- FIN EFFETS RESET ---

  // --- Fonction de Soumission ---
  function onSubmit(values: TravailFormValues) {
    console.log("Données du formulaire validées:", values);

    const finalTravailData: Omit<Travail, 'id'> & { id?: string } = {
        ...(travailAModifier ? { id: travailAModifier.id } : {}),
        pieceId: piece?.id ?? '',
        typeTravauxId: values.typeTravauxId,
        groupId: values.groupId, // Assurez-vous que ce champ est bien géré
        sousTypeId: values.sousTypeId,
        typeTravauxLabel: values.typeTravauxLabel || 'Type Inconnu',
        sousTypeLabel: values.sousTypeLabel || 'Prestation Inconnue',
        description: values.description,
        quantite: values.quantite,
        unite: values.unite,
        prixUnitaireHT: (values.laborPrice ?? 0) + (values.supplyPrice ?? 0),
        laborPrice: values.laborPrice ?? 0,
        supplyPrice: values.supplyPrice ?? 0,
        tauxTVA: values.tauxTVA ?? 0,
        surfaceImpactee: values.surfaceImpactee || 'Aucune',
    };

     if (!finalTravailData.pieceId) {
       toast.error("Erreur interne : Impossible d'associer le travail à une pièce.");
       return;
     }

    onAddTravail(finalTravailData as Travail | Omit<Travail, 'id'>);
  }
  // --- Fin onSubmit ---

  return (
    <Form {...form}>
      {formState.errors.root && (
         <div className="text-red-600 text-sm mb-4">{formState.errors.root.message}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Détails du Travail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sélecteurs Hiérarchiques */}
            <TypeTravauxSelect control={control} name="typeTravauxId" label="Type de travaux *" />
            <ServiceGroupSelect
              control={control}
              name="groupId"
              label="Groupe de services *"
              typeTravauxId={selectedTypeTravauxId}
            />
            <SousTypeSelect
              control={control}
              name="sousTypeId"
              label="Prestation *"
              typeTravauxId={selectedTypeTravauxId} // Peut être utile pour contexte
              groupId={selectedGroupId} // Requis pour filtrer
            />

            {/* Description */}
            <DescriptionSection control={control} name="description" label="Description *" />

             {/* Quantité & Unité */}
             <QuantitySection
                control={control}
                nameQuantite="quantite"
                nameUnite="unite"
                label="Quantité *"
             />

            {/* Prix */}
            <PriceSection
              control={control}
              nameLabor="laborPrice"
              nameSupply="supplyPrice"
              labelPrixMO="Prix Unit. MO (€ HT) *"
              labelPrixFourniture="Prix Unit. Fourniture (€ HT) *"
            />

             {/* TVA */}
             <TvaSelect control={control} name="tauxTVA" label="Taux de TVA (%) *" />

            {/* Surface Impactée */}
            <SurfaceImpacteeSelect
                control={control}
                name="surfaceImpactee"
                label="Surface Impactée"
            />

            {/* TODO: Ajouter conditionnellement MenuiserieTypeSelect */}

          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          {/* Le reset réinitialise aux defaultValues (qui sont basés sur travailAModifier si présent) */}
          <Button type="button" variant="outline" onClick={() => reset()}>
            Annuler les modifs
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Enregistrement...' : (travailAModifier ? 'Modifier Travail' : 'Ajouter Travail')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TravailForm;