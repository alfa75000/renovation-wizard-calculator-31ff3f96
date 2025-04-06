
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
            disabled
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
                disabled
              />
              <UniteSelect 
                value={unite}
                onChange={setUnite}
                disabled
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
              label="Taux de TVA"
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
              disabled
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
              disabled
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
          disabled
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
