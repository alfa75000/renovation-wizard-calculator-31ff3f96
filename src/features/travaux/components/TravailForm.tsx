// src/features/travaux/components/TravailForm.tsx
// Version utilisant useState pour chaque champ - CORRIGÉE pour la logique Plinthes

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TypeTravauxSelect from "./TypeTravauxSelect";
import ServiceGroupSelect from "./ServiceGroupSelect";
import SousTypeSelect from "./SousTypeSelect";
import { Room, Travail, SurfaceImpactee } from "@/types";
import { Service, UniteType } from "@/types/supabase"; // Assurez-vous que UniteType et Service sont correctement définis
import DescriptionSection from "./DescriptionSection";
import QuantitySection from "./QuantitySection";
import PriceSection from "./PriceSection";
import { Label } from "@/components/ui/label"; // Utilisé ? Probablement pas directement ici
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

interface TravailFormProps {
  piece: Room | null;
  onAddTravail: (travail: Omit<Travail, "id"> | Travail) => void; // Accepte aussi Travail pour la modif
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
  // --- États Locaux ---
  const [typeTravauxId, setTypeTravauxId] = useState<string>('');
  const [typeTravauxLabel, setTypeTravauxLabel] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  // const [groupLabel, setGroupLabel] = useState<string>(''); // Pas stocké dans Travail a priori
  const [sousTypeId, setSousTypeId] = useState<string>('');
  const [sousTypeLabel, setSousTypeLabel] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [description, setDescription] = useState<string>('');
  const [quantite, setQuantite] = useState<number>(0);
  // Assurez-vous que UniteType inclut 'ml'
  const [unite, setUnite] = useState<UniteType>("M²");
  const [prixFournitures, setPrixFournitures] = useState<number>(0);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(0);
  const [tauxTVA, setTauxTVA] = useState<number>(10); // Défaut 10%
  // Assurez-vous que SurfaceImpactee inclut 'Aucune'
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

   // --- Effet pour initialiser ou réinitialiser le formulaire ---
   useEffect(() => {
    if (travailAModifier) {
        // Mode édition : charger les données du travail à modifier
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
        setTauxTVA(travailAModifier.tauxTVA || 10);
        setSurfaceImpactee((travailAModifier.surfaceImpactee as SurfaceImpactee) || 'Aucune');
        setSelectedService(null); // Le service sera trouvé par l'effet sur sousTypeId si nécessaire
        setInitialValues(null); // Reset des valeurs initiales
        setIsCustomSurface(false); // A réévaluer si on veut détecter les modifs en édition
        setIsCustomUnite(false);
    } else {
        // Mode ajout : réinitialiser la plupart des champs
        // Garder typeTravauxId, groupId, sousTypeId car ils peuvent être sélectionnés avant l'effet plinthe
        setDescription('');
        setQuantite(0);
        setUnite('M²');
        setPrixFournitures(0);
        setPrixMainOeuvre(0);
        setTauxTVA(10);
        setSurfaceImpactee('Aucune');
        setSousTypeLabel('');
        // Ne pas réinitialiser typeTravauxLabel ici
        setSelectedService(null);
        setInitialValues(null);
        setIsCustomSurface(false);
        setIsCustomUnite(false);
    }
  }, [travailAModifier]); // Se déclenche quand on passe du mode ajout à édition ou vice-versa


  // --- Effet pour réinitialiser groupe/sous-type quand type change (seulement en mode ajout) ---
  useEffect(() => {
    if (!travailAModifier) { // Ne s'applique qu'en mode ajout
        setGroupId("");
        // setGroupLabel(""); // Pas d'état pour ça
        setSousTypeId("");
        setSousTypeLabel("");
        setSelectedService(null);
        setInitialValues(null);
    }
  }, [typeTravauxId, travailAModifier]); // S'exécute quand typeTravauxId change

  // --- Effet pour réinitialiser sous-type quand groupe change (seulement en mode ajout) ---
  useEffect(() => {
    if (!travailAModifier) { // Ne s'applique qu'en mode ajout
        setSousTypeId("");
        setSousTypeLabel("");
        setSelectedService(null);
        setInitialValues(null);
    }
  }, [groupId, travailAModifier]); // S'exécute quand groupId change

  // --- Effet pour pré-remplir pour PLINTHES (Prioritaire) ---
  useEffect(() => {
    // S'applique seulement en mode AJOUT si l'élément est 'plinthes' et qu'on a un linéaire
    if (!travailAModifier && selectedElementContext === 'plinthes' && typeof calculatedLinear === 'number' && calculatedLinear > 0) {
       console.log("Effet PLINTHES : Pré-remplissage activé. Linéaire:", calculatedLinear);
       toast.info(`Pré-remplissage pour Plinthes activé (${calculatedLinear} ml)`);

       // Forcer les valeurs spécifiques aux plinthes
       setSurfaceImpactee('Aucune');
       setQuantite(calculatedLinear);
       setUnite('ml'); // *** Assurez-vous que 'ml' est une valeur valide pour UniteType ***

       // Marquer comme custom car on force ces valeurs
       setIsCustomSurface(true);
       setIsCustomUnite(true);

       // Reset initialValues pour que hasChanges soit false initialement pour les plinthes
       // (car on ne compare pas à un service de référence pour les plinthes ici)
       setInitialValues(null);

       // Optionnel: Forcer la sélection d'un type/groupe/sous-type "Plinthes"
       // findAndSetPlintheService(); // Implémenter cette fonction si nécessaire
    }
  }, [selectedElementContext, travailAModifier, calculatedLinear]); // S'exécute si contexte ou linéaire change

