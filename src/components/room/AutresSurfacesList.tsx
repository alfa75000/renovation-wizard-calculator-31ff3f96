
import React from 'react';
import { AutreSurface } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash, Edit } from 'lucide-react';
import { formaterQuantite } from '@/lib/utils';

export interface AutresSurfacesListProps {
  items: AutreSurface[];
  onUpdate: (id: string, changes: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => Promise<AutreSurface> | AutreSurface;
  onDelete: (id: string) => Promise<void> | void;
}

const AutresSurfacesList: React.FC<AutresSurfacesListProps> = ({ items, onUpdate, onDelete }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune autre surface ajoutée
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {formaterQuantite(item.largeur)} × {formaterQuantite(item.hauteur)} cm
                  {item.quantity && item.quantity > 1 ? ` (×${item.quantity})` : ''}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Surface:</span> {formaterQuantite(item.surface)} m²
                  {item.estDeduction ? ' (à déduire)' : ' (à ajouter)'}
                </div>
                <div className="text-xs text-gray-500">
                  Impact: {item.surfaceImpactee || 'Non spécifié'}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AutresSurfacesList;
