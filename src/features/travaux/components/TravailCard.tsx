
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { formaterPrix, formaterQuantite } from "@/lib/utils";
import { Travail } from '@/types';

interface TravailCardProps {
  travail: Travail;
  onEdit: (travail: Travail) => void;
  onDelete: (id: string) => void;
}

const TravailCard: React.FC<TravailCardProps> = ({ travail, onEdit, onDelete }) => {
  const total = parseFloat((travail.quantite * travail.prixUnitaire).toFixed(2));
  
  return (
    <Card className="p-3">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">
            {travail.typeTravauxLabel}: {travail.sousTypeLabel}
            {travail.personnalisation && ` (${travail.personnalisation})`}
          </p>
          <p className="text-sm text-gray-600">
            {formaterQuantite(travail.quantite)} {travail.unite} × {formaterPrix(travail.prixUnitaire)}/{travail.unite}
          </p>
          <p className="text-xs text-gray-500">
            Fournitures: {formaterPrix(travail.prixFournitures)} | Main d'œuvre: {formaterPrix(travail.prixMainOeuvre)} | TVA: {travail.tauxTVA}%
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="font-medium">{formaterPrix(total)}</p>
          <div className="flex space-x-1 mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(travail)}
              className="h-7 px-2 text-xs"
            >
              <Pencil className="h-3 w-3 mr-1" />
              Editer
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(travail.id)}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TravailCard;