  // --- Effet pour pré-remplir selon le SERVICE sélectionné (sauf si contexte plinthes) ---
  useEffect(() => {
    // 1. Ne rien faire si aucun service n'est sélectionné
    if (!selectedService) {
        setInitialValues(null); // Reset des valeurs de référence si le service est déselectionné
        return;
    };

    // 2. Ne PAS écraser quantité/unité/surface si on est dans le contexte PLINTHES en mode ajout
    const isPlintheContextInAddMode = !travailAModifier && selectedElementContext === 'plinthes';

    console.log(`Effet SERVICE: ${selectedService.label}. Contexte Plinthes (ajout)? ${isPlintheContextInAddMode}`);

    // 3. Trouver le type parent pour le label
    const parentType = travauxTypesState.types.find(t =>
        t.id === selectedService.typeTravauxId ||
        t.serviceGroups?.some(g => g.id === selectedService.group_id)
    );
    setTypeTravauxLabel(parentType?.label || ''); // Mettre à jour le label du type
    setSousTypeLabel(selectedService.name); // Mettre à jour le label du sous-type

    // 4. Définir les valeurs initiales basées sur CE service pour comparaison future
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
    setInitialValues(initialDataFromService); // Mémoriser les valeurs du service
    console.log("Effet SERVICE: InitialValues mis à jour:", initialDataFromService);

    // 5. Mettre à jour les champs du formulaire, SAUF ceux gérés par plinthes si applicable
    setDescription(serviceDesc);
    setPrixFournitures(selectedService.supply_price || 0);
    setPrixMainOeuvre(selectedService.labor_price || 0);
    setTauxTVA(selectedService.taux_tva || 10);

    if (!isPlintheContextInAddMode) {
        console.log("Effet SERVICE: Mise à jour Quantité/Unité/Surface");
        setUnite(serviceUnit);
        setSurfaceImpactee(serviceSurface);

        // Calculer la quantité initiale basée sur la surface impactée du service
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
        // Puisque l'on vient de mettre les valeurs du service, ce n'est pas custom
        setIsCustomUnite(false);
        setIsCustomSurface(false);

    } else {
       console.log("Effet SERVICE: Quantité/Unité/Surface NON mis à jour (contexte plinthes)");
       // On garde les valeurs forcées par l'effet plinthe
       setIsCustomUnite(true); // C'est custom par rapport au service sélectionné
       setIsCustomSurface(true);
    }

  // Dépendances : service sélectionné, pièce (pour calcul quantité), mode édition
  }, [selectedService, piece, travailAModifier, selectedElementContext]); // Ajouter toutes les dépendances lues

