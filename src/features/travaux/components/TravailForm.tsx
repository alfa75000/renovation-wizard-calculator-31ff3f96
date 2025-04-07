
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TypeTravauxSelect from "./TypeTravauxSelect";
import SousTypeSelect from "./SousTypeSelect";
import TvaSelect from "./TvaSelect";
import UniteSelect from "./UniteSelect";
import { Room, Travail, SousTypeTravauxItem } from "@/types";

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
  const [sousTypeId, setSousTypeId] = useState<string>(travailAModifier?.sousTypeId || "");
  const [sousType, setSousType] = useState<SousTypeTravauxItem | null>(null);
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
  const [commentaire, setCommentaire] = useState<string>(travailAModifier?.commentaire || "");
  const [typeTravauxLabel, setTypeTravauxLabel] = useState<string>("");
  const [sousTypeLabel, setSousTypeLabel] = useState<string>("");

  // Effet pour réinitialiser les champs lorsque le type de travaux change
  useEffect(() => {
    setSousTypeId("");
    setSousType(null);
  }, [typeTravauxId]);

  // Effet pour remplir les données lorsqu'un sous-type est sélectionné
  useEffect(() => {
    if (sousType) {
      setPrixFournitures(sousType.prixFournitures || 0);
      setPrixMainOeuvre(sousType.prixMainOeuvre || 0);
      setUnite(sousType.unite || "m²");
      
      // Calculer la quantité en fonction de la surface de référence si disponible
      if (piece && sousType.surfaceReference) {
        let quantiteInitiale = 0;
        
        switch (sousType.surfaceReference) {
          case "murs":
            quantiteInitiale = piece.surfaceNetteMurs || 0;
            break;
          case "sol":
            quantiteInitiale = piece.surfaceNetteSol || 0;
            break;
          case "plafond":
            quantiteInitiale = piece.surfaceNettePlafond || 0;
            break;
          case "menuiseries":
            quantiteInitiale = piece.surfaceMenuiseries || piece.totalMenuiserieSurface || 0;
            break;
          case "plinthes":
            quantiteInitiale = piece.totalPlinthLength || 0;
            break;
          case "perimetre":
            quantiteInitiale = piece.lineaireNet || 0;
            break;
          default:
            quantiteInitiale = 0;
        }
        
        setQuantite(parseFloat(quantiteInitiale.toFixed(2)));
      }
    }
  }, [sousType, piece]);

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
      commentaire,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="typeTravaux">Type de travaux</Label>
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
          <Label htmlFor="sousType">Sous-type de travaux</Label>
          <SousTypeSelect
            typeTravauxId={typeTravauxId}
            value={sousTypeId}
            onChange={(id: string, label: string, sousTypeData: SousTypeTravauxItem) => {
              setSousTypeId(id);
              setSousTypeLabel(label);
              setSousType(sousTypeData);
            }}
          />
        </div>
      )}

      {sousTypeId && (
        <>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Description du travail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
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
                onChange={setUnite}
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
              onChange={setTauxTVA}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="commentaire">Commentaire</Label>
            <Textarea
              id="commentaire"
              placeholder="Commentaire ou notes supplémentaires"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="mt-1"
              rows={2}
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
