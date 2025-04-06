
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { Piece, Travail } from '@/types';
import { unites } from './UniteSelect';
import UniteSelect from './UniteSelect';
import TypeTravauxSelect from './TypeTravauxSelect';
import SousTypeSelect from './SousTypeSelect';
import TvaSelect from './TvaSelect';
import { Separator } from '@/components/ui/separator';
import { formaterPrix } from '@/lib/utils';

interface TravailFormProps {
  piece: Piece | null;
  onAddTravail: (travail: Omit<Travail, 'id'>) => void;
  travailAModifier: Travail | null;
}

const TravailForm: React.FC<TravailFormProps> = ({ piece, onAddTravail, travailAModifier }) => {
  const { state } = useTravauxTypes();
  
  const [typeTravaux, setTypeTravaux] = useState<string | null>(travailAModifier?.typeTravaux || null);
  const [sousType, setSousType] = useState<string | null>(travailAModifier?.sousType || null);
  const [tauxTVAPrincipal, setTauxTVAPrincipal] = useState<number>(10);
  const [autreTauxTVAPrincipal, setAutreTauxTVAPrincipal] = useState<number>(0);
  const [tauxTVA, setTauxTVA] = useState<number>(10);
  const [autreTauxTVA, setAutreTauxTVA] = useState<number>(0);
  const [descriptif, setDescriptif] = useState<string>(travailAModifier?.personnalisation || '');
  const [quantite, setQuantite] = useState<number>(travailAModifier?.quantite || 0);
  const [unite, setUnite] = useState<string>(travailAModifier?.unite || 'M²');
  const [prixFournitures, setPrixFournitures] = useState<number>(travailAModifier?.prixFournitures || 0);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number>(travailAModifier?.prixMainOeuvre || 0);
  
  // Mettre à jour le tauxTVA lorsque le tauxTVAPrincipal change (seulement si pas encore modifié)
  useEffect(() => {
    setTauxTVA(tauxTVAPrincipal);
    setAutreTauxTVA(autreTauxTVAPrincipal);
  }, [tauxTVAPrincipal, autreTauxTVAPrincipal]);

  // Mettre à jour les champs lorsque travailAModifier change
  useEffect(() => {
    if (travailAModifier) {
      setTypeTravaux(travailAModifier.typeTravaux);
      setSousType(travailAModifier.sousType);
      setTauxTVA(travailAModifier.tauxTVA);
      setDescriptif(travailAModifier.personnalisation || '');
      setQuantite(travailAModifier.quantite);
      setUnite(travailAModifier.unite);
      setPrixFournitures(travailAModifier.prixFournitures);
      setPrixMainOeuvre(travailAModifier.prixMainOeuvre);
    }
  }, [travailAModifier]);

  // Mettre à jour les prix et l'unité quand le sous-type change
  useEffect(() => {
    if (sousType) {
      // Trouver le sous-type sélectionné
      const selectedSousType = state.types
        .flatMap(t => t.sousTypes)
        .find(st => st.id === sousType);
      
      if (selectedSousType) {
        // S'assurer que nous avons toujours les deux composantes de prix
        const prixFourn = selectedSousType.prixFournitures !== undefined ? 
          selectedSousType.prixFournitures : selectedSousType.prixUnitaire / 2;
        const prixMO = selectedSousType.prixMainOeuvre !== undefined ? 
          selectedSousType.prixMainOeuvre : selectedSousType.prixUnitaire / 2;
        
        setPrixFournitures(prixFourn);
        setPrixMainOeuvre(prixMO);
        setUnite(selectedSousType.unite || 'M²');
        
        // Si nous ne sommes pas en train de modifier un travail existant ou si c'est un nouveau sous-type
        if (!travailAModifier || travailAModifier.sousType !== sousType) {
          // Calculer automatiquement la quantité en fonction de la surface de référence
          if (piece && selectedSousType.surfaceReference) {
            const referenceValue = getValueFromReference(piece, selectedSousType.surfaceReference);
            if (referenceValue && !isNaN(parseFloat(referenceValue))) {
              setQuantite(parseFloat(referenceValue));
            } else {
              setQuantite(1); // Valeur par défaut si aucune référence n'est trouvée
            }
          } else {
            setQuantite(1); // Valeur par défaut si pas de surface de référence
          }
          
          // Si le sousType a une description par défaut, on l'utilise
          if (selectedSousType.description) {
            setDescriptif(selectedSousType.description);
          }
        }
      }
    }
  }, [sousType, state.types, piece, travailAModifier]);

  // Fonction pour obtenir la valeur à partir de la référence
  const getValueFromReference = (piece: Piece, reference: string): string | undefined => {
    switch (reference) {
      case 'SurfaceNetteSol':
        return piece.surfaceNetteSol || piece.surface;
      case 'SurfaceNettePlafond':
        return piece.surfaceNettePlafond || piece.surface;
      case 'SurfaceNetteMurs':
        return piece.surfaceNetteMurs;
      case 'LineaireNet':
        return piece.lineaireNet;
      case 'SurfaceMenuiseries':
        return piece.surfaceMenuiseries;
      case 'Unite':
        return '1';
      case 'Forfait':
        return '1';
      default:
        return '1';
    }
  };

  // Calculer le prix unitaire total
  const prixUnitaireTotal = prixFournitures + prixMainOeuvre;
  
  // Trouver les labels pour les types et sous-types
  const typeTravauxLabel = state.types.find(t => t.id === typeTravaux)?.label || '';
  const sousTypeObj = state.types.flatMap(t => t.sousTypes).find(st => st.id === sousType);
  const sousTypeLabel = sousTypeObj?.label || '';
  
  if (!piece) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Veuillez sélectionner une pièce pour commencer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">
            Ajouter ou modifier un travail
          </h3>
          
          {/* Taux de TVA Principal en haut à droite */}
          <div className="w-1/3">
            <TvaSelect
              value={tauxTVAPrincipal}
              autreValue={autreTauxTVAPrincipal}
              onValueChange={setTauxTVAPrincipal}
              onAutreValueChange={setAutreTauxTVAPrincipal}
              label="Taux de TVA Principal"
            />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Nom de la pièce */}
        <div>
          <Label className="block text-sm font-medium mb-1">Pièce</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {piece?.name || piece?.type}
          </div>
        </div>
        
        {/* Type de travaux */}
        <div>
          <TypeTravauxSelect 
            value={typeTravaux} 
            onChange={setTypeTravaux} 
          />
        </div>

        {/* Sous-type */}
        <div>
          <SousTypeSelect 
            typeTravauxId={typeTravaux} 
            value={sousType} 
            onChange={setSousType} 
          />
        </div>

        {/* Descriptif */}
        <div>
          <Label className="block text-sm font-medium mb-1">Descriptif</Label>
          <Textarea
            value={descriptif}
            onChange={(e) => setDescriptif(e.target.value)}
            placeholder="Description détaillée des travaux à réaliser"
            className="min-h-[80px] resize-y"
          />
        </div>

        {/* Quantité et TVA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Quantité à traiter</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                step="0.01"
                value={quantite}
                onChange={(e) => setQuantite(parseFloat(e.target.value) || 0)}
              />
              <UniteSelect 
                value={unite}
                onChange={setUnite}
              />
            </div>
          </div>
          
          {/* Taux de TVA spécifique */}
          <div className="space-y-2">
            <TvaSelect
              value={tauxTVA}
              autreValue={autreTauxTVA}
              onValueChange={setTauxTVA}
              onAutreValueChange={setAutreTauxTVA}
            />
          </div>
        </div>

        {/* Prix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prix fournitures */}
          <div>
            <Label className="block text-sm font-medium mb-1">Prix fournitures ({unite})</Label>
            <Input
              type="number"
              step="0.01"
              value={prixFournitures}
              onChange={(e) => setPrixFournitures(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Prix main d'œuvre */}
          <div>
            <Label className="block text-sm font-medium mb-1">Prix main d'œuvre ({unite})</Label>
            <Input
              type="number"
              step="0.01"
              value={prixMainOeuvre}
              onChange={(e) => setPrixMainOeuvre(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Prix unitaire total */}
          <div className="flex items-end">
            <p className="text-sm font-medium p-2 border rounded-md bg-gray-50 w-full">
              Prix unitaire total: {formaterPrix(prixUnitaireTotal)}/{unite}
            </p>
          </div>
        </div>

        {/* Bouton d'ajout */}
        <Button 
          className="w-full mt-4"
          onClick={() => {
            if (!typeTravaux || !sousType || !piece?.id) return;
            
            onAddTravail({
              pieceId: piece.id,
              typeTravaux,
              typeTravauxLabel,
              sousType,
              sousTypeLabel,
              quantite,
              unite,
              tauxTVA,
              prixUnitaire: prixUnitaireTotal,
              prixFournitures,
              prixMainOeuvre,
              personnalisation: descriptif
            });
          }}
        >
          {travailAModifier ? 'Modifier ce travail' : 'Ajouter ce travail'}
        </Button>
      </div>
    </div>
  );
};

export default TravailForm;
