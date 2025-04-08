import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, ArrowLeft, ArrowRight, Paintbrush, Square } from "lucide-react";
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import AutreSurfaceForm from "@/features/renovation/components/AutreSurfaceForm";

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
  const { state: projectState } = useProject();
  const { rooms } = projectState;
  const { getTravauxForPiece, addTravail, deleteTravail } = useTravaux();

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travailAModifier, setTravailAModifier] = useState<Travail | null>(null);
  const [isAutreSurfaceDrawerOpen, setIsAutreSurfaceDrawerOpen] = useState(false);

  useEffect(() => {
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0].id);
    }
    
    if (selectedRoom && !rooms.find(room => room.id === selectedRoom)) {
      setSelectedRoom(rooms.length > 0 ? rooms[0].id : null);
    }
  }, [rooms, selectedRoom]);

  const selectedRoomInfo = selectedRoom 
    ? rooms.find(room => room.id === selectedRoom)
    : null;

  const travauxForSelectedRoom = selectedRoom 
    ? getTravauxForPiece(selectedRoom)
    : [];

  const handleAddTravail = () => {
    if (!selectedRoom) {
      toast.error("Veuillez d'abord sélectionner une pièce pour ajouter des travaux.");
      return;
    }
    setTravailAModifier(null);
    setIsDrawerOpen(true);
  };

  const handleAddAutreSurface = () => {
    if (!selectedRoom) {
      toast.error("Veuillez d'abord sélectionner une pièce pour ajouter une surface personnalisée.");
      return;
    }
    setIsAutreSurfaceDrawerOpen(true);
  };

  const handleEditTravail = (travail: Travail) => {
    setTravailAModifier(travail);
    setIsDrawerOpen(true);
  };

  const handleSubmitTravail = (travailData: Omit<Travail, 'id'>) => {
    if (!selectedRoom) return;
    
    if (travailAModifier) {
      toast.info("La modification de travaux n'est pas encore implémentée");
      setIsDrawerOpen(false);
      return;
    }
    
    addTravail({
      ...travailData,
      pieceId: selectedRoom,
    });
    
    setIsDrawerOpen(false);
    toast.success("Le travail a été ajouté avec succès.");
  };

  const handleDeleteTravail = (travailId: string) => {
    deleteTravail(travailId);
    toast.success("Le travail a été supprimé avec succès.");
  };

  const handleAutreSurfaceSubmit = (autreSurfaceData: any) => {
    console.log("Données d'autre surface soumises:", autreSurfaceData);
    toast.success("Surface personnalisée ajoutée avec succès");
    setIsAutreSurfaceDrawerOpen(false);
  };

  return (
    <Layout
      title="Définir les Travaux"
      subtitle="Sélectionnez une pièce et ajoutez les travaux à effectuer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline"
                onClick={handleAddAutreSurface}
                disabled={!selectedRoom}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Ajouter Autre Surface
              </Button>
              
              <Button 
                onClick={handleAddTravail}
                disabled={!selectedRoom}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un travail
              </Button>
            </div>
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
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleAddAutreSurface}
                    >
                      <Square className="h-4 w-4" />
                      Ajouter Autre Surface
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleAddTravail}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Ajouter des travaux
                    </Button>
                  </div>
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

      <Drawer open={isAutreSurfaceDrawerOpen} onOpenChange={setIsAutreSurfaceDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Ajouter une surface personnalisée</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 pt-2 overflow-y-auto">
            <AutreSurfaceForm 
              roomId={selectedRoom || ''}
              onSubmit={handleAutreSurfaceSubmit}
              onCancel={() => setIsAutreSurfaceDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Travaux;
