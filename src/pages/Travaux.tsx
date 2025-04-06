
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Paintbrush,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { useTravauxTypes } from "@/contexts/TravauxTypesContext";
import { Room, Travail } from "@/types";
import { toast } from "@/components/ui/use-toast";
import TravailForm from "@/features/travaux/components/TravailForm";

// Interfaces temporaires pour assurer la compatibilité
interface PieceSelectProps {
  pieces: Room[];
  selectedPieceId: string | null;
  onSelect: (pieceId: string) => void;
}

// Composant adapté pour la sélection des pièces
const PieceSelect: React.FC<PieceSelectProps> = ({ 
  pieces, 
  selectedPieceId, 
  onSelect 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {pieces.length > 0 ? (
        pieces.map(piece => (
          <Button
            key={piece.id}
            variant={selectedPieceId === piece.id ? "default" : "outline"}
            className="justify-start"
            onClick={() => onSelect(piece.id)}
          >
            {piece.name} ({piece.surface || "0.00"} m²)
          </Button>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>Aucune pièce disponible.</p>
          <p className="text-sm mt-1">Ajoutez des pièces depuis l'estimateur principal.</p>
        </div>
      )}
    </div>
  );
};

const Travaux = () => {
  // Context et hooks
  const { state: projectState } = useProject();
  const { rooms } = projectState;
  
  const { state: travauxTypesState } = useTravauxTypes();
  const { types } = travauxTypesState;
  
  const { getTravauxForPiece, addTravail, deleteTravail } = useTravaux();

  // États
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sélectionner la première pièce au chargement s'il y en a
  useEffect(() => {
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0].id);
    }
    
    // Si la pièce actuelle n'existe plus
    if (selectedRoom && !rooms.find(room => room.id === selectedRoom)) {
      setSelectedRoom(rooms.length > 0 ? rooms[0].id : null);
    }
  }, [rooms, selectedRoom]);

  // Informations sur la pièce sélectionnée
  const selectedRoomInfo = selectedRoom 
    ? rooms.find(room => room.id === selectedRoom)
    : null;

  // Travaux pour la pièce sélectionnée
  const travauxForSelectedRoom = selectedRoom 
    ? getTravauxForPiece(selectedRoom)
    : [];

  // Ouvrir le tiroir pour ajouter un nouveau travail
  const handleAddTravail = () => {
    if (!selectedRoom) {
      toast({
        title: "Aucune pièce sélectionnée",
        description: "Veuillez d'abord sélectionner une pièce pour ajouter des travaux.",
        variant: "destructive",
      });
      return;
    }
    setIsDrawerOpen(true);
  };

  // Soumettre un nouveau travail
  const handleSubmitTravail = (travailData: Omit<Travail, 'id'>) => {
    if (!selectedRoom) return;
    
    addTravail({
      ...travailData,
      pieceId: selectedRoom,
    });
    
    setIsDrawerOpen(false);
    
    toast({
      title: "Travail ajouté",
      description: "Le travail a été ajouté avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Paintbrush className="h-8 w-8" />
            Définir les Travaux
          </h1>
          <p className="mt-2 text-lg text-center">
            Sélectionnez une pièce et ajoutez les travaux à effectuer
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Page de saisie
            </Link>
          </Button>
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/travaux">
              <Paintbrush className="h-4 w-4" />
              Définir les travaux
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              <ChevronRight className="h-4 w-4" />
              Récapitulatif
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/parametres">
              Paramètres
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection de pièce */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Pièces</CardTitle>
              <CardDescription>
                Sélectionnez une pièce pour ajouter ou voir les travaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieceSelect
                pieces={rooms} 
                selectedPieceId={selectedRoom}
                onSelect={setSelectedRoom}
              />
            </CardContent>
          </Card>

          {/* Liste des travaux */}
          <Card className="lg:col-span-2 order-1 lg:order-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5" />
                  {selectedRoomInfo 
                    ? `Travaux pour ${selectedRoomInfo.name}`
                    : "Travaux"
                  }
                </CardTitle>
                <CardDescription>
                  {selectedRoomInfo 
                    ? `${selectedRoomInfo.name} (${selectedRoomInfo.surface || "0"} m²)`
                    : "Veuillez sélectionner une pièce"
                  }
                </CardDescription>
              </div>
              
              <Button 
                onClick={handleAddTravail}
                disabled={!selectedRoom}
                className="ml-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un travail
              </Button>
            </CardHeader>
            <CardContent>
              {travauxForSelectedRoom.length > 0 ? (
                <div className="space-y-4">
                  {travauxForSelectedRoom.map(travail => (
                    <div key={travail.id} className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{travail.typeTravauxLabel}: {travail.sousTypeLabel}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteTravail(travail.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {travail.quantite} {travail.unite} à {(travail.prixFournitures + travail.prixMainOeuvre).toFixed(2)}€/{travail.unite}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Aucun travail n'a été ajouté pour cette pièce.</p>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleAddTravail}
                    disabled={!selectedRoom}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter des travaux
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-8">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la saisie
            </Link>
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Récapitulatif
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tiroir pour ajouter un nouveau travail */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Ajouter un travail</SheetTitle>
          </SheetHeader>
          
          <div className="py-4">
            <TravailForm 
              piece={selectedRoomInfo}
              onAddTravail={handleSubmitTravail}
              travailAModifier={null}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Travaux;
