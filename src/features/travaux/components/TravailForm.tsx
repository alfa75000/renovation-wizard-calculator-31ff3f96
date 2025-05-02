// src/features/travaux/components/TravailForm.tsx
// Version ORIGINALE utilisant useState pour chaque champ

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TypeTravauxSelect from "./TypeTravauxSelect"; // Suppose que ces composants acceptent value/onChange
import ServiceGroupSelect from "./ServiceGroupSelect"; // Suppose que ces composants acceptent value/onChange
import SousTypeSelect from "./SousTypeSelect";       // Suppose que ce composant accepte value/onChange et passe le service complet
import { Room, Travail, SurfaceImpactee } from "@/types";
import { Service, UniteType } from "@/types/supabase"; // Assurez-vous que ces types sont corrects
import DescriptionSection from "./DescriptionSection"; // Suppose qu'il prend description/setDescription
import QuantitySection from "./QuantitySection";       // Suppose qu'il prend quantite/setQuantite, unite/setUnite etc.
import PriceSection from "./PriceSection";           // Suppose qu'il prend les états de prix/TVA et leurs setters
import { Label } from "@/components/ui/label";       // Utilisé ? Vérifier si besoin
import { RefreshCw } from "lucide-react";
import UpdateServiceModal from "./UpdateServiceModal";
// Assurez-vous que ces fonctions de service existent et ont la bonne signature
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
  piece: Room | null; // Accepte null si aucune pièce sélectionnée
  onAddTravail: (travail: Omit<Travail, "id">) => void; // La logique parent gère l'ajout vs modif
  travailAModifier: Travail | null;
   // Ajouter les props pour la logique plinthe si on l'intègre ICI
   selectedElementContext?: string;
   calculatedLinear?: number;
}

