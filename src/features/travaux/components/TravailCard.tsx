
import React from 'react';
import { Travail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { formaterPrix } from '@/lib/utils';
import { useProject } from '@/contexts/ProjectContext';

interface TravailCardProps {
  travail: Travail;
  onDelete: () => void;
  onEdit: () => void;
}

const TravailCard: React.FC<TravailCardProps> = ({ travail, onDelete, onEdit }) => {
  const { state } = useProject();
  
  // Récupérer la pièce correspondante pour les détails supplémentaires
  const piece = state.rooms.find(room => room.id === travail.pieceId);
  
  // Récupérer la menuiserie si elle est référencée
  const menuiserie = travail.menuiserieId ? 
    piece?.menuiseries.find(m => m.id === travail.menuiserieId) : 
    undefined;
  
  const totalHT = (travail.prixFournitures + travail.prixMainOeuvre) * travail.quantite;
  const totalTTC = totalHT * (1 + travail.tauxTVA / 100);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">
              {travail.typeTravauxLabel}: {travail.sousTypeLabel}
            </CardTitle>
            {menuiserie && (
              <div className="text-sm text-blue-600 font-medium mt-1">
                Menuiserie: {menuiserie.name} ({menuiserie.type}) - {menuiserie.surface.toFixed(2)} m²
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {travail.personnalisation && (
          <p className="text-sm text-gray-600 mb-3">{travail.personnalisation}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Quantité</p>
            <p className="font-medium">{travail.quantite} {travail.unite}</p>
          </div>
          <div>
            <p className="text-gray-500">Prix unitaire</p>
            <p className="font-medium">{formaterPrix(travail.prixFournitures + travail.prixMainOeuvre)}/{travail.unite}</p>
          </div>
          <div>
            <p className="text-gray-500">Fournitures</p>
            <p className="font-medium">{formaterPrix(travail.prixFournitures * travail.quantite)}</p>
          </div>
          <div>
            <p className="text-gray-500">Main d'œuvre</p>
            <p className="font-medium">{formaterPrix(travail.prixMainOeuvre * travail.quantite)}</p>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-50 p-3 rounded-md flex justify-between items-center">
          <div>
            <p className="text-xs text-blue-600">TVA {travail.tauxTVA}%</p>
            <p className="font-bold">{formaterPrix(totalTTC)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">HT</p>
            <p className="text-sm">{formaterPrix(totalHT)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravailCard;
