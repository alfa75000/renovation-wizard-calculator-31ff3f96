
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formaterPrix } from "@/lib/utils";
import { Plus, Save, X } from "lucide-react";
import { Piece, Travail } from '@/types';
import TypeTravauxSelect from './TypeTravauxSelect';
import SousTypeSelect from './SousTypeSelect';
import TvaSelect from './TvaSelect';
import UniteSelect from './UniteSelect';
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { useTravaux } from '../hooks/useTravaux';

interface TravailFormProps {
  piece: Piece | null;
  onAddTravail: (travail: Omit<Travail, 'id'>) => void;
}

const TravailForm: React.FC<TravailFormProps> = ({ piece, onAddTravail }) => {
  const [typeTravauxSelectionne, setTypeTravauxSelectionne] = useState<string | null>(null);
  const [sousTypeSelectionne, setSousTypeSelectionne] = useState<string | null>(null);
  const [descriptif, setDescriptif] = useState("");
  const [quantiteModifiee, setQuantiteModifiee] = useState<number | null>(null);
  const [uniteSelectionnee, setUniteSelectionnee] = useState<string | null>(null);
  const [prixFournitures, setPrixFournitures] = useState<number | null>(null);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number | null>(null);
  const [tauxTVASelectionne, setTauxTVASelectionne] = useState<number>(10);
  const [tauxTVAAutre, setTauxTVAAutre] = useState<number>(0);
  const { state } = useTravauxTypes();
  const { travailAModifier, resetTravailAModifier } = useTravaux();
  
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Effet pour charger les données du travail à modifier
  useEffect(() => {
    if (travailAModifier && piece) {
      console.log("Chargement du travail pour édition:", travailAModifier);
      if (travailAModifier.pieceId === piece.id) {
        // Mettre à jour tous les champs du formulaire avec les données du travail
        setTypeTravauxSelectionne(travailAModifier.typeTravaux);
        setSousTypeSelectionne(travailAModifier.sousType);
        setDescriptif(travailAModifier.personnalisation || "");
        setQuantiteModifiee(travailAModifier.quantite);
        setUniteSelectionnee(travailAModifier.unite);
        setPrixFournitures(travailAModifier.prixFournitures);
        setPrixMainOeuvre(travailAModifier.prixMainOeuvre);
        setTauxTVASelectionne(travailAModifier.tauxTVA);
        setIsEditing(true);
      }
    } else {
      // Réinitialiser le formulaire si on n'est pas en mode édition
      setIsEditing(false);
    }
  }, [travailAModifier, piece]);

  // Effet pour réinitialiser le formulaire quand on change de pièce et qu'on n'est pas en mode édition
  useEffect(() => {
    if (!isEditing) {
      setTypeTravauxSelectionne(null);
      setSousTypeSelectionne(null);
      setDescriptif("");
      setQuantiteModifiee(null);
      setUniteSelectionnee(null);
      setPrixFournitures(null);
      setPrixMainOeuvre(null);
    }
  }, [piece, isEditing]);

  // Effet pour mettre à jour les valeurs par défaut quand on change de type ou de sous-type
  useEffect(() => {
    if (!isEditing && typeTravauxSelectionne && sousTypeSelectionne) {
      // Récupérer les valeurs par défaut pour le sous-type sélectionné
      const typeFromContext = state.types.find(type => type.id === typeTravauxSelectionne);
      const sousTypeFromContext = typeFromContext?.sousTypes.find(st => st.id === sousTypeSelectionne);
      
      if (sousTypeFromContext) {
        setUniteSelectionnee(sousTypeFromContext.unite || null);
        
        if (sousTypeFromContext.description) {
          setDescriptif(sousTypeFromContext.description);
        } else {
          setDescriptif("");
        }
      } else {
        setUniteSelectionnee(null);
        setDescriptif("");
      }

      setPrixFournitures(null);
      setPrixMainOeuvre(null);
      setQuantiteModifiee(null);
    }
  }, [typeTravauxSelectionne, sousTypeSelectionne, state.types, isEditing]);

  // Fonction pour obtenir la quantité par défaut en fonction du type de travaux et de la pièce
  const getQuantiteParDefaut = () => {
    if (!piece || !typeTravauxSelectionne) return 0;

    switch (typeTravauxSelectionne) {
      case "murs":
        return parseFloat(piece.surfaceNetteMurs || '0');
      case "plafond":
        return parseFloat(piece.surface || '0');
      case "sol":
        return parseFloat(piece.surface || '0');
      case "menuiseries":
        return parseFloat(piece.surfaceMenuiseries || '0');
      default:
        return 1;
    }
  };

  // Fonction pour obtenir l'unité par défaut en fonction du type et du sous-type
  const getUniteParDefaut = () => {
    if (!typeTravauxSelectionne || !sousTypeSelectionne) return "M²";

    const typeFromContext = state.types.find(type => type.id === typeTravauxSelectionne);
    const sousTypeFromContext = typeFromContext?.sousTypes.find(st => st.id === sousTypeSelectionne);
    
    if (sousTypeFromContext) {
      return sousTypeFromContext.unite || "M²";
    }
    
    return "M²";
  };

  // Fonction pour annuler l'édition
  const annulerEdition = () => {
    console.log("Annulation de l'édition");
    setIsEditing(false);
    resetTravailAModifier();
    setTypeTravauxSelectionne(null);
    setSousTypeSelectionne(null);
    setDescriptif("");
    setQuantiteModifiee(null);
    setUniteSelectionnee(null);
    setPrixFournitures(null);
    setPrixMainOeuvre(null);
    setTauxTVASelectionne(10);
    setTauxTVAAutre(0);
  };

  // Fonction pour ajouter ou mettre à jour un travail
  const handleAddTravail = () => {
    if (!piece || !typeTravauxSelectionne || !sousTypeSelectionne) {
      return;
    }

    const typeTravauxObj = state.types.find(t => t.id === typeTravauxSelectionne);
    const sousTypeFromContext = typeTravauxObj?.sousTypes.find(st => st.id === sousTypeSelectionne);
    
    if (!sousTypeFromContext || !typeTravauxObj) return;

    const typeTravauxLabel = typeTravauxObj.label;
    
    const quantite = quantiteModifiee !== null ? quantiteModifiee : getQuantiteParDefaut();
    const unite = uniteSelectionnee || getUniteParDefaut();

    const prixFournituresDefaut = (prixFournitures !== null) 
      ? prixFournitures 
      : (sousTypeFromContext.prixFournitures !== undefined 
          ? sousTypeFromContext.prixFournitures 
          : sousTypeFromContext.prixUnitaire * 0.4);
    
    const prixMainOeuvreDefaut = (prixMainOeuvre !== null) 
      ? prixMainOeuvre 
      : (sousTypeFromContext.prixMainOeuvre !== undefined 
          ? sousTypeFromContext.prixMainOeuvre 
          : sousTypeFromContext.prixUnitaire * 0.6);

    let tauxFinal = tauxTVASelectionne;
    if (tauxTVASelectionne === 0 && tauxTVAAutre > 0) {
      tauxFinal = tauxTVAAutre;
    }

    console.log("Soumission du travail, mode édition:", isEditing);
    
    onAddTravail({
      pieceId: piece.id,
      typeTravaux: typeTravauxSelectionne,
      typeTravauxLabel,
      sousType: sousTypeSelectionne,
      sousTypeLabel: sousTypeFromContext.label,
      personnalisation: descriptif,
      quantite: Number(quantite.toFixed(2)),
      unite,
      prixFournitures: Number(prixFournituresDefaut.toFixed(2)),
      prixMainOeuvre: Number(prixMainOeuvreDefaut.toFixed(2)),
      prixUnitaire: Number((prixFournituresDefaut + prixMainOeuvreDefaut).toFixed(2)),
      tauxTVA: Number(tauxFinal.toFixed(2))
    });

    annulerEdition();
  };

  if (!piece) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Veuillez sélectionner une pièce pour commencer</p>
      </div>
    );
  }

  // Rendu du formulaire
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {piece?.name || piece?.type}
        </h3>
        {isEditing && (
          <Button onClick={annulerEdition} variant="outline" size="sm" className="flex items-center">
            <X className="h-4 w-4 mr-2" />
            Annuler l'édition
          </Button>
        )}
      </div>

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
          <label className="block text-sm font-medium mb-1">Descriptif</label>
          <Textarea
            value={descriptif}
            onChange={(e) => setDescriptif(e.target.value)}
            placeholder="Description détaillée des travaux à réaliser"
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
                getPrixFournituresFromSelectedType()}
              onChange={(e) => setPrixFournitures(parseFloat(e.target.value) || 0)}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prix main d'œuvre ({getUniteParDefaut()})</label>
            <Input
              type="number"
              value={prixMainOeuvre !== null ? prixMainOeuvre : 
                getPrixMainOeuvreFromSelectedType()}
              onChange={(e) => setPrixMainOeuvre(parseFloat(e.target.value) || 0)}
              step="0.01"
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              Prix unitaire total: {formaterPrix(
                (prixFournitures !== null ? prixFournitures : getPrixFournituresFromSelectedType()) + 
                (prixMainOeuvre !== null ? prixMainOeuvre : getPrixMainOeuvreFromSelectedType())
              )}/{getUniteParDefaut()}
            </p>
          </div>
        </>
      )}

      {sousTypeSelectionne && (
        <Button onClick={handleAddTravail} className="w-full mt-2">
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-1" />
              Enregistrer les modifications
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter ce travail
            </>
          )}
        </Button>
      )}
    </div>
  );

  function getPrixUnitaireFromSelectedType() {
    if (!typeTravauxSelectionne || !sousTypeSelectionne) return 0;
    
    const typeFromContext = state.types.find(type => type.id === typeTravauxSelectionne);
    const sousTypeFromContext = typeFromContext?.sousTypes.find(st => st.id === sousTypeSelectionne);
    
    if (sousTypeFromContext) {
      return sousTypeFromContext.prixUnitaire || 0;
    }
    
    return 0;
  }
  
  function getPrixFournituresFromSelectedType() {
    if (!typeTravauxSelectionne || !sousTypeSelectionne) return 0;
    
    const typeFromContext = state.types.find(type => type.id === typeTravauxSelectionne);
    const sousTypeFromContext = typeFromContext?.sousTypes.find(st => st.id === sousTypeSelectionne);
    
    if (sousTypeFromContext) {
      return sousTypeFromContext.prixFournitures !== undefined 
        ? sousTypeFromContext.prixFournitures 
        : sousTypeFromContext.prixUnitaire * 0.4;
    }
    
    return 0;
  }
  
  function getPrixMainOeuvreFromSelectedType() {
    if (!typeTravauxSelectionne || !sousTypeSelectionne) return 0;
    
    const typeFromContext = state.types.find(type => type.id === typeTravauxSelectionne);
    const sousTypeFromContext = typeFromContext?.sousTypes.find(st => st.id === sousTypeSelectionne);
    
    if (sousTypeFromContext) {
      return sousTypeFromContext.prixMainOeuvre !== undefined 
        ? sousTypeFromContext.prixMainOeuvre 
        : sousTypeFromContext.prixUnitaire * 0.6;
    }
    
    return 0;
  }
};

export default TravailForm;
