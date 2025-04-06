
import React from "react";
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
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import PieceSelect from "@/features/travaux/components/PieceSelect";
import { useProject } from "@/contexts/ProjectContext";

const Travaux = () => {
  const { state } = useProject();
  const { rooms } = state;
  
  const [selectedPieceId, setSelectedPieceId] = React.useState<string | null>(null);
  
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
                <div className="text-center py-4">
                  <p>Interface de configuration des travaux pour la pièce sélectionnée.</p>
                  <p className="text-sm mt-1 text-gray-500">La fonctionnalité complète sera implémentée ultérieurement.</p>
                </div>
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
