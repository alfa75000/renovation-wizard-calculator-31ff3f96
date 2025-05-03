// src/features/travaux/components/TravailForm.tsx
// Version utilisant useState - CORRIGÉE AVEC useTravauxTypes

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TypeTravauxSelect from "./TypeTravauxSelect";
import ServiceGroupSelect from "./ServiceGroupSelect";
import SousTypeSelect from "./SousTypeSelect";
import { Room, Travail, SurfaceImpactee } from "@/types";
import { Service, UniteType } from "@/types/supabase"; // Assurez-vous que UniteType et Service sont corrects
import DescriptionSection from "./DescriptionSection";
import QuantitySection from "./QuantitySection";
import PriceSection from "./PriceSection";
// import { Label } from "@/components/ui/label"; // Label est utilisé dans les sous-composants normalement
import { RefreshCw } from "lucide-react";
import UpdateServiceModal from "./UpdateServiceModal";
import { updateService, cloneServiceWithChanges } from "@/services/travauxService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

// *** IMPORT MANQUANT AJOUTÉ ICI ***
import { useTravauxTypes } from '../hooks/useTravauxTypes';

interface TravailFormProps {
  piece: Room | null;
  onAddTravail: (travail: Omit<Travail, "id"> | Travail) => void;
  travailAModifier: Travail | null;
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
  // *** APPEL DU HOOK MANQUANT AJOUTÉ ICI ***
  const { state: travauxTypesState } = useTravauxTypes(); // Pour accéder au catalogue

  // --- États Locaux ---
  const [typeTravauxId, setTypeTravauxId] = useState<string>('');
  const [typeTravauxLabel, setTypeTravauxLabel] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  // const [groupLabel, setGroupLabel] = useState<string>(''); // Non stocké
  const [sousTypeId, setSousTypeId] = useState<string>('');
  const [sousTypeLabel, setSousTypeLabel] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [description, setDescription] = useState<string>('');
  const [quantite, setQuantite] = useState<number>(0);
  const [unite, setUnite] = useState<UniteType>("M²"); // Assurer que 'M²' est valide dans UniteType
  const [prixFournitures, setPrixFournitures] = useState<number>(0);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(0);
  const [tauxTVA, setTauxTVA] = useState<number>(10);
  const [surfaceImpactee, setSurfaceImpactee] = useState<SurfaceImpactee>('Aucune'); // Assurer que 'Aucune' est valide
  const [isCustomUnite, setIsCustomUnite] = useState<boolean>(false);
  const [isCustomSurface, setIsCustomSurface] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{
    description: string;
    surfaceImpactee: SurfaceImpactee;
    unite: UniteType;
    prixFournitures: number;
    prixMainOeuvre: number;
  } | null>(null);

   // --- Effet pour initialiser ou réinitialiser le formulaire ---
   useEffect(() => {
    if (travailAModifier) {
        // Mode édition
        console.log("Initialisation Formulaire (Mode Édition):", travailAModifier);
        setTypeTravauxId(travailAModifier.typeTravauxId || '');
        setTypeTravauxLabel(travailAModifier.typeTravauxLabel || '');
        // Assurez-vous que groupId est bien dans votre type Travail
        setGroupId(travailAModifier.groupId || '');
        setSousTypeId(travailAModifier.sousTypeId || '');
        setSousTypeLabel(travailAModifier.sousTypeLabel || '');
        setDescription(travailAModifier.description || '');
        setQuantite(travailAModifier.quantite || 0);
        setUnite((travailAModifier.unite as UniteType) || 'M²');
        setPrixFournitures(travailAModifier.supplyPrice ?? travailAModifier.prixFournitures ?? 0);
        setPrixMainOeuvre(travailAModifier.laborPrice ?? travailAModifier.prixMainOeuvre ?? 0);
        setTauxTVA(travailAModifier.tauxTVA ?? 10); // Utiliser ?? pour gérer null/undefined
        setSurfaceImpactee((travailAModifier.surfaceImpactee as SurfaceImpactee) || 'Aucune');
        setSelectedService(null);
        setInitialValues(null);
        // Pour l'édition, on considère initialement que les valeurs sont celles de référence
        // La détection de changement se fera si l'utilisateur modifie *après* le chargement.
        setIsCustomSurface(false);
        setIsCustomUnite(false);
    } else {
        // Mode ajout : reset
        console.log("Initialisation Formulaire (Mode Ajout)");
        // Ne pas réinitialiser type/groupe/soustype s'ils viennent d'être sélectionnés
        // setTypeTravauxId(''); // Gardé
        // setTypeTravauxLabel(''); // Gardé
        // setGroupId(''); // Gardé
        // setSousTypeId(''); // Gardé
        setDescription('');
        setQuantite(0);
        setUnite('M²');
        setPrixFournitures(0);
        setPrixMainOeuvre(0);
        setTauxTVA(10);
        setSurfaceImpactee('Aucune');
        setSousTypeLabel('');
        setSelectedService(null);
        setInitialValues(null);
        setIsCustomSurface(false);
        setIsCustomUnite(false);
    }
  // Dépendance sur travailAModifier pour basculer entre ajout/édition
  }, [travailAModifier]);


