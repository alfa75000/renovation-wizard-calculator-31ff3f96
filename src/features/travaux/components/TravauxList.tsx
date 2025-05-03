
import React from 'react';
import { useTravaux } from '../hooks/useTravaux';
import TravailCard from './TravailCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Travail } from '@/types';

interface TravauxListProps {
  pieceId: string;
  onStartEdit: (id: string) => void; // Signature corrigée
}

const TravauxList: React.FC<TravauxListProps> = ({ pieceId, onStartEdit }) => {
  const { getTravauxForPiece, deleteTravail } = useTravaux();
  const { toast } = useToast();
  
  const travaux = getTravauxForPiece(pieceId);
  
  const handleDelete = (id: string) => {
    deleteTravail(id);
    toast({
      title: "Travail supprimé",
      description: "Le travail a été supprimé avec succès",
      variant: "default",
    });
  };
  
  const handleEdit = (travail: Travail) => {
    console.log("Édition du travail:", travail);
    onStartEdit(travail.id); // Appel avec l'ID
  };
  
  if (travaux.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 mb-4">Aucun travail n'a été ajouté pour cette pièce.</p>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter des travaux
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {travaux.map(travail => (
        <TravailCard 
          key={travail.id}
          travail={travail}
          onDelete={() => handleDelete(travail.id)}
          onEdit={() => handleEdit(travail)}
        />
      ))}
      
      <div className="mt-6">
        <p className="font-medium mb-2">Total estimé pour cette pièce:</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Fournitures</p>
            <p className="font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                travaux.reduce((sum, t) => sum + t.prixFournitures * t.quantite, 0)
              )}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Main d'œuvre</p>
            <p className="font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                travaux.reduce((sum, t) => sum + t.prixMainOeuvre * t.quantite, 0)
              )}
            </p>
          </div>
        </div>
        <div className="bg-blue-50 p-3 mt-2 rounded-md">
          <p className="text-sm text-blue-700">Total TTC</p>
          <p className="font-bold text-lg">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
              travaux.reduce((sum, t) => {
                const prixHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
                const prixTTC = prixHT * (1 + t.tauxTVA / 100);
                return sum + prixTTC;
              }, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravauxList;