  // Effet pour recalculer la quantité si SEULEMENT la surface impactée change MANUELLEMENT
  // (et qu'on n'est pas en contexte plinthes qui force déjà la quantité)
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
        // Si on revient à la valeur initiale du service, ce n'est plus custom
        // Sauf si on est toujours en contexte plinthe qui est par définition custom par rapport au service
        if (selectedElementContext !== 'plinthes') {
             setIsCustomSurface(false);
        }
    }
  }, [surfaceImpactee, piece, selectedService, initialValues, unite, selectedElementContext]); // Ajouter selectedElementContext

   // Effet pour marquer l'unité comme custom si elle diffère de l'initiale
   useEffect(() => {
        // Sauf si on est en contexte plinthe qui force 'ml'
       if (initialValues && unite !== initialValues.unite && selectedElementContext !== 'plinthes') {
           setIsCustomUnite(true);
       } else if (initialValues && unite === initialValues.unite && selectedElementContext !== 'plinthes') {
           setIsCustomUnite(false);
       }
   }, [unite, initialValues, selectedElementContext]);


  // --- Détection des changements ---
  const hasChanges = useMemo(() => {
    if (!initialValues || !selectedService) return false; // Pas de changement si pas de référence
    // Ne pas considérer comme un changement si on est en contexte plinthe (valeurs forcées)
    if (!travailAModifier && selectedElementContext === 'plinthes') return false;

    // Comparer les valeurs actuelles aux valeurs initiales DU SERVICE sélectionné
    const descChanged = description !== initialValues.description;
    const surfaceChanged = surfaceImpactee !== initialValues.surfaceImpactee;
    const uniteChanged = unite !== initialValues.unite;
    const prixFChanged = prixFournitures !== initialValues.prixFournitures;
    const prixMOChanged = prixMainOeuvre !== initialValues.prixMainOeuvre;

    const changed = descChanged || surfaceChanged || uniteChanged || prixFChanged || prixMOChanged;
    // console.log("hasChanges:", changed, {descChanged, surfaceChanged, uniteChanged, prixFChanged, prixMOChanged});
    return changed;
  }, [
    initialValues, selectedService, description, surfaceImpactee, unite,
    prixFournitures, prixMainOeuvre, travailAModifier, selectedElementContext
  ]);

  // --- Soumission du formulaire ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeTravauxId || !groupId || !sousTypeId || !piece) {
      toast.error("Veuillez sélectionner Type, Groupe et Prestation.");
      console.error("Données manquantes:", { typeTravauxId, groupId, sousTypeId, piece });
      return;
    }

    // Si ajout et changements détectés par rapport au service -> Confirmer
    if (hasChanges && !travailAModifier) {
      console.log("Changements détectés, ouverture confirmation...");
      setIsConfirmDialogOpen(true);
    } else {
      // Sinon (pas de modifs ou mode édition), ajouter/modifier directement
      console.log("Pas de changements détectés ou mode édition, ajout/modif direct.");
      addOrUpdateTravail();
    }
  };

  // --- Ajout/Modification effective ---
  const addOrUpdateTravail = () => {
    if (!typeTravauxId || !groupId || !sousTypeId || !piece) return;

    // Utiliser les états locaux actuels pour construire l'objet
    const travailData: Omit<Travail, 'id'> & { id?: string } = {
      ...(travailAModifier ? { id: travailAModifier.id } : {}),
      pieceId: piece.id,
      typeTravauxId,
      typeTravauxLabel,
      groupId, // Assurez-vous que groupId est bien dans votre type Travail si nécessaire
      sousTypeId,
      sousTypeLabel,
      description,
      quantite,
      unite,
      prixFournitures,
      prixMainOeuvre,
      tauxTVA,
      prixUnitaireHT: (prixFournitures ?? 0) + (prixMainOeuvre ?? 0), // Recalculer
      surfaceImpactee: surfaceImpactee as SurfaceImpactee,
      commentaire: travailAModifier?.commentaire || "",
      // S'assurer que laborPrice et supplyPrice sont inclus si votre type Travail final les utilise
      laborPrice: prixMainOeuvre,
      supplyPrice: prixFournitures,
    };

    onAddTravail(travailData as Travail | Omit<Travail, 'id'>); // Appeler la prop du parent
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
                setSelectedService(updatedOrNewService); // Mettre à jour l'état local service
                 // L'effet sur selectedService va normalement réappliquer les valeurs
            }
        } else {
            updatedOrNewService = await cloneServiceWithChanges(selectedService.id, serviceData);
            if (updatedOrNewService) {
                toast.success("Nouvelle prestation de référence créée.");
                // Mettre à jour les sélections pour pointer vers le nouveau service
                setSousTypeId(updatedOrNewService.id); // Ceci déclenchera l'effet sur selectedService
                setSousTypeLabel(updatedOrNewService.name);
                // Inutile de faire setSelectedService ici, l'effet s'en chargera
            }
        }
        setIsUpdateModalOpen(false);
        // Après la mise à jour de la référence, on considère que les changements sont appliqués
        // On peut donc ajouter le travail directement sans re-confirmer
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
        {/* Utiliser un Label standard si FormField n'est pas utilisé */}
        <label htmlFor="type-travaux-select" className="block text-sm font-medium mb-1">Type de travaux *</label>
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
          <label htmlFor="groupe-service-select" className="block text-sm font-medium mb-1">Groupe de services *</label>
          <ServiceGroupSelect
            workTypeId={typeTravauxId}
            value={groupId}
            onChange={(id, label) => { // Récupérer le label si nécessaire pour l'UI
              setGroupId(id);
              // setGroupLabel(label); // Si vous avez un état pour ça
            }}
          />
        </div>
      )}

      {/* Prestation (Sous-Type) Select (conditionnel) */}
      {groupId && (
        <div>
          <label htmlFor="sous-type-select" className="block text-sm font-medium mb-1">Prestation *</label>
          <SousTypeSelect
            groupId={groupId}
            value={sousTypeId}
            onChange={(id, label, service) => {
              setSousTypeId(id);
              setSousTypeLabel(label);
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

          {/* Bouton Mise à Jour Base de Données */}
           {/* Conditionner l'affichage du bouton si on n'est pas en mode plinthe ? */}
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
            // name: sousTypeLabel, // Le nom n'est généralement pas modifié ici
            description: description,
            labor_price: prixMainOeuvre,
            supply_price: prixFournitures,
            unite: unite, // Assurez-vous que les noms correspondent DB vs Type
            surface_impactee: surfaceImpactee
          }}
          onConfirmUpdate={handleServiceUpdate} // Appelle la fonction qui gère update/clone
        />
      )}
    </form>
  );
};

export default TravailForm;