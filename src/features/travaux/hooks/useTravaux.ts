
import { useState } from 'react';
import { toast } from 'sonner';
import { useCatalogueTravauxMock } from './useCatalogueTravauxMock';

export const useTravaux = () => {
  const { data: catalogueData, isLoading } = useCatalogueTravauxMock();
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [selectedSousTypeId, setSelectedSousTypeId] = useState<string | null>(null);
  const [selectedTravauxIds, setSelectedTravauxIds] = useState<string[]>([]);

  const handleAddTravail = (id: string) => {
    if (selectedTravauxIds.includes(id)) {
      toast.info("Ce travail est déjà ajouté à la pièce.");
      return;
    }
    
    setSelectedTravauxIds(prev => [...prev, id]);
    toast({
      title: "Travail ajouté",
      description: "Le travail a été ajouté à la pièce."
    });
  };

  const handleRemoveTravail = (id: string) => {
    setSelectedTravauxIds(prev => prev.filter(travailId => travailId !== id));
    toast({
      title: "Travail supprimé",
      description: "Le travail a été supprimé de la pièce."
    });
  };

  const handleResetTravaux = () => {
    setSelectedTravauxIds([]);
    toast({
      title: "Travaux réinitialisés",
      description: "Tous les travaux ont été supprimés de la pièce."
    });
  };

  // Reste de la logique métier pour gérer les travaux

  return {
    travauxTypes: catalogueData?.typesTravauxList || [],
    selectedTypeId,
    selectedSousTypeId,
    selectedTravauxIds,
    isLoading,
    setSelectedTypeId,
    setSelectedSousTypeId,
    handleAddTravail,
    handleRemoveTravail,
    handleResetTravaux,
    // Autres fonctions retournées...
  };
};
