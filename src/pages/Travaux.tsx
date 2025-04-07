
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, ArrowLeft, ArrowRight, Paintbrush } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { Room, Travail } from "@/types";
import { toast } from "sonner";
import TravailForm from "@/features/travaux/components/TravailForm";
import TravailCard from "@/features/travaux/components/TravailCard";

// Composant pour la sélection des pièces
interface PieceSelectProps {
  pieces: Room[];
  selectedPieceId: string | null;
  onSelect: (pieceId: string) => void;
}

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
            {piece.name} ({piece.surface.toFixed(2)} m²)
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

const Travaux: React.FC = () => {
  // Context et hooks
  const { state: projectState } = useProject();
  const { rooms } = projectState;
  const { getTravauxForPiece, addTravail, deleteTravail } = useTravaux();

  // États
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travailAModifier, setTravailAModifier] = useState<Travail | null>(null);

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
      toast.error("Veuillez d'abord sélectionner une pièce pour ajouter des travaux.");
      return;
    }
    setTravailAModifier(null);
    setIsDrawerOpen(true);
  };

  // Éditer un travail existant
  const handleEditTravail = (travail: Travail) => {
    setTravailAModifier(travail);
    setIsDrawerOpen(true);
  };

  // Soumettre un nouveau travail
  const handleSubmitTravail = (travailData: Omit<Travail, 'id'>) => {
    if (!selectedRoom) return;
    
    if (travailAModifier) {
      // Mise à jour d'un travail existant
      // Note: cette fonctionnalité n'est pas encore implémentée
      toast.info("La modification de travaux n'est pas encore implémentée");
      setIsDrawerOpen(false);
      return;
    }
    
    // Ajout d'un nouveau travail
    addTravail({
      ...travailData,
      pieceId: selectedRoom,
    });
    
    setIsDrawerOpen(false);
    toast.success("Le travail a été ajouté avec succès.");
  };

  // Supprimer un travail
  const handleDeleteTravail = (travailId: string) => {
    deleteTravail(travailId);
    toast.success("Le travail a été supprimé avec succès.");
  };

  return (
    <Layout
      title="Définir les Travaux"
      subtitle="Sélectionnez une pièce et ajoutez les travaux à effectuer"
    >
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
                  ? `${selectedRoomInfo.name} (${selectedRoomInfo.surface.toFixed(2)} m²)`
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
                  <TravailCard
                    key={travail.id}
                    travail={travail}
                    onEdit={handleEditTravail}
                    onDelete={handleDeleteTravail}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  {selectedRoom 
                    ? "Aucun travail n'a été ajouté pour cette pièce."
                    : "Veuillez sélectionner une pièce pour afficher ou ajouter des travaux."
                  }
                </p>
                {selectedRoom && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleAddTravail}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter des travaux
                  </Button>
                )}
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

      {/* Tiroir pour ajouter/modifier un travail */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {travailAModifier ? "Modifier un travail" : "Ajouter un travail"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-4">
            <TravailForm 
              piece={selectedRoomInfo}
              onAddTravail={handleSubmitTravail}
              travailAModifier={travailAModifier}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Travaux;
