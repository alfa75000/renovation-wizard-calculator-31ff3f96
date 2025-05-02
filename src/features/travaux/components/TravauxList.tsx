import React, { useState } from 'react';
import { useTravaux } from '../hooks/useTravaux';
import TravailCard from './TravailCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Travail } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface TravauxListProps {
  pieceId: string;
  onStartEdit: (id: string) => void;
}

const TravauxList: React.FC<TravauxListProps> = ({ pieceId, onStartEdit }) => {
  const { getTravauxForPiece, deleteTravail } = useTravaux();
  const { toast } = useToast();
  const { state } = useProject();
  const [filterType, setFilterType] = useState<string>('piece');
  
  // Récupérer la pièce actuelle
  const currentRoom = state.rooms.find(room => room.id === pieceId);
  
  // Récupérer tous les travaux pour cette pièce
  const travaux = getTravauxForPiece(pieceId);
  
  // Filtrer les travaux en fonction de la sélection
  const filteredTravaux = React.useMemo(() => {
    if (filterType === 'piece' || !filterType) {
      return travaux;
    } else if (filterType === 'plinthes') {
      return travaux.filter(travail => 
        travail.description?.toLowerCase().includes('plinthe') || 
        travail.typeTravaux?.toLowerCase().includes('plinthe')
      );
    } else {
      // Pour les menuiseries et autres surfaces, on vérifie si l'ID correspond
      return travaux.filter(travail => 
        travail.menuiserieId === filterType || 
        travail.surfaceImpactee === filterType
      );
    }
  }, [travaux, filterType]);
  
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
    onStartEdit(travail.id);
  };

  // Générer les options pour le Select
  const generateFilterOptions = () => {
    const options = [];
    
    // Option par défaut: nom de la pièce
    options.push({
      id: 'piece',
      label: currentRoom?.name || 'Tous les travaux',
    });
    
    // Option plinthes
    options.push({
      id: 'plinthes',
      label: 'Plinthes',
    });
    
    // Ajouter les menuiseries de la pièce
    if (currentRoom?.menuiseries) {
      currentRoom.menuiseries.forEach(menuiserie => {
        options.push({
          id: menuiserie.id,
          label: `Menuiserie: ${menuiserie.name}`,
        });
      });
    }
    
    // Ajouter les autres surfaces de la pièce
    if (currentRoom?.autresSurfaces) {
      currentRoom.autresSurfaces.forEach(surface => {
        options.push({
          id: surface.id,
          label: `Surface: ${surface.name}`,
        });
      });
    }
    
    return options;
  };
  
  const filterOptions = generateFilterOptions();
  
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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <Button variant="outline" className="flex items-center gap-2 mb-4">
          <PlusCircle className="h-4 w-4" />
          Ajouter des travaux
        </Button>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredTravaux.length > 0 ? (
        filteredTravaux.map(travail => (
          <TravailCard 
            key={travail.id}
            travail={travail}
            onDelete={() => handleDelete(travail.id)}
            onEdit={() => handleEdit(travail)}
          />
        ))
      ) : (
        <div className="text-center py-6 border rounded-md bg-gray-50">
          <p className="text-gray-500">Aucun travail trouvé pour ce filtre.</p>
        </div>
      )}
      
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
