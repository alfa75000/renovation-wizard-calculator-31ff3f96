
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";

const Recapitulatif = () => {
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

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Récapitulatif simplifié</CardTitle>
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