  // --- Effets pour réinitialiser les sélecteurs en cascade (Mode Ajout Uniquement) ---
  useEffect(() => {
    if (!travailAModifier) {
        setGroupId("");
        setSousTypeId("");
        setSelectedService(null);
        setInitialValues(null);
    }
  }, [typeTravauxId, travailAModifier]);

  useEffect(() => {
    if (!travailAModifier) {
        setSousTypeId("");
        setSelectedService(null);
        setInitialValues(null);
    }
  }, [groupId, travailAModifier]);

  // --- Effet pour pré-remplir pour PLINTHES (Prioritaire) ---
  useEffect(() => {
    if (!travailAModifier && selectedElementContext === 'plinthes' && typeof calculatedLinear === 'number' && calculatedLinear > 0) {
       console.log("Effet PLINTHES : Pré-remplissage activé. Linéaire:", calculatedLinear);
       toast.info(`Pré-remplissage pour Plinthes activé (${calculatedLinear} ml)`);
       setSurfaceImpactee('Aucune');
       setQuantite(calculatedLinear);
       setUnite('ml');
       setIsCustomSurface(true);
       setIsCustomUnite(true);
       setInitialValues(null); // Pas de référence service pour plinthes ici
       // Vous pourriez vouloir sélectionner un service "Pose Plinthes" ici si pertinent
    }
  }, [selectedElementContext, travailAModifier, calculatedLinear]); // Dépendances correctes

