
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { Piece } from '@/types';
import { unites } from './UniteSelect';

interface TravailFormProps {
  piece: Piece | null;
  onAddTravail: (travail: any) => void;
}

const TravailForm: React.FC<TravailFormProps> = ({ piece }) => {
  const { state } = useTravauxTypes();
  
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
        <h3 className="text-lg font-medium">
          {piece?.name || piece?.type}
        </h3>
        
        {/* Type de travaux */}
        <div>
          <Label className="block text-sm font-medium mb-1">Type de travaux</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de travaux" />
            </SelectTrigger>
            <SelectContent>
              {state.types.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sous-type */}
        <div>
          <Label className="block text-sm font-medium mb-1">Prestations</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une prestation" />
            </SelectTrigger>
            <SelectContent>
              {state.types[0]?.sousTypes.map(sousType => (
                <SelectItem key={sousType.id} value={sousType.id}>
                  {sousType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TVA */}
        <div>
          <Label className="block text-sm font-medium mb-1">Taux de TVA Principal</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un taux de TVA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 %</SelectItem>
              <SelectItem value="5.5">5,5 %</SelectItem>
              <SelectItem value="20">20 %</SelectItem>
              <SelectItem value="0">0 %</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Descriptif */}
        <div>
          <Label className="block text-sm font-medium mb-1">Descriptif</Label>
          <Textarea
            placeholder="Description détaillée des travaux à réaliser"
            className="min-h-[80px] resize-y"
            disabled
          />
        </div>

        {/* Quantité */}
        <div>
          <Label className="block text-sm font-medium mb-1">Quantité à traiter</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                type="number"
                step="0.01"
                disabled
              />
            </div>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Unité" />
              </SelectTrigger>
              <SelectContent>
                {unites.map(unite => (
                  <SelectItem key={unite} value={unite}>
                    {unite}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Quantité par défaut: 0.00 M²
          </p>
        </div>

        {/* Prix fournitures */}
        <div>
          <Label className="block text-sm font-medium mb-1">Prix fournitures (M²)</Label>
          <Input
            type="number"
            step="0.01"
            disabled
          />
        </div>

        {/* Prix main d'œuvre */}
        <div>
          <Label className="block text-sm font-medium mb-1">Prix main d'œuvre (M²)</Label>
          <Input
            type="number"
            step="0.01"
            disabled
          />
        </div>

        {/* Prix unitaire total */}
        <div>
          <p className="text-sm font-medium">
            Prix unitaire total: 0,00 €/M²
          </p>
        </div>

        {/* Bouton d'ajout */}
        <Button className="w-full mt-2" disabled>
          Ajouter ce travail
        </Button>
      </div>
    </div>
  );
};

export default TravailForm;
