
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TypeTravauxSelect from "./TypeTravauxSelect";
import ServiceGroupSelect from "./ServiceGroupSelect";
import SousTypeSelect from "./SousTypeSelect";
import { Room, Travail, SurfaceImpactee } from "@/types";
import { Service } from "@/types/supabase";
import DescriptionSection from "./DescriptionSection";
import QuantitySection from "./QuantitySection";
import PriceSection from "./PriceSection";
import { Label } from "@/components/ui/label";

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
  const [unite, setUnite] = useState<string>(travailAModifier?.unite || "m²");
  const [prixFournitures, setPrixFournitures] = useState<number>(
    travailAModifier?.prixFournitures || 0
  );
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(
    travailAModifier?.prixMainOeuvre || 0
  );
  const [tauxTVA, setTauxTVA] = useState<number>(travailAModifier?.tauxTVA || 10);
  const [surfaceImpactee, setSurfaceImpactee] = useState<SurfaceImpactee>('Mur');

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
      setUnite(selectedService.unit || "m²");
      setDescription(selectedService.description || "");
      setSurfaceImpactee(selectedService.surface_impactee || 'Aucune');
      
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

  // Mise à jour de la quantité lorsque la surface impactée change
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
            personnalisation={personnalisation}
            setPersonnalisation={setPersonnalisation}
          />

          <QuantitySection
            quantite={quantite}
            setQuantite={setQuantite}
            unite={unite}
            setUnite={setUnite}
            surfaceImpactee={surfaceImpactee}
            setSurfaceImpactee={setSurfaceImpactee}
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
    </form>
  );
};

export default TravailForm;
