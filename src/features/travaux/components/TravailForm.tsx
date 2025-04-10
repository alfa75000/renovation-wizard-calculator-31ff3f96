
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TypeTravauxSelect from "./TypeTravauxSelect";
import ServiceGroupSelect from "./ServiceGroupSelect";
import SousTypeSelect from "./SousTypeSelect";
import TvaSelect from "./TvaSelect";
import UniteSelect from "./UniteSelect";
import SurfaceImpacteeSelect from "./SurfaceImpacteeSelect";
import { Room, Travail } from "@/types";
import { Service } from "@/types/supabase";

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
      commentaire: "", // Supprimé comme demandé
      surfaceImpactee, // Nouvelle propriété
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
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description du travail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="personnalisation">Personnalisation</Label>
            <Textarea
              id="personnalisation"
              placeholder="Détails spécifiques (optionnel)"
              value={personnalisation || ""}
              onChange={(e) => setPersonnalisation(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="surfaceImpactee">Surface impactée</Label>
            <SurfaceImpacteeSelect
              value={surfaceImpactee}
              onChange={setSurfaceImpactee}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantite">Quantité</Label>
              <Input
                id="quantite"
                type="number"
                min="0"
                step="0.01"
                value={quantite}
                onChange={(e) => setQuantite(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="unite">Unité</Label>
              <UniteSelect
                value={unite}
                onChange={(value) => setUnite(value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prixFournitures">Prix fournitures (€/{unite})</Label>
              <Input
                id="prixFournitures"
                type="number"
                min="0"
                step="0.01"
                value={prixFournitures}
                onChange={(e) => setPrixFournitures(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="prixMainOeuvre">Prix main d'œuvre (€/{unite})</Label>
              <Input
                id="prixMainOeuvre"
                type="number"
                min="0"
                step="0.01"
                value={prixMainOeuvre}
                onChange={(e) => setPrixMainOeuvre(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tauxTVA">Taux de TVA (%)</Label>
            <TvaSelect
              value={tauxTVA}
              onChange={(value) => setTauxTVA(value)}
              className="mt-1"
            />
          </div>
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
