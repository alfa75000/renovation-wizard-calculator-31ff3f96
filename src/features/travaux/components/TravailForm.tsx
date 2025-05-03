// src/features/travaux/components/TravailForm.tsx
// CORRIGÉ avec le bon hook pour le catalogue

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TypeTravauxSelect from "./TypeTravauxSelect";
import ServiceGroupSelect from "./ServiceGroupSelect";
import SousTypeSelect from "./SousTypeSelect";
import { Room, Travail, SurfaceImpactee, SousTypeTravauxItemReference } from "@/types"; // Ajout SousTypeTravauxItemReference si utilisé
import { Service, UniteType } from "@/types/supabase";
import DescriptionSection from "./DescriptionSection";
import QuantitySection from "./QuantitySection";
import PriceSection from "./PriceSection";
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

// *** BON IMPORT POUR LE CATALOGUE DES TRAVAUX ***
import { useTravauxTypes } from '@/contexts/TravauxTypesContext'; // Import depuis le contexte

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
  // *** UTILISATION DU BON HOOK POUR LE CATALOGUE ***
  const { state: travauxTypesState } = useTravauxTypes(); // Utilise le hook du contexte

  // --- États Locaux (inchangés) ---
  const [typeTravauxId, setTypeTravauxId] = useState<string>('');
  const [typeTravauxLabel, setTypeTravauxLabel] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  const [sousTypeId, setSousTypeId] = useState<string>('');
  const [sousTypeLabel, setSousTypeLabel] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [description, setDescription] = useState<string>('');
  const [quantite, setQuantite] = useState<number>(0);
  const [unite, setUnite] = useState<UniteType>("M²");
  const [prixFournitures, setPrixFournitures] = useState<number>(0);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(0);
  const [tauxTVA, setTauxTVA] = useState<number>(10);
  const [surfaceImpactee, setSurfaceImpactee] = useState<SurfaceImpactee>('Aucune');
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

   // --- Effet pour initialiser ou réinitialiser le formulaire (inchangé) ---
   useEffect(() => {
    if (travailAModifier) {
        console.log("Initialisation Formulaire (Mode Édition):", travailAModifier);
        setTypeTravauxId(travailAModifier.typeTravauxId || '');
        setTypeTravauxLabel(travailAModifier.typeTravauxLabel || '');
        setGroupId(travailAModifier.groupId || '');
        setSousTypeId(travailAModifier.sousTypeId || '');
        setSousTypeLabel(travailAModifier.sousTypeLabel || '');
        setDescription(travailAModifier.description || '');
        setQuantite(travailAModifier.quantite || 0);
        setUnite((travailAModifier.unite as UniteType) || 'M²');
        setPrixFournitures(travailAModifier.supplyPrice ?? travailAModifier.prixFournitures ?? 0);
        setPrixMainOeuvre(travailAModifier.laborPrice ?? travailAModifier.prixMainOeuvre ?? 0);
        setTauxTVA(travailAModifier.tauxTVA ?? 10);
        setSurfaceImpactee((travailAModifier.surfaceImpactee as SurfaceImpactee) || 'Aucune');
        setSelectedService(null);
        setInitialValues(null);
        setIsCustomSurface(false);
        setIsCustomUnite(false);
    } else {
        console.log("Initialisation Formulaire (Mode Ajout)");
        // Reset partiel en mode ajout
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
        // Les IDs type/groupe/sous-type sont gardés s'ils ont été sélectionnés
    }
  }, [travailAModifier]);


  // --- Effets pour réinitialiser les sélecteurs en cascade (Mode Ajout Uniquement) (inchangés) ---
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

  // --- Effet pour pré-remplir pour PLINTHES (Prioritaire) (inchangé) ---
  useEffect(() => {
    if (!travailAModifier && selectedElementContext === 'plinthes' && typeof calculatedLinear === 'number' && calculatedLinear > 0) {
       console.log("Effet PLINTHES : Pré-remplissage activé. Linéaire:", calculatedLinear);
       toast.info(`Pré-remplissage pour Plinthes activé (${calculatedLinear} ml)`);
       setSurfaceImpactee('Aucune');
       setQuantite(calculatedLinear);
       setUnite('ml');
       setIsCustomSurface(true);
       setIsCustomUnite(true);
       setInitialValues(null);
    }
  }, [selectedElementContext, travailAModifier, calculatedLinear]);

  // --- Effet pour pré-remplir selon le SERVICE sélectionné (Utilise le bon état travauxTypesState) ---
  useEffect(() => {
    // Vérifier si travauxTypesState et selectedService sont définis
    if (!selectedService || !travailAModifier && selectedElementContext === 'plinthes' || !travauxTypesState?.types) {
         // Si on déselectionne un service (selectedService devient null) OU
         // si on est en mode plinthe OU
         // si le catalogue n'est pas chargé,
         // on ne fait rien ou on reset les initialValues
         if(!selectedService) setInitialValues(null);
         return;
    }

    const isPlintheContextInAddMode = !travailAModifier && selectedElementContext === 'plinthes'; // Déjà géré au début de l'effet
    console.log(`Effet SERVICE: ${selectedService.name}. Contexte Plinthes (ajout)? ${isPlintheContextInAddMode}`);

    // Trouver le type parent (Logique inchangée mais utilise le bon état)
    const parentType = travauxTypesState.types.find(t =>
        t.id === selectedService.typeTravauxId || // Attention: Service n'a pas typeTravauxId directement
        t.serviceGroups?.some(g => g.id === selectedService.group_id) // Vérifier via group_id
    );
    // Mettre à jour les labels seulement si nécessaire
    if (parentType && parentType.label !== typeTravauxLabel) {
        setTypeTravauxLabel(parentType.label);
    }
    if (selectedService.name !== sousTypeLabel) {
        setSousTypeLabel(selectedService.name);
    }


    // Définir les valeurs initiales basées sur CE service
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

    // Mettre à jour les champs du formulaire, SAUF si plinthes en ajout
    // OU si on édite sans changer de sous-type
     const shouldUpdateNonForcedFields = !(isPlintheContextInAddMode) && (!travailAModifier || travailAModifier.sousTypeId !== selectedService.id);

     if (shouldUpdateNonForcedFields) {
         console.log("Effet SERVICE: Mise à jour de tous les champs");
         setDescription(serviceDesc);
         setPrixFournitures(selectedService.supply_price || 0);
         setPrixMainOeuvre(selectedService.labor_price || 0);
         setTauxTVA(selectedService.taux_tva ?? 10);
         setUnite(serviceUnit);
         setSurfaceImpactee(serviceSurface);
         setIsCustomUnite(false);
         setIsCustomSurface(false);

         // Calcul Quantité Initiale (logique inchangée)
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
         // Mettre à jour seulement description, prix, TVA car quantité/unité/surface sont forcés
         setDescription(serviceDesc);
         setPrixFournitures(selectedService.supply_price || 0);
         setPrixMainOeuvre(selectedService.labor_price || 0);
         setTauxTVA(selectedService.taux_tva ?? 10);
         setIsCustomUnite(true);
         setIsCustomSurface(true);
     } else {
         console.log("Effet SERVICE: Mode édition, sous-type identique, màj labels/initialValues seulement");
         // Ne rien faire d'autre, garder les valeurs modifiées par l'utilisateur
     }

  // Ajouter travauxTypesState.types aux dépendances car on le lit
  }, [selectedService, piece, travailAModifier, selectedElementContext, travauxTypesState?.types]);


  // --- Effet pour recalculer quantité si surface change MANUELLEMENT (inchangé) ---
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
        if (selectedElementContext !== 'plinthes') {
             setIsCustomSurface(false);
        }
    }
  }, [surfaceImpactee, piece, selectedService, initialValues, unite, selectedElementContext]);

   // --- Effet pour marquer unité comme custom (inchangé) ---
   useEffect(() => {
       if (initialValues && unite !== initialValues.unite && selectedElementContext !== 'plinthes') {
           setIsCustomUnite(true);
       } else if (initialValues && unite === initialValues.unite && selectedElementContext !== 'plinthes') {
           setIsCustomUnite(false);
       }
   }, [unite, initialValues, selectedElementContext]);


  // --- Détection des changements (inchangé) ---
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

  // --- Soumission du formulaire (inchangé) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeTravauxId || !groupId || !sousTypeId || !piece || !selectedService) {
      toast.error("Veuillez sélectionner Type, Groupe et Prestation.");
      return;
    }
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

  // --- Ajout/Modification effective (inchangé) ---
  const addOrUpdateTravail = () => {
    if (!typeTravauxId || !groupId || !sousTypeId || !piece) return;
    const travailData: Omit<Travail, 'id'> & { id?: string } = {
      ...(travailAModifier ? { id: travailAModifier.id } : {}),
      pieceId: piece.id,
      typeTravauxId, typeTravauxLabel,
      groupId, sousTypeId, sousTypeLabel,
      description, quantite, unite, prixFournitures, prixMainOeuvre, tauxTVA,
      prixUnitaireHT: (prixFournitures ?? 0) + (prixMainOeuvre ?? 0),
      surfaceImpactee: surfaceImpactee as SurfaceImpactee,
      commentaire: travailAModifier?.commentaire || "",
      laborPrice: prixMainOeuvre, supplyPrice: prixFournitures,
    };
    onAddTravail(travailData as Travail | Omit<Travail, 'id'>);
  };

  // --- Ouverture modale MàJ service (inchangé) ---
  const handleOpenUpdateModal = () => { /* ... */ };

  // --- Gestion retour modale MàJ service (inchangé) ---
  const handleServiceUpdate = async (updateType: 'update' | 'create', serviceData: Partial<Service>): Promise<Service | null> => { /* ... */ };


  // --- JSX (inchangé par rapport à votre version originale) ---
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
              // setSousTypeLabel(label); // Géré par effet
              setSelectedService(service); // Met à jour l'objet service
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
            setDescription={setDescription} // Passer le setter
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
            setQuantite={setQuantite} // Passer le setter
            unite={unite}
            setUnite={(value) => setUnite(value as UniteType)} // Passer le setter
            surfaceImpactee={surfaceImpactee}
            setSurfaceImpactee={(value) => setSurfaceImpactee(value as SurfaceImpactee)} // Passer le setter
            isCustomUnite={isCustomUnite}
            isCustomSurface={isCustomSurface}
          />

          {/* Price Section */}
          <PriceSection
            prixFournitures={prixFournitures}
            setPrixFournitures={setPrixFournitures} // Passer le setter
            prixMainOeuvre={prixMainOeuvre}
            setPrixMainOeuvre={setPrixMainOeuvre}   // Passer le setter
            tauxTVA={tauxTVA}
            setTauxTVA={setTauxTVA}             // Passer le setter
            unite={unite} // Peut être utile pour afficher €/unité
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
              addOrUpdateTravail();
            }}>
              Non, utiliser ces valeurs <br/>uniquement pour ce devis
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsConfirmDialogOpen(false);
              handleOpenUpdateModal();
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