  // --- Effet pour pré-remplir selon le SERVICE sélectionné ---
  useEffect(() => {
    // S'assurer que travauxTypesState est chargé et contient des types
    if (!selectedService || !travauxTypesState?.types) {
        setInitialValues(null);
        return;
    };

    const isPlintheContextInAddMode = !travailAModifier && selectedElementContext === 'plinthes';
    console.log(`Effet SERVICE: ${selectedService.name}. Contexte Plinthes (ajout)? ${isPlintheContextInAddMode}`);

    // Trouver le type parent (vérifier la structure exacte de vos types)
     const parentType = travauxTypesState.types.find(t =>
        t.id === selectedService.typeTravauxId || // Si service direct
        t.serviceGroups?.some(g => g.id === selectedService.group_id) // Si service dans groupe
     );
    setTypeTravauxLabel(parentType?.label || typeTravauxLabel || ''); // Garder label si déjà défini
    setSousTypeLabel(selectedService.name || sousTypeLabel || ''); // Garder label si déjà défini

    // Mémoriser les valeurs initiales de ce service
    const serviceUnit = (selectedService.unite as UniteType) || "M²";
    const serviceSurface = (selectedService.surface_impactee as SurfaceImpactee) || 'Aucune';
    const serviceDesc = selectedService.description || selectedService.name || "";
    const initialDataFromService = {
        description: serviceDesc,
        surfaceImpactee: serviceSurface,
        unite: serviceUnit,
        prixFournitures: selectedService.supply_price || 0,
        prixMainOeuvre: selectedService.labor_price || 0,
    };
    setInitialValues(initialDataFromService);
    console.log("Effet SERVICE: InitialValues mis à jour:", initialDataFromService);

    // Mettre à jour les champs, SAUF si contexte plinthes en ajout
    // Ou si on est en édition et que le sous-type n'a pas changé (pour garder modifs user)
    const shouldUpdateNonForcedFields = !(isPlintheContextInAddMode) && (!travailAModifier || travailAModifier.sousTypeId !== selectedService.id);

     if (shouldUpdateNonForcedFields) {
         console.log("Effet SERVICE: Mise à jour de tous les champs");
         setDescription(serviceDesc);
         setPrixFournitures(selectedService.supply_price || 0);
         setPrixMainOeuvre(selectedService.labor_price || 0);
         setTauxTVA(selectedService.taux_tva ?? 10); // Utiliser ??
         setUnite(serviceUnit);
         setSurfaceImpactee(serviceSurface);
         setIsCustomUnite(false);
         setIsCustomSurface(false);

         // Calcul Quantité Initiale
         if (piece) {
             let quantiteInitiale = 1;
             switch (serviceSurface) {
                 case 'Mur': quantiteInitiale = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0; break;
                 case 'Plafond': quantiteInitiale = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0; break;
                 case 'Sol': quantiteInitiale = piece.surfaceNetteSol || piece.surfaceBruteSol || 0; break;
             }
              if (serviceUnit !== 'M²' && serviceUnit !== 'ml' || serviceSurface === 'Aucune') {
                 quantiteInitiale = 1;
             }
             setQuantite(parseFloat(quantiteInitiale.toFixed(2)));
         } else {
             setQuantite(1);
         }
     } else if (isPlintheContextInAddMode) {
         console.log("Effet SERVICE: Quantité/Unité/Surface NON mis à jour (contexte plinthes)");
         // On garde les valeurs forcées par l'effet plinthe, mais on met à jour le reste
         setDescription(serviceDesc);
         setPrixFournitures(selectedService.supply_price || 0);
         setPrixMainOeuvre(selectedService.labor_price || 0);
         setTauxTVA(selectedService.taux_tva ?? 10);
         // Les flags custom sont déjà true à cause de l'effet plinthe
     } else {
         // Mode édition sans changement de sous-type: on ne met à jour que les labels et initialValues
         console.log("Effet SERVICE: Mode édition, sous-type identique, màj labels/initialValues seulement");
         // Les valeurs description, prix, etc., restent celles modifiées par l'utilisateur ou chargées initialement
     }


  }, [selectedService, piece, travailAModifier, selectedElementContext, travauxTypesState.types]); // Ajout de travauxTypesState.types

  // Effet pour recalculer la quantité si SEULEMENT la surface impactée change MANUELLEMENT
  useEffect(() => {
    if (piece && selectedService && initialValues && surfaceImpactee !== initialValues.surfaceImpactee && selectedElementContext !== 'plinthes') {
        console.log("Effet SURFACE CHANGEE: Recalcul quantité pour surface", surfaceImpactee);
        let quantiteAjustee = 1;
        switch (surfaceImpactee) {
            case 'Mur': quantiteAjustee = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0; break;
            case 'Plafond': quantiteAjustee = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0; break;
            case 'Sol': quantiteAjustee = piece.surfaceNetteSol || piece.surfaceBruteSol || 0; break;
        }
         if (unite !== 'M²' && unite !== 'ml' || surfaceImpactee === 'Aucune') {
            quantiteAjustee = 1;
        }
        setQuantite(parseFloat(quantiteAjustee.toFixed(2)));
        setIsCustomSurface(true);
    } else if (initialValues && surfaceImpactee === initialValues.surfaceImpactee) {
        if (selectedElementContext !== 'plinthes') { // Ne pas remettre à false si on est sur plinthes
             setIsCustomSurface(false);
        }
    }
  }, [surfaceImpactee, piece, selectedService, initialValues, unite, selectedElementContext]);

   // Effet pour marquer l'unité comme custom si elle diffère de l'initiale
   useEffect(() => {
       if (initialValues && unite !== initialValues.unite && selectedElementContext !== 'plinthes') {
           setIsCustomUnite(true);
       } else if (initialValues && unite === initialValues.unite && selectedElementContext !== 'plinthes') {
           setIsCustomUnite(false);
       }
   }, [unite, initialValues, selectedElementContext]);


