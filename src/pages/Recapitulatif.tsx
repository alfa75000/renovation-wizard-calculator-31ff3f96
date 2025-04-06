
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Home, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";

const Recapitulatif = () => {
  const { state } = useProject();
  const { property, rooms } = state;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Récapitulatif des travaux
          </h1>
          <p className="mt-2 text-lg">Estimation détaillée par pièce</p>
        </div>
        
        <div className="mb-8 flex justify-center space-x-4">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              Page de saisie
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/travaux">
              Page d'ajout des travaux
            </Link>
          </Button>
          
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Page Récapitulatif
            </Link>
          </Button>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/travaux">
              <ArrowLeft className="h-4 w-4" />
              Retour aux travaux
            </Link>
          </Button>

          <Button className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer le devis
          </Button>
        </div>

        {/* Nouvelle carte pour les informations générales du bien */}
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Informations générales du bien
            </CardTitle>
            <CardDescription>
              Caractéristiques principales du bien à rénover
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Type de bien</span>
                <span className="font-medium">{property.type}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nombre de niveaux</span>
                <span className="font-medium">{property.floors}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Surface totale</span>
                <span className="font-medium">{property.totalArea} m²</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Hauteur sous plafond</span>
                <span className="font-medium">{property.ceilingHeight} m</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nombre de pièces</span>
                <span className="font-medium">{property.rooms}</span>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    {rooms.length} pièce(s) identifiée(s) pour ce bien avec une surface totale de {
                      rooms.reduce((total, room) => total + parseFloat(room.surface || "0"), 0).toFixed(2)
                    } m²
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Récapitulatif des travaux</CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Cette page affichera le récapitulatif des travaux sélectionnés.</p>
            <p className="text-sm mt-1 text-gray-500">La fonctionnalité complète sera implémentée ultérieurement.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recapitulatif;