const TravailForm: React.FC<TravailFormProps> = ({
  piece,
  onAddTravail,
  travailAModifier,
  selectedElementContext, // Prop pour plinthe
  calculatedLinear      // Prop pour plinthe
}) => {
  // États locaux pour chaque champ du formulaire
  const [typeTravauxId, setTypeTravauxId] = useState<string>(travailAModifier?.typeTravauxId || "");
  const [typeTravauxLabel, setTypeTravauxLabel] = useState<string>(travailAModifier?.typeTravauxLabel || "");
  const [groupId, setGroupId] = useState<string>(travailAModifier?.groupId || ""); // Assurez-vous que groupId est dans Travail
  const [groupLabel, setGroupLabel] = useState<string>(""); // Probablement pas dans Travail, juste pour l'UI
  const [sousTypeId, setSousTypeId] = useState<string>(travailAModifier?.sousTypeId || "");
  const [sousTypeLabel, setSousTypeLabel] = useState<string>(travailAModifier?.sousTypeLabel || "");
  const [selectedService, setSelectedService] = useState<Service | null>(null); // Stocke l'objet service de référence
  const [description, setDescription] = useState<string>(travailAModifier?.description || "");
  const [quantite, setQuantite] = useState<number>(travailAModifier?.quantite || 0);
  // Assurer que UniteType est correctement défini (ex: 'M²', 'ml', 'u', 'forfait')
  const [unite, setUnite] = useState<UniteType>(travailAModifier?.unite as UniteType || "M²");
  // Adapter les noms si votre type Travail utilise laborPrice/supplyPrice
  const [prixFournitures, setPrixFournitures] = useState<number>(
    travailAModifier?.supplyPrice ?? travailAModifier?.prixFournitures ?? 0 // Utiliser les noms probables
  );
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(
    travailAModifier?.laborPrice ?? travailAModifier?.prixMainOeuvre ?? 0 // Utiliser les noms probables
  );
  const [tauxTVA, setTauxTVA] = useState<number>(travailAModifier?.tauxTVA || 10); // Valeur par défaut commune
  // Assurer que SurfaceImpactee est correctement défini (ex: 'Mur', 'Sol', 'Plafond', 'Aucune')
  const [surfaceImpactee, setSurfaceImpactee] = useState<SurfaceImpactee>(travailAModifier?.surfaceImpactee as SurfaceImpactee || 'Aucune');

  // États pour gérer la personnalisation par rapport au service de référence
  const [isCustomUnite, setIsCustomUnite] = useState<boolean>(!travailAModifier?.unite); // Ou une logique basée sur la comparaison
  const [isCustomSurface, setIsCustomSurface] = useState<boolean>(!travailAModifier?.surfaceImpactee); // Ou une logique basée sur la comparaison

  // États pour les modales
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  // Stocke les valeurs initiales venant du service sélectionné pour détecter les changements manuels
  const [initialValues, setInitialValues] = useState<{
    description: string;
    surfaceImpactee: SurfaceImpactee;
    unite: UniteType;
    prixFournitures: number;
    prixMainOeuvre: number;
  } | null>(null);

  // Effet pour réinitialiser groupe/sous-type quand type change
  useEffect(() => {
    // Ne pas reset si on charge pour modification
    if (!travailAModifier || travailAModifier.typeTravauxId !== typeTravauxId) {
        setGroupId("");
        setGroupLabel("");
        setSousTypeId("");
        setSousTypeLabel("");
        setSelectedService(null);
        setInitialValues(null); // Réinitialiser aussi les valeurs initiales
    }
  }, [typeTravauxId, travailAModifier]); // S'exécute quand typeTravauxId change

  // Effet pour réinitialiser sous-type quand groupe change
  useEffect(() => {
    if (!travailAModifier || travailAModifier.groupId !== groupId) {
        setSousTypeId("");
        setSousTypeLabel("");
        setSelectedService(null);
        setInitialValues(null);
    }
  }, [groupId, travailAModifier]); // S'exécute quand groupId change

  // Effet pour pré-remplir les champs quand un service (sous-type) est sélectionné
  useEffect(() => {
    if (selectedService) {
      // Seulement si on n'est PAS en train d'éditer OU si le sous-type a réellement changé
      const shouldUpdateFields = !travailAModifier || (travailAModifier && travailAModifier.sousTypeId !== selectedService.id);

      if (shouldUpdateFields) {
          const serviceUnit = (selectedService.unite as UniteType) || "M²"; // Fallback unité
          const serviceSurface = (selectedService.surface_impactee as SurfaceImpactee) || 'Aucune'; // Fallback surface
          const serviceDesc = selectedService.description || selectedService.name || ""; // Fallback description

          // Stocker les valeurs initiales venant de CE service
          setInitialValues({
            description: serviceDesc,
            surfaceImpactee: serviceSurface,
            unite: serviceUnit,
            prixFournitures: selectedService.supply_price || 0,
            prixMainOeuvre: selectedService.labor_price || 0,
          });

          // Mettre à jour les champs du formulaire
          setPrixFournitures(selectedService.supply_price || 0);
          setPrixMainOeuvre(selectedService.labor_price || 0);
          setTauxTVA(selectedService.taux_tva || 10); // Utiliser la TVA du service ou un défaut
          setUnite(serviceUnit);
          setDescription(serviceDesc);
          setSurfaceImpactee(serviceSurface);

          // Réinitialiser les indicateurs custom
          setIsCustomUnite(false); // On utilise la valeur du service
          setIsCustomSurface(false); // On utilise la valeur du service

          // Calculer la quantité initiale basée sur la surface impactée du service
          if (piece) {
            let quantiteInitiale = 1; // Défaut si pas de surface correspondante

            switch (serviceSurface) { // Utiliser serviceSurface ici
              case 'Mur':
                quantiteInitiale = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0;
                break;
              case 'Plafond':
                quantiteInitiale = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0;
                break;
              case 'Sol':
                quantiteInitiale = piece.surfaceNetteSol || piece.surfaceBruteSol || 0;
                break;
               // Pas de 'default: 1' ici, car si 'Aucune', on garde 1
            }
            // Appliquer 1 si l'unité n'est pas M² ou Ml, ou si surface est 'Aucune'
            if (serviceUnit !== 'M²' && serviceUnit !== 'ml' || serviceSurface === 'Aucune') {
                quantiteInitiale = 1;
            }

            setQuantite(parseFloat(quantiteInitiale.toFixed(2)));
          } else {
             setQuantite(1); // Si pas de pièce, quantité = 1 par défaut
          }

      } else if (travailAModifier && travailAModifier.sousTypeId === selectedService.id) {
         // Si on édite et qu'on re-sélectionne le même service,
         // on remet les valeurs initiales stockées pour ce service
         // au cas où l'utilisateur avait commencé à les modifier puis changé d'avis
         if(initialValues){
             setDescription(initialValues.description);
             setSurfaceImpactee(initialValues.surfaceImpactee);
             setUnite(initialValues.unite);
             setPrixFournitures(initialValues.prixFournitures);
             setPrixMainOeuvre(initialValues.prixMainOeuvre);
             // Recalculer la quantité basée sur la surface impactée initiale
              if (piece) {
                let q = 1;
                switch (initialValues.surfaceImpactee) {
                    case 'Mur': q = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0; break;
                    case 'Plafond': q = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0; break;
                    case 'Sol': q = piece.surfaceNetteSol || piece.surfaceBruteSol || 0; break;
                }
                if (initialValues.unite !== 'M²' && initialValues.unite !== 'ml' || initialValues.surfaceImpactee === 'Aucune') q = 1;
                setQuantite(parseFloat(q.toFixed(2)));
              } else { setQuantite(1); }

         }
         setIsCustomUnite(false);
         setIsCustomSurface(false);
      }

    } else {
       // Si selectedService devient null (ex: changement de groupe), reset initialValues
       setInitialValues(null);
    }
  // Dépendances : se déclenche quand le service sélectionné ou la pièce change
  }, [selectedService, piece, travailAModifier]); // Retrait de setQuantite etc. des dépendances

  // Effet pour recalculer la quantité si SEULEMENT la surface impactée change MANUELLEMENT
  useEffect(() => {
    // S'exécute seulement si on a un service sélectionné et une pièce
    // et si la surface sélectionnée est différente de celle du service initial
    if (piece && selectedService && initialValues && surfaceImpactee !== initialValues.surfaceImpactee) {
        let quantiteAjustee = 1; // Défaut
        switch (surfaceImpactee) { // Utilise la valeur actuelle de l'état surfaceImpactee
            case 'Mur':
            quantiteAjustee = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0;
            break;
            case 'Plafond':
            quantiteAjustee = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0;
            break;
            case 'Sol':
            quantiteAjustee = piece.surfaceNetteSol || piece.surfaceBruteSol || 0;
            break;
            // Pas de default, garde 1 si 'Aucune' ou autre
        }
        // Appliquer 1 si l'unité n'est pas M² ou Ml, ou si surface est 'Aucune'
        if (unite !== 'M²' && unite !== 'ml' || surfaceImpactee === 'Aucune') {
            quantiteAjustee = 1;
        }

        setQuantite(parseFloat(quantiteAjustee.toFixed(2)));
        setIsCustomSurface(true); // Marquer comme custom car différent de l'initial
    } else if (initialValues && surfaceImpactee === initialValues.surfaceImpactee) {
        setIsCustomSurface(false); // Revenir à non-custom si on re-sélectionne la valeur initiale
    }
  // Dépendances : se déclenche si la surface impactée est modifiée manuellement
  }, [surfaceImpactee, piece, selectedService, initialValues]);

   // Effet pour marquer l'unité comme custom si elle diffère de l'initiale
   useEffect(() => {
       if (initialValues && unite !== initialValues.unite) {
           setIsCustomUnite(true);
       } else if (initialValues && unite === initialValues.unite) {
           setIsCustomUnite(false);
       }
   }, [unite, initialValues]);


  // --- LOGIQUE PLINTHE (À AJOUTER ICI) ---
  useEffect(() => {
    // S'applique seulement en mode AJOUT si l'élément est 'plinthes' et qu'on a un linéaire
    if (!travailAModifier && selectedElementContext === 'plinthes' && typeof calculatedLinear === 'number' && calculatedLinear > 0) {
       console.log("Pré-remplissage pour Plinthes (Effet Formulaire). Linéaire reçu:", calculatedLinear);
       toast.info(`Pré-remplissage pour Plinthes activé (${calculatedLinear} ml)`);

       // Écraser les valeurs des états locaux concernés
       setSurfaceImpactee('Aucune'); // Forcer "Aucune"
       setQuantite(calculatedLinear); // Utilise la prop directement
       setUnite('ml'); // Forcer "ml"

       // Marquer comme custom car on force des valeurs différentes du service potentiellement sélectionné
       setIsCustomSurface(true);
       setIsCustomUnite(true);

       // Optionnel : Forcer la sélection d'un type/groupe/sous-type "Plinthes"
       // (Nécessite une fonction pour trouver le service par nom/clé et appeler les setters appropriés)
       // findAndSetPlintheService();
    }
  }, [selectedElementContext, travailAModifier, calculatedLinear]); // Dépend de la prop calculatedLinear
  // --- FIN LOGIQUE PLINTHE ---


  // Détecter les changements manuels par rapport aux valeurs initiales du service
  const hasChanges = useMemo(() => {
    if (!initialValues) return false; // Pas de changements si pas de service chargé

    const descChanged = description !== initialValues.description;
    const surfaceChanged = surfaceImpactee !== initialValues.surfaceImpactee;
    const uniteChanged = unite !== initialValues.unite;
    const prixFChanged = prixFournitures !== initialValues.prixFournitures;
    const prixMOChanged = prixMainOeuvre !== initialValues.prixMainOeuvre;

    // Retourne true si au moins un champ pertinent a changé
    return descChanged || surfaceChanged || uniteChanged || prixFChanged || prixMOChanged;
  }, [
    initialValues,
    description,
    surfaceImpactee,
    unite,
    prixFournitures,
    prixMainOeuvre
  ]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!typeTravauxId || !sousTypeId || !piece) {
      toast.error("Veuillez compléter tous les champs requis (Type, Groupe, Prestation).");
      console.error("Données manquantes:", { typeTravauxId, sousTypeId, piece });
      return;
    }

    // Si des modifications ont été détectées par rapport au service de base,
    // demander à l'utilisateur ce qu'il veut faire.
    if (hasChanges && !travailAModifier) { // Seulement en mode ajout pour l'instant
      setIsConfirmDialogOpen(true);
    } else {
      // Sinon (pas de modifs ou mode édition), ajouter/modifier directement le travail
      addOrUpdateTravail();
    }
  };

  // Fonction interne pour effectivement ajouter ou modifier le travail
  const addOrUpdateTravail = () => {
    if (!typeTravauxId || !sousTypeId || !piece) return; // Double vérification

    const travailData: Omit<Travail, 'id'> = {
      pieceId: piece.id,
      typeTravauxId,
      typeTravauxLabel,
      groupId: groupId, // Assurer que groupId est inclus
      sousTypeId,
      sousTypeLabel,
      description,
      quantite,
      unite,
      prixFournitures,
      prixMainOeuvre,
      tauxTVA,
      // Calculer prixUnitaireHT pour l'objet Travail
      prixUnitaireHT: (prixFournitures ?? 0) + (prixMainOeuvre ?? 0),
      surfaceImpactee: surfaceImpactee as SurfaceImpactee,
      commentaire: travailAModifier?.commentaire || "", // Garder commentaire si édition
    };

    if (travailAModifier) {
        // Passer l'objet complet avec l'ID pour la modification
        onAddTravail({ ...travailData, id: travailAModifier.id });
    } else {
        onAddTravail(travailData);
    }
  };

  // Ouvre la modale de mise à jour du service de référence
  const handleOpenUpdateModal = () => {
    if (!selectedService) {
      toast.error("Veuillez d'abord sélectionner une prestation pour la mettre à jour.");
      return;
    }
    setIsUpdateModalOpen(true);
  };

  // Gère le retour de la modale de mise à jour du service
  const handleServiceUpdate = async (updateType: 'update' | 'create', serviceData: Partial<Service>): Promise<Service | null> => {
    if (!selectedService) return null;

    try {
      let updatedOrNewService: Service | null = null;

      if (updateType === 'update') {
        // Mettre à jour le service existant dans la DB
        updatedOrNewService = await updateService(selectedService.id, serviceData);
        if (updatedOrNewService) {
          toast.success("La prestation de référence a été mise à jour.");
          // Mettre à jour l'état local avec le service modifié
          setSelectedService(updatedOrNewService);
          // Réappliquer les valeurs du service mis à jour au formulaire ? Optionnel.
          // resetFormWithService(updatedOrNewService);
        }
      } else { // updateType === 'create'
        // Créer une nouvelle prestation basée sur l'ancienne + modifications
        updatedOrNewService = await cloneServiceWithChanges(selectedService.id, serviceData);
        if (updatedOrNewService) {
          toast.success("Nouvelle prestation de référence créée.");
          // Mettre à jour la sélection pour pointer vers le nouveau service
          setSousTypeId(updatedOrNewService.id);
          setSousTypeLabel(updatedOrNewService.name);
          setSelectedService(updatedOrNewService); // Mettre à jour l'état local
          // Les champs du formulaire seront mis à jour par l'effet dépendant de selectedService
        }
      }
      setIsUpdateModalOpen(false); // Fermer la modale de mise à jour
      return updatedOrNewService; // Retourner le service affecté
    } catch (error) {
      console.error("Erreur lors de la mise à jour/création du service:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de la prestation de référence.");
      setIsUpdateModalOpen(false);
      return null;
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type de Travaux Select */}
      <div>
        <Label htmlFor="type-travaux">Type de travaux *</Label>
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
          <Label htmlFor="groupe-service">Groupe de services *</Label>
          <ServiceGroupSelect
            workTypeId={typeTravauxId}
            value={groupId}
            onChange={(id, label) => {
              setGroupId(id);
              setGroupLabel(label); // Stocker label si nécessaire
            }}
          />
        </div>
      )}

      {/* Prestation (Sous-Type) Select (conditionnel) */}
      {groupId && (
        <div>
          <Label htmlFor="sousType">Prestation *</Label>
          <SousTypeSelect
            groupId={groupId}
            value={sousTypeId}
            onChange={(id, label, service) => {
              setSousTypeId(id);
              setSousTypeLabel(label);
              setSelectedService(service); // Mettre à jour l'objet service complet
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

          {/* Bouton Mise à Jour Base de Données */}
          <div className="mt-1 mb-3">
            <Button
              type="button"
              variant={hasChanges ? "destructive" : "outline"} // Change la couleur si modifs
              size="sm"
              onClick={handleOpenUpdateModal}
              className={`flex items-center gap-1 text-xs w-full ${hasChanges ? "hover:bg-destructive/90" : ""}`} // Ajuste le hover
              title={hasChanges ? "Certains paramètres diffèrent de la base de données. Cliquez pour mettre à jour ou créer une nouvelle prestation." : "Mettre à jour la prestation de référence dans la base de données"}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {hasChanges ? "Mettre à jour / Cloner la prestation de référence..." : "Modifier la prestation de référence..."}
            </Button>
          </div>

          {/* Quantité Section */}
          <QuantitySection
            quantite={quantite}
            setQuantite={setQuantite}
            unite={unite}
            setUnite={(value) => setUnite(value as UniteType)}
            surfaceImpactee={surfaceImpactee}
            setSurfaceImpactee={(value) => setSurfaceImpactee(value as SurfaceImpactee)}
            isCustomUnite={isCustomUnite}   // Indique si l'unité est modifiée
            isCustomSurface={isCustomSurface} // Indique si la surface est modifiée
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
          disabled={!typeTravauxId || !sousTypeId || !piece || !selectedService} // Désactivé si pas de prestation valide
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
              Vous avez modifié la description, l'unité, la surface impactée ou les prix par rapport à la prestation de référence.
              Voulez-vous mettre à jour la prestation dans la base de données avant d'ajouter ce travail ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsConfirmDialogOpen(false);
              addOrUpdateTravail(); // Ajouter/Modifier SANS mettre à jour la référence
            }}>
              Non, utiliser ces valeurs juste pour ce devis
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsConfirmDialogOpen(false);
              // Ouvrir la modale de mise à jour pour choisir entre update/create
              handleOpenUpdateModal();
              // L'ajout réel se fera après la confirmation dans l'autre modale si nécessaire
              // ou l'utilisateur devra recliquer sur Ajouter/Modifier après la màj de la ref
            }}>
              Oui, gérer la prestation de référence...
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
          // Passer les valeurs ACTUELLES du formulaire comme valeurs mises à jour proposées
          updatedService={{
            // name: sousTypeLabel, // Ne pas proposer de changer le nom ici ?
            description: description,
            labor_price: prixMainOeuvre,
            supply_price: prixFournitures,
            unite: unite, // Note: 'unit' dans Supabase, 'unite' ici? Cohérence!
            surface_impactee: surfaceImpactee // Note: 'surface_impactee' dans Supabase
          }}
          onConfirmUpdate={(updateType, serviceData) => {
              // Appeler handleServiceUpdate et AJOUTER ensuite le travail si succès ?
              // Ou laisser l'utilisateur resoumettre le formulaire principal ?
              // Pour l'instant, on met juste à jour la référence.
              handleServiceUpdate(updateType, serviceData).then((updatedOrNewService) => {
                 if(updatedOrNewService){
                    // Optionnel : Ajouter automatiquement le travail après la mise à jour de la référence
                    // addOrUpdateTravail(); // Attention, pourrait utiliser l'ancien état
                 }
              });
          }}
        />
      )}
    </form>
  );
};

export default TravailForm;