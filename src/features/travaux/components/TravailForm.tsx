import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TypeTravauxSelect from "./TypeTravauxSelect";
import ServiceGroupSelect from "./ServiceGroupSelect";
import SousTypeSelect from "./SousTypeSelect";
import { Room, Travail, SurfaceImpactee } from "@/types";
import { Service, UniteType } from "@/types/supabase";
import DescriptionSection from "./DescriptionSection";
import QuantitySection from "./QuantitySection";
import PriceSection from "./PriceSection";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import UpdateServiceModal from "./UpdateServiceModal";
import { updateService, cloneServiceWithChanges } from "@/services/travauxService";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TravailFormProps {
  piece: Room | null;
  onAddTravail: (travail: Omit<Travail, "id">) => void;
  travailAModifier: Travail | null;
}

const TravailForm: React.FC<TravailFormProps> = ({
  piece,
  onAddTravail,
  travailAModifier,
}) => {
  const [typeTravauxId, setTypeTravauxId] = useState<string>(travailAModifier?.typeTravauxId || "");
  const [typeTravauxLabel, setTypeTravauxLabel] = useState<string>(travailAModifier?.typeTravauxLabel || "");
  const [groupId, setGroupId] = useState<string>("");
  const [groupLabel, setGroupLabel] = useState<string>("");
  const [sousTypeId, setSousTypeId] = useState<string>(travailAModifier?.sousTypeId || "");
  const [sousTypeLabel, setSousTypeLabel] = useState<string>(travailAModifier?.sousTypeLabel || "");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [description, setDescription] = useState<string>(travailAModifier?.description || "");
  const [quantite, setQuantite] = useState<number>(travailAModifier?.quantite || 0);
  const [unite, setUnite] = useState<UniteType>("M²");
  const [prixFournitures, setPrixFournitures] = useState<number>(
    travailAModifier?.prixFournitures || 0
  );
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(
    travailAModifier?.prixMainOeuvre || 0
  );
  const [tauxTVA, setTauxTVA] = useState<number>(travailAModifier?.tauxTVA || 10);
  const [surfaceImpactee, setSurfaceImpactee] = useState<SurfaceImpactee>('Mur');
  
  const [isCustomUnite, setIsCustomUnite] = useState<boolean>(true);
  const [isCustomSurface, setIsCustomSurface] = useState<boolean>(true);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  
  const [initialValues, setInitialValues] = useState<{
    description: string;
    surfaceImpactee: SurfaceImpactee;
    quantite: number;
    unite: UniteType;
    prixFournitures: number;
    prixMainOeuvre: number;
  } | null>(null);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setGroupId("");
    setGroupLabel("");
    setSousTypeId("");
    setSousTypeLabel("");
    setSelectedService(null);
  }, [typeTravauxId]);

  useEffect(() => {
    setSousTypeId("");
    setSousTypeLabel("");
    setSelectedService(null);
  }, [groupId]);

  useEffect(() => {
    if (selectedService) {
      setPrixFournitures(selectedService.supply_price || 0);
      setPrixMainOeuvre(selectedService.labor_price || 0);
      
      const serviceUnit = selectedService.unit || "Unité";
      setUnite(serviceUnit as UniteType);
      
      setIsCustomUnite(!selectedService.unit);
      
      setDescription(selectedService.description || "");
      
      setSurfaceImpactee(selectedService.surface_impactee || 'Aucune');
      
      setIsCustomSurface(!selectedService.surface_impactee);
      
      if (piece) {
        let quantiteInitiale = 0;
        
        switch (selectedService.surface_impactee) {
          case 'Mur':
            quantiteInitiale = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0;
            break;
          case 'Plafond':
            quantiteInitiale = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0;
            break;
          case 'Sol':
            quantiteInitiale = piece.surfaceNetteSol || piece.surfaceBruteSol || 0;
            break;
          default:
            quantiteInitiale = 1;
        }
        
        setQuantite(parseFloat(quantiteInitiale.toFixed(2)));
      }
      
      setInitialValues({
        description: selectedService.description || "",
        surfaceImpactee: selectedService.surface_impactee || 'Aucune',
        quantite: parseFloat(quantite.toFixed(2)) || 0,
        unite: serviceUnit as UniteType,
        prixFournitures: selectedService.supply_price || 0,
        prixMainOeuvre: selectedService.labor_price || 0,
      });
    }
  }, [selectedService, piece]);

  useEffect(() => {
    if (piece && selectedService) {
      let quantiteAjustee = 0;
      
      switch (surfaceImpactee) {
        case 'Mur':
          quantiteAjustee = piece.surfaceNetteMurs || piece.wallSurfaceRaw || 0;
          break;
        case 'Plafond':
          quantiteAjustee = piece.surfaceNettePlafond || piece.surfaceBrutePlafond || 0;
          break;
        case 'Sol':
          quantiteAjustee = piece.surfaceNetteSol || piece.surfaceBruteSol || 0;
          break;
        default:
          return;
      }
      
      setQuantite(parseFloat(quantiteAjustee.toFixed(2)));
    }
  }, [surfaceImpactee, piece]);

  const hasChanges = useMemo(() => {
    if (!initialValues || !selectedService) return false;
    
    return (
      description !== initialValues.description ||
      surfaceImpactee !== initialValues.surfaceImpactee ||
      unite !== initialValues.unite ||
      prixFournitures !== initialValues.prixFournitures ||
      prixMainOeuvre !== initialValues.prixMainOeuvre
    );
  }, [
    initialValues,
    selectedService,
    description,
    surfaceImpactee,
    unite,
    prixFournitures,
    prixMainOeuvre
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeTravauxId || !sousTypeId || !piece) {
      console.error("Données manquantes pour ajouter un travail");
      return;
    }
    
    if (hasChanges) {
      setIsConfirmDialogOpen(true);
      return;
    }
    
    addTravailToProject();
  };

  const addTravailToProject = () => {
    if (!piece) return;
    
    onAddTravail({
      pieceId: piece.id,
      typeTravauxId,
      typeTravauxLabel,
      sousTypeId,
      sousTypeLabel,
      description,
      quantite,
      unite,
      prixFournitures,
      prixMainOeuvre,
      tauxTVA,
      commentaire: "",
      surfaceImpactee,
    });
  };

  const handleOpenUpdateModal = () => {
    if (!selectedService) {
      toast.error("Veuillez d'abord sélectionner une prestation");
      return;
    }
    setIsUpdateModalOpen(true);
  };

  const handleServiceUpdate = async (updateType: 'update' | 'create', serviceData: Partial<Service>): Promise<Service | null> => {
    if (!selectedService) return null;
    
    console.log("--- DEBUG: handleServiceUpdate appelé avec:", {
      updateType,
      serviceData,
      selectedServiceId: selectedService.id
    });
    
    try {
      let updatedService: Service | null = null;
      
      if (updateType === 'update') {
        console.log("--- DEBUG: Tentative de mise à jour du service existant");
        updatedService = await updateService(selectedService.id, serviceData);
        if (updatedService) {
          console.log("Service mis à jour avec succès:", updatedService);
          toast.success("La prestation a été mise à jour avec succès");
          setSelectedService(updatedService);
        }
      } else {
        console.log("--- DEBUG: Tentative de création d'un nouveau service");
        updatedService = await cloneServiceWithChanges(selectedService.id, serviceData);
        console.log("--- DEBUG: Résultat de cloneServiceWithChanges:", updatedService);
        
        if (updatedService) {
          console.log("Nouvelle prestation créée avec succès:", updatedService);
          toast.success("Nouvelle prestation créée avec succès");
          setSousTypeId(updatedService.id);
          setSousTypeLabel(updatedService.name);
          setSelectedService(updatedService);
        } else {
          console.error("Échec de la création de la prestation");
        }
      }
      
      return updatedService;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
      return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <TypeTravauxSelect
          value={typeTravauxId}
          onChange={(id: string, label: string) => {
            setTypeTravauxId(id);
            setTypeTravauxLabel(label);
          }}
        />
      </div>

      {typeTravauxId && (
        <div>
          <ServiceGroupSelect
            workTypeId={typeTravauxId}
            value={groupId}
            onChange={(id: string, label: string) => {
              setGroupId(id);
              setGroupLabel(label);
            }}
          />
        </div>
      )}

      {groupId && (
        <div>
          <Label htmlFor="sousType">Prestation</Label>
          <SousTypeSelect
            groupId={groupId}
            value={sousTypeId}
            onChange={(id: string, label: string, service: Service) => {
              setSousTypeId(id);
              setSousTypeLabel(label);
              setSelectedService(service);
            }}
          />
        </div>
      )}

      {sousTypeId && (
        <>
          <DescriptionSection 
            description={description}
            setDescription={setDescription}
          />
          
          <div className="mt-1 mb-3">
            <Button 
              type="button" 
              variant={hasChanges ? "reset" : "outline"} 
              size="sm" 
              onClick={handleOpenUpdateModal}
              className={`flex items-center gap-1 text-xs w-full ${hasChanges ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Mettre à jour la base de données
            </Button>
          </div>

          <QuantitySection
            quantite={quantite}
            setQuantite={setQuantite}
            unite={unite}
            setUnite={(value) => setUnite(value as UniteType)}
            surfaceImpactee={surfaceImpactee}
            setSurfaceImpactee={setSurfaceImpactee}
            isCustomUnite={isCustomUnite}
            isCustomSurface={isCustomSurface}
          />

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

      <div className="pt-4">
        <Button
          type="submit"
          disabled={!typeTravauxId || !sousTypeId || !piece}
          className="w-full"
        >
          {travailAModifier ? "Modifier" : "Ajouter"} le travail
        </Button>
      </div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifications détectées</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez apporté des modifications à la prestation. Souhaitez-vous mettre à jour la base de données avec ces modifications avant d'ajouter ce travail ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsConfirmDialogOpen(false);
              addTravailToProject();
            }}>
              Continuer sans mise à jour
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsConfirmDialogOpen(false);
              setIsUpdateModalOpen(true);
            }}>
              Mettre à jour la base de données
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isUpdateModalOpen && selectedService && (
        <UpdateServiceModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          currentService={selectedService}
          updatedService={{
            name: sousTypeLabel,
            description: description,
            labor_price: prixMainOeuvre,
            supply_price: prixFournitures,
            unit: unite,
            surface_impactee: surfaceImpactee
          }}
          onConfirmUpdate={handleServiceUpdate}
        />
      )}
    </form>
  );
};

export default TravailForm;
