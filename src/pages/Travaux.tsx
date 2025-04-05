
import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Paintbrush, 
  Hammer, 
  Wrench, 
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

const Travaux = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Types de Travaux
          </h1>
          <p className="mt-2 text-lg">Choisissez les travaux à réaliser pour chaque pièce</p>
        </div>

        <div className="mb-4">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour aux Pièces
            </Link>
          </Button>
        </div>

        <Card className="mb-8 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Home className="h-5 w-5 mr-2" />
              <h2 className="text-xl font-semibold">Travaux à prévoir</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="room-card hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Paintbrush className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium">Peinture</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>Murs</li>
                    <li>Plafonds</li>
                    <li>Boiseries</li>
                    <li>Plinthes</li>
                  </ul>
                  <Button className="w-full mt-4">Choisir</Button>
                </CardContent>
              </Card>

              <Card className="room-card hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Wrench className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium">Revêtements de sol</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>Parquet</li>
                    <li>Carrelage</li>
                    <li>Moquette</li>
                    <li>Vinyle</li>
                    <li>Béton ciré</li>
                  </ul>
                  <Button className="w-full mt-4">Choisir</Button>
                </CardContent>
              </Card>

              <Card className="room-card hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Hammer className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium">Menuiseries</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>Portes</li>
                    <li>Fenêtres</li>
                    <li>Portes-fenêtres</li>
                    <li>Plinthes</li>
                  </ul>
                  <Button className="w-full mt-4">Choisir</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Travaux;
