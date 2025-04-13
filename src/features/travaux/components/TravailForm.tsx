import React, { useState, useEffect } from "react";
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
  const [personnalisation, setPersonnalisation] = useState<string>(travailAModifier?.personnalisation || "");
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
  
  // Flag pour savoir si l'unité et la surface impactée sont personnalisées
  const [isCustomUnite, setIsCustomUnite] = useState<boolean>(true);
  const [isCustomSurface, setIsCustomSurface] = useState<boolean>(true);
  
  // État pour le modal de mise à jour
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

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
      console.log("Service sélectionné:", selectedService);
      
      setPrixFournitures(selectedService.supply_price || 0);
      setPrixMainOeuvre(selectedService.labor_price || 0);
      
      // Utiliser l'unité du service si définie, sinon "Unité"
      const serviceUnit = selectedService.unit || "Unité";
      // Vérifier que l'unité est conforme au type UniteType
      setUnite(serviceUnit as UniteType);
      
      // Déterminer si l'unité est personnalisée (non définie dans le service)
      setIsCustomUnite(!selectedService.unit);
      console.log("Unité personnalisée:", !selectedService.unit);
      
      setDescription(selectedService.description || "");
      
      // Utiliser la surface impactée du service
      setSurfaceImpactee(selectedService.surface_impactee || 'Aucune');
      
      // Déterminer si la surface impactée est personnalisée
      setIsCustomSurface(!selectedService.surface_impactee);
      console.log("Surface impactée personnalisée:", !selectedService.surface_impactee);
      
      if (piece) {
        let quantiteInitiale = 0;
        
        // Définir la quantité initiale en fonction de la surface impactée
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
            quantiteInitiale = 1; // Valeur par défaut pour 'Aucune'
        }
        
        setQuantite(parseFloat(quantiteInitiale.toFixed(2)));
      }
    }
  }, [selectedService, piece]);

  useEffect(() => {
    if (piece && selectedService) {
      let quantiteAjustee = 0;
      
      // Ajuster la quantité en fonction de la nouvelle surface sélectionnée
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
          // Ne pas modifier la quantité si 'Aucune' est sélectionné
          return;
      }
      
      setQuantite(parseFloat(quantiteAjustee.toFixed(2)));
    }
  }, [surfaceImpactee, piece]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeTravauxId || !sousTypeId || !piece) {
      console.error("Données manquantes pour ajouter un travail");
      return;
    }
    
    onAddTravail({
      pieceId: piece.id,
      typeTravauxId,
      typeTravauxLabel,
      sousTypeId,
      sousTypeLabel,
      description,
      personnalisation,
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

  const handleServiceUpdate = async (updateType: 'update' | 'create') => {
    if (!selectedService) return;
    
    // Préparer les mises à jour
    const serviceUpdates: Partial<Service> = {
      name: sousTypeLabel,
      description: description,
      labor_price: prixMainOeuvre,
      supply_price: prixFournitures,
      unit: unite,
      surface_impactee: surfaceImpactee
    };
    
    try {
      if (updateType === 'update') {
        // Mettre à jour le service existant
        const updatedService = await updateService(selectedService.id, serviceUpdates);
        if (updatedService) {
          toast.success("La prestation a été mise à jour avec succès");
          // Mettre à jour le service sélectionné
          setSelectedService(updatedService);
        }
      } else {
        // Créer un nouveau service
        const newService = await cloneServiceWithChanges(selectedService.id, serviceUpdates);
        if (newService) {
          toast.success("Nouvelle prestation créée avec succès");
          // Sélectionner le nouveau service
          setSousTypeId(newService.id);
          setSousTypeLabel(newService.name);
          setSelectedService(newService);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
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
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Description</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleOpenUpdateModal}
              className="flex items-center gap-1 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Mettre à jour la base de données
            </Button>
          </div>

          <DescriptionSection 
            description={description}
            setDescription={setDescription}
            personnalisation={personnalisation}
            setPersonnalisation={setPersonnalisation}
          />

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