  // --- Détection des changements ---
  const hasChanges = useMemo(() => {
    if (!initialValues || !selectedService) return false;
    if (!travailAModifier && selectedElementContext === 'plinthes') return false;

    const descChanged = description !== initialValues.description;
    const surfaceChanged = surfaceImpactee !== initialValues.surfaceImpactee;
    const uniteChanged = unite !== initialValues.unite;
    const prixFChanged = prixFournitures !== initialValues.prixFournitures;
    const prixMOChanged = prixMainOeuvre !== initialValues.prixMainOeuvre;

    return descChanged || surfaceChanged || uniteChanged || prixFChanged || prixMOChanged;
  }, [
    initialValues, selectedService, description, surfaceImpactee, unite,
    prixFournitures, prixMainOeuvre, travailAModifier, selectedElementContext
  ]);

  // --- Soumission du formulaire ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeTravauxId || !groupId || !sousTypeId || !piece || !selectedService) {
      toast.error("Veuillez sélectionner Type, Groupe et Prestation.");
      return;
    }
    // Vérifier quantité et prix (validation de base, Zod ferait mieux)
    if (quantite <= 0) {
      toast.error("La quantité doit être supérieure à 0.");
      return;
    }
     if (prixFournitures < 0 || prixMainOeuvre < 0) {
      toast.error("Les prix ne peuvent pas être négatifs.");
      return;
    }


    if (hasChanges && !travailAModifier && selectedElementContext !== 'plinthes') {
      setIsConfirmDialogOpen(true);
    } else {
      addOrUpdateTravail();
    }
  };

  // --- Ajout/Modification effective ---
  const addOrUpdateTravail = () => {
    if (!typeTravauxId || !groupId || !sousTypeId || !piece) return;

    const travailData: Omit<Travail, 'id'> & { id?: string } = {
      ...(travailAModifier ? { id: travailAModifier.id } : {}),
      pieceId: piece.id,
      typeTravauxId,
      typeTravauxLabel,
      groupId,
      sousTypeId,
      sousTypeLabel,
      description,
      quantite,
      unite,
      prixFournitures,
      prixMainOeuvre,
      tauxTVA,
      prixUnitaireHT: (prixFournitures ?? 0) + (prixMainOeuvre ?? 0),
      surfaceImpactee: surfaceImpactee as SurfaceImpactee,
      commentaire: travailAModifier?.commentaire || "",
      laborPrice: prixMainOeuvre, // Assurez-vous que ces champs existent dans Travail
      supplyPrice: prixFournitures, // Assurez-vous que ces champs existent dans Travail
    };

    onAddTravail(travailData as Travail | Omit<Travail, 'id'>);
  };


  // --- Ouverture modale MàJ service ---
  const handleOpenUpdateModal = () => {
    if (!selectedService) {
      toast.error("Veuillez sélectionner une prestation pour la mettre à jour.");
      return;
    }
    setIsUpdateModalOpen(true);
  };

  // --- Gestion retour modale MàJ service ---
   const handleServiceUpdate = async (updateType: 'update' | 'create', serviceData: Partial<Service>): Promise<Service | null> => {
    if (!selectedService) return null;
    try {
        let updatedOrNewService: Service | null = null;
        if (updateType === 'update') {
            updatedOrNewService = await updateService(selectedService.id, serviceData);
            if (updatedOrNewService) {
                toast.success("Prestation de référence mise à jour.");
                setSelectedService(updatedOrNewService);
                // Les champs du formulaire seront mis à jour par l'effet sur selectedService
            }
        } else {
            updatedOrNewService = await cloneServiceWithChanges(selectedService.id, serviceData);
            if (updatedOrNewService) {
                toast.success("Nouvelle prestation de référence créée.");
                // Changer la sélection pour pointer vers le nouveau service
                setSousTypeId(updatedOrNewService.id);
                // L'effet sur selectedService (déclenché par setSousTypeId via SousTypeSelect)
                // mettra à jour le reste du formulaire et setSelectedService
            }
        }
        setIsUpdateModalOpen(false);
        // Ajouter le travail automatiquement APRÈS la mise à jour/création de la référence
        if (updatedOrNewService) {
             addOrUpdateTravail();
        }
        return updatedOrNewService;
    } catch (error) {
        console.error("Erreur lors de la mise à jour/création du service:", error);
        toast.error("Erreur lors de la mise à jour de la prestation de référence.");
        setIsUpdateModalOpen(false);
        return null;
    }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type de Travaux Select */}
      <div>
        <label htmlFor="type-travaux-select" className="block text-sm font-medium mb-1 text-gray-700">Type de travaux *</label>
        <TypeTravauxSelect
          value={typeTravauxId}
          onChange={(id, label) => {
            setTypeTravauxId(id);
            setTypeTravauxLabel(label);
          }}
        />
      </div>

      {/* Groupe de Services Select (conditionnel) */}
      {typeTravauxId && (
        <div>
          <label htmlFor="groupe-service-select" className="block text-sm font-medium mb-1 text-gray-700">Groupe de services *</label>
          <ServiceGroupSelect
            workTypeId={typeTravauxId}
            value={groupId}
            onChange={(id, label) => {
              setGroupId(id);
              // setGroupLabel(label);
            }}
          />
        </div>
      )}

      {/* Prestation (Sous-Type) Select (conditionnel) */}
      {groupId && (
        <div>
          <label htmlFor="sous-type-select" className="block text-sm font-medium mb-1 text-gray-700">Prestation *</label>
          <SousTypeSelect
            groupId={groupId}
            value={sousTypeId}
            onChange={(id, label, service) => {
              setSousTypeId(id);
              // setSousTypeLabel(label); // Géré par l'effet sur selectedService
              setSelectedService(service);
            }}
          />
        </div>
      )}

      {/* Afficher le reste seulement si une prestation est sélectionnée */}
      {sousTypeId && selectedService && (
        <>
          {/* Description Section */}
          <DescriptionSection
            description={description}
            setDescription={setDescription}
          />

          {/* Bouton Mise à Jour Base de Données (conditionnel) */}
          {selectedElementContext !== 'plinthes' && (
              <div className="mt-1 mb-3">
                <Button
                  type="button"
                  variant={hasChanges ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleOpenUpdateModal}
                  className={`flex items-center gap-1 text-xs w-full ${hasChanges ? "hover:bg-destructive/90" : ""}`}
                  title={hasChanges ? "Valeurs modifiées par rapport à la référence. Mettre à jour/Cloner la référence ?" : "Modifier la prestation de référence"}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {hasChanges ? "Gérer la prestation de référence..." : "Modifier la prestation de référence..."}
                </Button>
              </div>
           )}


          {/* Quantité Section */}
          <QuantitySection
            quantite={quantite}
            setQuantite={setQuantite}
            unite={unite}
            setUnite={(value) => setUnite(value as UniteType)}
            surfaceImpactee={surfaceImpactee}
            setSurfaceImpactee={(value) => setSurfaceImpactee(value as SurfaceImpactee)}
            isCustomUnite={isCustomUnite}
            isCustomSurface={isCustomSurface}
          />

          {/* Price Section */}
          <PriceSection
            prixFournitures={prixFournitures}
            setPrixFournitures={setPrixFournitures}
            prixMainOeuvre={prixMainOeuvre}
            setPrixMainOeuvre={setPrixMainOeuvre}
            tauxTVA={tauxTVA}
            setTauxTVA={setTauxTVA}
            unite={unite}
          />
        </>
      )}

      {/* Bouton de soumission principal */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={!typeTravauxId || !groupId || !sousTypeId || !piece || !selectedService}
          className="w-full"
        >
          {travailAModifier ? "Modifier le travail" : "Ajouter le travail"}
        </Button>
      </div>

      {/* Dialogue de Confirmation pour les changements */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifications détectées</AlertDialogTitle>
            <AlertDialogDescription>
              Les détails saisis diffèrent de la prestation de référence. Voulez-vous mettre à jour/cloner la référence avant d'ajouter ce travail ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsConfirmDialogOpen(false);
              addOrUpdateTravail(); // Ajouter avec les valeurs modifiées SANS toucher la réf
            }}>
              Non, utiliser ces valeurs <br/>uniquement pour ce devis
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsConfirmDialogOpen(false);
              handleOpenUpdateModal(); // Ouvrir la modale pour gérer la référence
            }}>
              Oui, gérer la référence...
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale de Mise à Jour du Service */}
      {isUpdateModalOpen && selectedService && (
        <UpdateServiceModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          currentService={selectedService}
          // Passer les valeurs ACTUELLES du formulaire
          updatedService={{
            description: description,
            labor_price: prixMainOeuvre,
            supply_price: prixFournitures,
            unite: unite,
            surface_impactee: surfaceImpactee
          }}
          onConfirmUpdate={handleServiceUpdate}
        />
      )}
    </form>
  );
};

export default TravailForm;