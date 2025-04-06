
import { useEffect, useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import TravauxList from "@/features/travaux/components/TravauxList";
import TravailForm from "@/features/travaux/components/TravailForm";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Travail } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const Travaux = () => {
  const { state, dispatch } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleAjouterTravail = () => {
    setIsFormOpen(true);
  };

  const handleCreateTravail = (travailData: Omit<Travail, 'id'>) => {
    const newTravail: Travail = {
      id: uuidv4(),
      ...travailData
    };

    dispatch({ type: 'ADD_TRAVAIL', payload: newTravail });
    setIsFormOpen(false);
    toast({
      title: "Travail ajouté avec succès!",
      description: "Le travail a été ajouté à la liste.",
    })
  };

  const handleUpdateTravail = (travailId: string, updatedTravailData: Omit<Travail, 'id'>) => {
    dispatch({ type: 'UPDATE_TRAVAIL', payload: { id: travailId, ...updatedTravailData } });
    toast({
      title: "Travail mis à jour avec succès!",
      description: "Le travail a été modifié dans la liste.",
    })
  };

  const handleDeleteTravail = (travailId: string) => {
    dispatch({ type: 'DELETE_TRAVAIL', payload: travailId });
    toast({
      title: "Travail supprimé avec succès!",
      description: "Le travail a été supprimé de la liste.",
    })
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Ajout des travaux</h1>
            <p className="text-gray-500">Définissez les travaux à réaliser pour votre projet</p>
          </div>

          <TravauxList
            pieceId={state.rooms[0]?.id || ""}
            onStartEdit={(id) => console.log("Edit travail", id)}
          />

          {isFormOpen ? (
            <TravailForm 
              piece={state.rooms[0] || null}
              onAddTravail={handleCreateTravail}
              travailAModifier={null}
            />
          ) : (
            <Button onClick={handleAjouterTravail}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Ajouter un travail
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Travaux;
