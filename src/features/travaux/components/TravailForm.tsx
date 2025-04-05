
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formaterPrix } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Piece, Travail } from '@/types';
import TypeTravauxSelect from './TypeTravauxSelect';
import SousTypeSelect, { sousTravaux } from './SousTypeSelect';
import TvaSelect from './TvaSelect';
import UniteSelect from './UniteSelect';

interface TravailFormProps {
  piece: Piece | null;
  onAddTravail: (travail: Omit<Travail, 'id'>) => void;
}

const TravailForm: React.FC<TravailFormProps> = ({ piece, onAddTravail }) => {
  const [typeTravauxSelectionne, setTypeTravauxSelectionne] = useState<string | null>(null);
  const [sousTypeSelectionne, setSousTypeSelectionne] = useState<string | null>(null);
  const [personnalisation, setPersonnalisation] = useState("");
  const [quantiteModifiee, setQuantiteModifiee] = useState<number | null>(null);
  const [uniteSelectionnee, setUniteSelectionnee] = useState<string | null>(null);
  const [prixFournitures, setPrixFournitures] = useState<number | null>(null);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number | null>(null);
  const [tauxTVASelectionne, setTauxTVASelectionne] = useState<number>(10);
  const [tauxTVAAutre, setTauxTVAAutre] = useState<number>(0);

  // Réinitialiser le formulaire quand on change de pièce
  useEffect(() => {
    setTypeTravauxSelectionne(null);
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setQuantiteModifiee(null);
    setUniteSelectionnee(null);
    setPrixFournitures(null);
    setPrixMainOeuvre(null);
  }, [piece]);

  // Mettre à jour l'unité quand on change de sous-type
  useEffect(() => {
    if (typeTravauxSelectionne && sousTypeSelectionne) {
      const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(
        st => st.id === sousTypeSelectionne
      );
      setUniteSelectionnee(sousType?.unite || null);

      // Reset prix when changing sous-type
      setPrixFournitures(null);
      setPrixMainOeuvre(null);
      
      // Reset quantity to default based on new sous-type
      setQuantiteModifiee(null);
    }
  }, [typeTravauxSelectionne, sousTypeSelectionne]);

  const getQuantiteParDefaut = () => {
    if (!piece || !typeTravauxSelectionne) return 0;

    switch (typeTravauxSelectionne) {
      case "murs":
        return piece.surfaceNetMurs || 0;
      case "plafond":
        return piece.surface || 0;
      case "sol":
        return piece.surface || 0;
      case "menuiseries":
        return piece.surfaceMenuiseries || 0;
      default:
        return 1;
    }
  };

  const getUniteParDefaut = () => {
    if (!typeTravauxSelectionne || !sousTypeSelectionne) return "M²";

    const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(
      st => st.id === sousTypeSelectionne
    );
    
    return sousType?.unite || "M²";
  };

  const handleAddTravail = () => {
    if (!piece || !typeTravauxSelectionne || !sousTypeSelectionne) {
      return;
    }

    const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux].find(st => st.id === sousTypeSelectionne);
    if (!sousType) return;

    const typeTravauxObj = travauxTypes.find(t => t.id === typeTravauxSelectionne);
    if (!typeTravauxObj) return;

    const quantite = quantiteModifiee !== null ? quantiteModifiee : getQuantiteParDefaut();
    const unite = uniteSelectionnee || getUniteParDefaut();

    const prixFournituresDefaut = (prixFournitures !== null) 
      ? prixFournitures 
      : (sousType.prixUnitaire * 0.4);
    
    const prixMainOeuvreDefaut = (prixMainOeuvre !== null) 
      ? prixMainOeuvre 
      : (sousType.prixUnitaire * 0.6);

    let tauxFinal = tauxTVASelectionne;
    if (tauxTVASelectionne === 0 && tauxTVAAutre > 0) {
      tauxFinal = tauxTVAAutre;
    }

    onAddTravail({
      pieceId: Number(piece.id),
      pieceName: piece.nom || piece.name || "Pièce sans nom",
      typeTravauxId: typeTravauxSelectionne,
      typeTravauxLabel: typeTravauxObj.label,
      sousTypeId: sousTypeSelectionne,
      sousTypeLabel: sousType.label,
      personnalisation: personnalisation,
      quantite: Number(quantite.toFixed(2)),
      unite,
      prixFournitures: Number(prixFournituresDefaut.toFixed(2)),
      prixMainOeuvre: Number(prixMainOeuvreDefaut.toFixed(2)),
      prixUnitaire: Number((prixFournituresDefaut + prixMainOeuvreDefaut).toFixed(2)),
      tauxTVA: Number(tauxFinal.toFixed(2))
    });

    // Réinitialiser le formulaire mais garder le type de travaux sélectionné
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setQuantiteModifiee(null);
    setUniteSelectionnee(null);
    setPrixFournitures(null);
    setPrixMainOeuvre(null);
  };

  // Liste des types de travaux pour l'affichage
  const travauxTypes = [
    { id: "murs", label: "Revêtement murs" },
    { id: "plafond", label: "Revêtement plafond" },
    { id: "sol", label: "Revêtement sol" },
    { id: "menuiseries", label: "Menuiseries" },
    { id: "electricite", label: "Electricité" },
    { id: "plomberie", label: "Plomberie" },
    { id: "platrerie", label: "Plâtrerie" },
    { id: "maconnerie", label: "Maçonnerie" },
    { id: "autre", label: "Autre" }
  ];

  if (!piece) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Veuillez sélectionner une pièce pour commencer</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">
        {piece.nom || piece.name}
      </h3>

      <TypeTravauxSelect 
        value={typeTravauxSelectionne} 
        onChange={setTypeTravauxSelectionne}
      />

      {typeTravauxSelectionne && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SousTypeSelect 
            typeTravauxId={typeTravauxSelectionne}
            value={sousTypeSelectionne}
            onChange={setSousTypeSelectionne}
          />

          <TvaSelect 
            value={tauxTVASelectionne}
            autreValue={tauxTVAAutre}
            onValueChange={setTauxTVASelectionne}
            onAutreValueChange={setTauxTVAAutre}
          />
        </div>
      )}

      {sousTypeSelectionne && (
        <div>
          <label className="block text-sm font-medium mb-1">Personnalisation</label>
          <Textarea
            value={personnalisation}
            onChange={(e) => setPersonnalisation(e.target.value)}
            placeholder="Précisez le type de travaux si nécessaire"
            className="min-h-[80px] resize-y"
          />
        </div>
      )}

      {sousTypeSelectionne && (
        <div>
          <label className="block text-sm font-medium mb-1">Quantité à traiter</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                type="number"
                value={quantiteModifiee !== null ? quantiteModifiee : getQuantiteParDefaut()}
                onChange={(e) => setQuantiteModifiee(parseFloat(e.target.value) || 0)}
                step="0.01"
              />
            </div>
            <UniteSelect 
              value={uniteSelectionnee} 
              onChange={setUniteSelectionnee}
              defaultValue={getUniteParDefaut()}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Quantité par défaut: {getQuantiteParDefaut().toFixed(2)} {getUniteParDefaut()}
          </p>
        </div>
      )}

      {sousTypeSelectionne && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Prix fournitures ({getUniteParDefaut()})</label>
            <Input
              type="number"
              value={prixFournitures !== null ? prixFournitures : 
                (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.4}
              onChange={(e) => setPrixFournitures(parseFloat(e.target.value) || 0)}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prix main d'œuvre ({getUniteParDefaut()})</label>
            <Input
              type="number"
              value={prixMainOeuvre !== null ? prixMainOeuvre : 
                (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.6}
              onChange={(e) => setPrixMainOeuvre(parseFloat(e.target.value) || 0)}
              step="0.01"
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              Prix unitaire total: {formaterPrix(
                (prixFournitures !== null ? prixFournitures : 
                  (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.4) + 
                (prixMainOeuvre !== null ? prixMainOeuvre : 
                  (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.6)
              )}/{getUniteParDefaut()}
            </p>
          </div>
        </>
      )}

      {sousTypeSelectionne && (
        <Button onClick={handleAddTravail} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter ce travail
        </Button>
      )}
    </div>
  );
};

export default TravailForm;
