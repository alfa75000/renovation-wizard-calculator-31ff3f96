
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
} from "lucide-react";
import { Link } from "react-router-dom";
import PieceSelect from "@/features/travaux/components/PieceSelect";
import { useProject } from "@/contexts/ProjectContext";
import TravailForm from "@/features/travaux/components/TravailForm";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import TravauxList from "@/features/travaux/components/TravauxList";
import { Piece, Room } from "@/types";

const Travaux = () => {
  const { state } = useProject();
  const { rooms } = state;
  
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const { travailAModifier, getTravauxForPiece, addTravail, setTravailAModifier } = useTravaux();
  
  // Préparer les pièces avec les propriétés nécessaires pour le calcul automatique
  const preparedRooms: Piece[] = rooms.map(room => {
    // Calculons la surface des plinthes si nécessaire (hauteur plinthes * périmètre)
    const plinthSurface = room.totalPlinthSurface ? parseFloat(room.totalPlinthSurface) : 0;
    
    // Surface nette des murs après déduction des plinthes
    const netWallSurfaceWithoutPlinths = room.netWallSurface 
      ? parseFloat(room.netWallSurface) 
      : 0;
    
    return {
      id: room.id,
      name: room.name || room.customName || room.type,
      type: room.type,
      customName: room.customName,
      surface: room.surface,
      // Conversion et normalisation des surfaces pour le calcul automatique
      surfaceNetteSol: room.surface,
      surfaceNettePlafond: room.surface,
      surfaceNetteMurs: room.netWallSurface, // Surface nette des murs (déjà calculée avec déduction des plinthes)
      lineaireNet: room.totalPlinthLength,
      surfaceMenuiseries: room.totalMenuiserieSurface,
      // Propriétés supplémentaires pour compatibilité
      netWallSurface: room.netWallSurface,
      totalPlinthLength: room.totalPlinthLength,
      totalPlinthSurface: room.totalPlinthSurface,
      totalMenuiserieSurface: room.totalMenuiserieSurface,
      // Autres propriétés nécessaires
      length: room.length,
      width: room.width,
      height: room.height,
      plinthHeight: room.plinthHeight,
      wallSurfaceRaw: room.wallSurfaceRaw,
      menuiseries: room.menuiseries
    } as Piece;
  });
  
  const selectedPiece = selectedPieceId 
    ? preparedRooms.find(room => room.id === selectedPieceId) 
    : null;

  // Fonction pour démarrer l'édition
  const handleStartEdit = (id: string) => {
    setTravailAModifier(id);
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
                pieces={preparedRooms}
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
                <div className="space-y-8">
                  {/* Formulaire et liste */}
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <TravailForm 
                        piece={selectedPiece} 
                        onAddTravail={addTravail}
                        travailAModifier={travailAModifier}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Liste des travaux
                        {getTravauxForPiece(selectedPieceId).length > 0 && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {getTravauxForPiece(selectedPieceId).length}
                          </span>
                        )}
                      </h3>
                      <TravauxList 
                        pieceId={selectedPieceId} 
                        onStartEdit={handleStartEdit}
                      />
                    </div>
                  </div>
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
