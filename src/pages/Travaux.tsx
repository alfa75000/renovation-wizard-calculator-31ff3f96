
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Home,
  ArrowRight,
  Settings,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import PieceSelect from "@/features/travaux/components/PieceSelect";
import { useProject } from "@/contexts/ProjectContext";
import TravailForm from "@/features/travaux/components/TravailForm";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { Travail } from "@/types";
import TravauxList from "@/features/travaux/components/TravauxList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Travaux = () => {
  const { state } = useProject();
  const { rooms } = state;
  const { toast } = useToast();
  
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const { addTravail, getTravauxForPiece, travailAModifier } = useTravaux();
  
  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState("ajouter");
  
  // Effet pour basculer vers l'onglet d'ajout lors de l'édition
  useEffect(() => {
    if (travailAModifier) {
      setActiveTab("ajouter");
    }
  }, [travailAModifier]);
  
  const selectedPiece = selectedPieceId 
    ? rooms.find(room => room.id === selectedPieceId) 
    : null;
  
  const handleAddTravail = (travail: Omit<Travail, "id">) => {
    addTravail(travail);
    toast({
      title: "Travail ajouté",
      description: `Le travail ${travail.typeTravauxLabel} - ${travail.sousTypeLabel} a été ajouté avec succès.`,
      variant: "default",
    });
    // Basculer vers l'onglet liste après avoir ajouté un travail
    setActiveTab("liste");
  };
  
  // Fonction pour basculer vers l'onglet d'ajout lors de l'édition
  const handleStartEdit = () => {
    setActiveTab("ajouter");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Travaux à prévoir
          </h1>
          <p className="mt-2 text-lg">Sélectionnez les travaux pour chaque pièce</p>
        </div>

        <div className="mb-8 flex justify-center space-x-4">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              Page de saisie
            </Link>
          </Button>
          
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/travaux">
              Page d'ajout des travaux
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Page Récapitulatif
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/parametres">
              <Settings className="h-4 w-4 mr-1" />
              Page Paramètres
            </Link>
          </Button>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'estimateur
            </Link>
          </Button>

          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Voir le récapitulatif
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Pièces à rénover
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieceSelect 
                pieces={rooms}
                selectedPieceId={selectedPieceId}
                onSelect={setSelectedPieceId}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Configuration des travaux</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPieceId ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ajouter">
                      {travailAModifier ? "Modifier un travail" : "Ajouter des travaux"}
                    </TabsTrigger>
                    <TabsTrigger value="liste">
                      Liste des travaux
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {getTravauxForPiece(selectedPieceId).length}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ajouter" className="mt-4">
                    <TravailForm 
                      piece={selectedPiece} 
                      onAddTravail={handleAddTravail}
                    />
                  </TabsContent>
                  
                  <TabsContent value="liste" className="mt-4">
                    <TravauxList 
                      pieceId={selectedPieceId} 
                      onStartEdit={handleStartEdit}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Veuillez sélectionner une pièce pour configurer les travaux.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Travaux;
