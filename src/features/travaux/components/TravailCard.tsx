
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { formatCurrency } from '@/lib/utils';
import { Travail } from '@/types';

interface TravailCardProps {
  travail: Travail;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TravailCard: React.FC<TravailCardProps> = ({ travail, onEdit, onDelete }) => {
  const totalHT = travail.quantity * (travail.laborPrice + travail.supplyPrice);
  const totalTTC = totalHT * (1 + travail.tva / 100);

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="text-lg font-medium">{travail.name}</CardTitle>
        {travail.description && (
          <p className="text-sm text-gray-600 mt-1">{travail.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Quantité:</p>
            <p>{travail.quantity} {travail.unit || 'm²'}</p>
          </div>
          <div>
            <p className="text-gray-500">Prix unitaire:</p>
            <p>{formatCurrency(travail.laborPrice + travail.supplyPrice)}</p>
          </div>
          <div>
            <p className="text-gray-500">TVA:</p>
            <p>{travail.tva}%</p>
          </div>
          <div>
            <p className="text-gray-500">Surface impactée:</p>
            <p>{travail.surfaceImpactee || 'Aucune'}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between font-semibold">
            <span>Total HT</span>
            <span>{formatCurrency(totalHT)}</span>
          </div>
          <div className="flex justify-between font-bold text-blue-600 mt-1">
            <span>Total TTC</span>
            <span>{formatCurrency(totalTTC)}</span>
          </div>
        </div>
      </CardContent>
      
      {(onEdit || onDelete) && (
        <CardFooter className="bg-slate-50 flex justify-end gap-2 pt-2 pb-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(travail.id)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700" 
              onClick={() => onDelete(travail.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TravailCard;
